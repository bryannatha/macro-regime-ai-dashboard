import { describe, expect, it, vi } from "vitest";

const coreLoaderState = vi.hoisted(() => ({ options: undefined as unknown }));

vi.mock("./providers/core-history", () => ({
  fetchCoreHistorySources: vi.fn(async (options: unknown) => {
    coreLoaderState.options = options;
    return [];
  }),
}));

import { getDashboardPayload } from "./index";

describe("default core-history dashboard loading", () => {
  it("shares the dashboard as-of timestamp with the core source loader", async () => {
    const fetchImpl = vi.fn<typeof fetch>(async () => new Response("unavailable", { status: 503 }));
    const payload = await getDashboardPayload({ fetchImpl });
    const loaderOptions = coreLoaderState.options as { now?: Date; fetchImpl?: typeof fetch } | undefined;

    expect(loaderOptions?.now).toBeInstanceOf(Date);
    expect(loaderOptions?.now?.toISOString()).toBe(payload.generatedAt);
  });
});
