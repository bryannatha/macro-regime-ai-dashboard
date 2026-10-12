import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from "vitest";
import { fetchDolCoreClaims } from "./dol";

vi.mock("pdfjs-dist/legacy/build/pdf.mjs", () => ({
  getDocument: ({ data }: { data: Uint8Array }) => ({
    promise: Promise.resolve({
      numPages: 1,
      getPage: async () => ({
        getTextContent: async () => ({
          items: new TextDecoder().decode(data).split("\n").map((str, index) => ({
            str, transform: [1, 0, 0, 1, 0, 800 - index * 12],
          })),
        }),
      }),
      destroy: async () => undefined,
    }),
  }),
}));

const now = new Date("2026-10-12T13:00:00.000Z");
const officialUrl = "https://www.dol.gov/ui/data.pdf";
const genericFailure = {
  state: "FAILED", observations: [], parserStatus: "FAILED", historyStatus: "PARTIAL", retrievedAt: null,
  reason: "The official DOL weekly claims release is temporarily unavailable or invalid.",
};

function responseWithUrl(response: Response, url = officialUrl, redirected = true): Response {
  Object.defineProperties(response, { url: { value: url }, redirected: { value: redirected } });
  return response;
}

function release(): string {
  return [
    "UNEMPLOYMENT INSURANCE WEEKLY CLAIMS", "SEASONALLY ADJUSTED DATA",
    "8:30 A.M. (Eastern) Thursday, October 8, 2026",
    "Seasonally Adjusted US Weekly UI Claims (in thousands)", "Change Change", "from from",
    "Initial Prior 4-Week Insured Prior 4-Week", "Week Ending Claims Week Average Unemployment Week Average IUR",
    "September 12, 2026 198 0 200.00 1,700 -10 1,720.00 1.1",
    "September 19, 2026 198 0 200.00 1,700 -10 1,720.00 1.1",
    "September 26, 2026 199 0 200.00 1,700 -10 1,720.00 1.1",
    "October 3, 2026 197 0 200.00 1,700 -10 1,720.00 1.1",
  ].join("\n");
}

describe("DOL HTTP failure observability", () => {
  let warnings: MockInstance<typeof console.warn>;

  beforeEach(() => {
    warnings = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(now);
    vi.spyOn(performance, "now").mockReturnValueOnce(100).mockReturnValue(125.5);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it.each([429, 500, 502, 503, 504])("records observable HTTP %i without retrying or exposing response contents", async (status) => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(responseWithUrl(new Response("private upstream body", { status })));
    const result = await fetchDolCoreClaims({ fetchImpl, now });

    expect(result).toMatchObject({ ...genericFailure, reason: "The DOL source returned an unsuccessful response." });
    expect(fetchImpl.mock.calls).toEqual([["https://oui.doleta.gov/unemploy/weeklyRedirect.php", { next: { revalidate: 3600 } }]]);
    expect(warnings.mock.calls).toEqual([[JSON.stringify({
      event: "DOL_HTTP_FAILURE", sourceId: "dol-initial-claims", stage: "DOL_HTTP_RESPONSE",
      httpStatus: status, responseHost: "www.dol.gov", responsePath: "/ui/data.pdf", redirected: true,
      durationMs: 25.5, attemptedAt: now.toISOString(), exceptionClass: null, exceptionCode: null,
    })]]);
    expect(JSON.stringify(result)).not.toMatch(/httpStatus|durationMs|private upstream/);
  });

  it("records a directly returned redirect status without guessing a redirect chain or logging Location", async () => {
    const response = responseWithUrl(new Response(null, {
      status: 302, headers: { Location: "https://external.example/private?token=do-not-log" },
    }), "https://oui.doleta.gov/unemploy/weeklyRedirect.php", false);
    await fetchDolCoreClaims({ fetchImpl: vi.fn<typeof fetch>().mockResolvedValue(response), now });

    const event = JSON.parse(warnings.mock.calls[0]?.[0] ?? "{}");
    expect(event).toMatchObject({ httpStatus: 302, responseHost: "oui.doleta.gov", responsePath: "/unemploy/weeklyRedirect.php", redirected: false });
    expect(Object.keys(event)).not.toContain("redirectHops");
    expect(JSON.stringify(event)).not.toMatch(/external|do-not-log|Location/);
  });

  it.each([
    "https://user:password@www.dol.gov/ui/data.pdf?token=private#private",
    "http://www.dol.gov/ui/data.pdf?key=private",
  ])("strips credentials, queries and fragments from an official response URL (%s)", async (url) => {
    await fetchDolCoreClaims({ fetchImpl: vi.fn<typeof fetch>().mockResolvedValue(responseWithUrl(new Response(null, { status: 503 }), url)), now });
    expect(warnings).toHaveBeenCalledOnce();
    const event = JSON.parse(warnings.mock.calls[0][0]);
    expect(event).toMatchObject({ responseHost: "www.dol.gov", responsePath: "/ui/data.pdf" });
    expect(JSON.stringify(event)).not.toMatch(/password|private|token|key=|user:/);
  });

  it.each([
    "https://www.dol.gov.external.example/ui/data.pdf",
    "https://external.example/ui/data.pdf",
    "https://www.dol.gov/private/user-data.pdf",
    "https://www.dol.gov:8443/ui/data.pdf",
    "file:///private/document.pdf",
    "not a URL",
  ])("does not log unrestricted response locations (%s)", async (url) => {
    await fetchDolCoreClaims({ fetchImpl: vi.fn<typeof fetch>().mockResolvedValue(responseWithUrl(new Response(null, { status: 503 }), url)), now });
    expect(warnings).toHaveBeenCalledOnce();
    expect(JSON.parse(warnings.mock.calls[0][0])).toMatchObject({ responseHost: null, responsePath: null });
  });

  it("leaves unavailable response metadata unknown", async () => {
    await fetchDolCoreClaims({ fetchImpl: vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 503 })), now });
    expect(warnings).toHaveBeenCalledOnce();
    expect(JSON.parse(warnings.mock.calls[0][0])).toMatchObject({ httpStatus: 503, responseHost: null, responsePath: null, redirected: false });
  });

  it("records only the verified official dated-PDF path", async () => {
    const response = responseWithUrl(new Response(null, { status: 503 }), "https://oui.doleta.gov/press/2026/100826.pdf?token=private");
    await fetchDolCoreClaims({ fetchImpl: vi.fn<typeof fetch>().mockResolvedValue(response), now });
    expect(warnings).toHaveBeenCalledOnce();
    expect(JSON.parse(warnings.mock.calls[0][0])).toMatchObject({ responseHost: "oui.doleta.gov", responsePath: "/press/2026/100826.pdf" });
    expect(warnings.mock.calls[0][0]).not.toContain("private");
  });

  it("records the actual attempt clock rather than an injected observation cutoff", async () => {
    await fetchDolCoreClaims({ fetchImpl: vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 503 })), now: new Date("2026-10-04T12:00:00.000Z") });
    expect(warnings).toHaveBeenCalledOnce();
    expect(JSON.parse(warnings.mock.calls[0][0])).toMatchObject({ attemptedAt: "2026-10-12T13:00:00.000Z" });
  });

  it("does not turn a response error status of zero into an HTTP status", async () => {
    const result = await fetchDolCoreClaims({ fetchImpl: vi.fn<typeof fetch>().mockResolvedValue(Response.error()), now });
    expect(result).toMatchObject({ state: "FAILED", reason: "The DOL source returned an unsuccessful response." });
    expect(warnings).toHaveBeenCalledOnce();
    expect(JSON.parse(warnings.mock.calls[0][0])).toMatchObject({ stage: "DOL_HTTP_RESPONSE", httpStatus: null });
  });

  it.each([null, undefined])("records invalid response inspection without changing the fail-closed result (%s)", async (response) => {
    const result = await fetchDolCoreClaims({ fetchImpl: vi.fn<typeof fetch>().mockResolvedValue(response as unknown as Response), now });
    expect(result).toMatchObject(genericFailure);
    expect(warnings).toHaveBeenCalledOnce();
    expect(JSON.parse(warnings.mock.calls[0][0])).toMatchObject({
      stage: "DOL_HTTP_RESPONSE", httpStatus: null, responseHost: null, responsePath: null, redirected: null, exceptionClass: "TypeError",
    });
  });

  it("classifies a network exception using only allowlisted information", async () => {
    const error = new TypeError("secret URL https://private.example/?password=private", { cause: { code: "ECONNRESET", message: "private" } });
    const fetchImpl = vi.fn<typeof fetch>().mockRejectedValue(error);
    const result = await fetchDolCoreClaims({ fetchImpl, now });
    expect(result).toMatchObject(genericFailure);
    expect(fetchImpl).toHaveBeenCalledOnce();
    expect(warnings).toHaveBeenCalledOnce();
    expect(JSON.parse(warnings.mock.calls[0][0])).toMatchObject({ stage: "DOL_HTTP_REQUEST", httpStatus: null, exceptionClass: "TypeError", exceptionCode: "ECONNRESET" });
    expect(warnings.mock.calls[0][0]).not.toMatch(/secret|password|private/);
    expect(JSON.stringify(result)).not.toContain("ECONNRESET");
  });

  it.each(["private exception text", { name: "private", code: "private" }])("does not serialize unknown thrown values", async (error) => {
    await fetchDolCoreClaims({ fetchImpl: vi.fn<typeof fetch>().mockRejectedValue(error), now });
    expect(warnings).toHaveBeenCalledOnce();
    expect(JSON.parse(warnings.mock.calls[0][0])).toMatchObject({ exceptionClass: "UnknownError", exceptionCode: null });
    expect(warnings.mock.calls[0][0]).not.toContain("private");
  });

  it("does not serialize arbitrary exception names or codes", async () => {
    const error = Object.assign(new Error("private"), { name: "private exception name", cause: { code: "private" } });
    await fetchDolCoreClaims({ fetchImpl: vi.fn<typeof fetch>().mockRejectedValue(error), now });
    expect(warnings).toHaveBeenCalledOnce();
    expect(JSON.parse(warnings.mock.calls[0][0])).toMatchObject({ exceptionClass: "Error", exceptionCode: null });
    expect(warnings.mock.calls[0][0]).not.toContain("private");
  });

  it("distinguishes response-body failure from the initial request", async () => {
    const response = responseWithUrl(new Response(null, { status: 200 }));
    vi.spyOn(response, "arrayBuffer").mockRejectedValue(new TypeError("private stream failure"));
    const result = await fetchDolCoreClaims({ fetchImpl: vi.fn<typeof fetch>().mockResolvedValue(response), now });
    expect(result).toMatchObject(genericFailure);
    expect(warnings).toHaveBeenCalledOnce();
    expect(JSON.parse(warnings.mock.calls[0][0])).toMatchObject({ stage: "DOL_HTTP_BODY", httpStatus: 200, exceptionClass: "TypeError" });
  });

  it("does not emit HTTP failure telemetry for parser rejection after a successful response", async () => {
    const result = await fetchDolCoreClaims({ fetchImpl: vi.fn<typeof fetch>().mockResolvedValue(new Response("not the verified claims table")), now });
    expect(result).toMatchObject({ state: "FAILED", parserStatus: "FAILED", observations: [] });
    expect(warnings).not.toHaveBeenCalled();
  });

  it("keeps successful data and cache options intact without success logging", async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(responseWithUrl(new Response(release())));
    const result = await fetchDolCoreClaims({ fetchImpl, now });
    expect(result).toMatchObject({ state: "AVAILABLE", parserStatus: "VERIFIED", historyStatus: "PARTIAL", retrievedAt: now.toISOString() });
    expect(result.observations.map(({ observedAt, value, releasedAt }) => ({ observedAt, value, releasedAt }))).toEqual([
      { observedAt: "2026-09-12", value: 198, releasedAt: "2026-10-08" },
      { observedAt: "2026-09-19", value: 198, releasedAt: "2026-10-08" },
      { observedAt: "2026-09-26", value: 199, releasedAt: "2026-10-08" },
      { observedAt: "2026-10-03", value: 197, releasedAt: "2026-10-08" },
    ]);
    expect(fetchImpl.mock.calls).toEqual([["https://oui.doleta.gov/unemploy/weeklyRedirect.php", { next: { revalidate: 3600 } }]]);
    expect(warnings).not.toHaveBeenCalled();
  });

  it("keeps public failure semantics even if the server logger throws", async () => {
    warnings.mockImplementation(() => { throw new Error("logger unavailable"); });
    const result = await fetchDolCoreClaims({ fetchImpl: vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 503 })), now });
    expect(result).toMatchObject({ state: "FAILED", reason: "The DOL source returned an unsuccessful response." });
  });
});
