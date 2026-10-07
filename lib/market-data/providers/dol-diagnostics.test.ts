import { spawnSync } from "node:child_process";
import { afterEach, describe, expect, it, vi } from "vitest";
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

afterEach(() => vi.restoreAllMocks());

describe("temporary DOL diagnostics", () => {
  it("captures a real PDF.js initialization failure without leaking it into the public result", () => {
    const providerUrl = new URL("./dol.ts", import.meta.url).href;
    const child = spawnSync(process.execPath, ["--import", "tsx", "--input-type=module", "-e", `
      import Module from "node:module";
      const originalLoad = Module._load;
      Module._load = function (identifier, ...args) {
        if (identifier === "@napi-rs/canvas") {
          const error = new Error("Cannot find module '@napi-rs/canvas'");
          error.code = "MODULE_NOT_FOUND";
          throw error;
        }
        return Reflect.apply(originalLoad, this, [identifier, ...args]);
      };
      const provider = await import(${JSON.stringify(providerUrl)});
      const { fetchDolCoreClaims } = provider.default ?? provider;
      const result = await fetchDolCoreClaims({
        now: new Date("2026-10-07T12:00:00.000Z"),
        fetchImpl: async () => new Response("%PDF-1.7"),
      });
      console.log("PUBLIC_RESULT:" + JSON.stringify(result));
    `], { encoding: "utf8", timeout: 10_000 });

    expect(child.status, child.stderr).toBe(0);
    const publicJson = child.stdout.split("PUBLIC_RESULT:")[1].trim();
    expect(JSON.parse(publicJson)).toMatchObject({
      state: "FAILED", parserStatus: "FAILED", historyStatus: "PARTIAL", observations: [], retrievedAt: null,
    });
    expect(publicJson).not.toContain("DOMMatrix");
    expect(publicJson).not.toContain("TEMPORARY");
    expect(child.stderr).toContain('"stage":"DOL_PDF_INIT"');
    const diagnosticLine = child.stderr.split("\n").find((line) => line.startsWith('{"diagnostic":'))!;
    expect(JSON.parse(diagnosticLine)).toMatchObject({
      diagnostic: "TEMPORARY_DOL",
      stage: "DOL_PDF_INIT",
      exceptionName: "ReferenceError",
      exceptionMessage: "DOMMatrix is not defined",
      stackLocation: expect.stringMatching(/^pdf\.mjs:\d+:\d+$/),
    });
  });

  it("identifies a body-read exception while keeping the payload and internal paths out of the log", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const error = new Error("body read failed");
    error.stack = "Error: body read failed\n    at readBody (/private/task/response.js:10:2)";
    const response = new Response("pdf-payload-never-logged");
    vi.spyOn(response, "arrayBuffer").mockRejectedValue(error);

    const result = await fetchDolCoreClaims({ fetchImpl: async () => response });

    expect(result).toMatchObject({ state: "FAILED", observations: [], retrievedAt: null });
    expect(JSON.stringify(result)).not.toContain(error.message);
    expect(log).toHaveBeenCalledOnce();
    const logJson = String(log.mock.calls[0][0]);
    expect(JSON.parse(logJson)).toMatchObject({
      stage: "DOL_BODY", exceptionName: "Error", exceptionMessage: "body read failed", stackLocation: "response.js:10:2",
    });
    expect(logJson).not.toContain("pdf-payload-never-logged");
    expect(logJson).not.toContain("/private/task/");
  });

  it("preserves successful claims and partial history without diagnostic output", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const release = [
      "UNEMPLOYMENT INSURANCE WEEKLY CLAIMS",
      "SEASONALLY ADJUSTED DATA",
      "8:30 A.M. (Eastern) Thursday, October 1, 2026",
      "Seasonally Adjusted US Weekly UI Claims (in thousands)",
      "Change Change", "from from", "Initial Prior 4-Week Insured Prior 4-Week",
      "Week Ending Claims Week Average Unemployment Week Average IUR",
      "September 5, 2026 200 0 200.00 1,700 -10 1,720.00 1.1",
      "September 12, 2026 200 0 200.00 1,700 -10 1,720.00 1.1",
      "September 19, 2026 200 0 200.00 1,700 -10 1,720.00 1.1",
      "September 26, 2026 197 0 200.00 1,700 -10 1,720.00 1.1",
    ].join("\n");

    const result = await fetchDolCoreClaims({
      now: new Date("2026-10-07T12:00:00.000Z"),
      fetchImpl: async () => new Response(release),
    });

    expect(result).toMatchObject({ state: "AVAILABLE", parserStatus: "VERIFIED", historyStatus: "PARTIAL" });
    expect(result.observations).toHaveLength(4);
    expect(result.observations.at(-1)).toMatchObject({ value: 197, observedAt: "2026-09-26", releasedAt: "2026-10-01" });
    expect(log).not.toHaveBeenCalled();
  });
});
