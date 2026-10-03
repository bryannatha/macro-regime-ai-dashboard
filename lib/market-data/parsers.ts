import { XMLParser } from "fast-xml-parser";
import type {
  MetricObservation,
  ObservationKey,
  ObservationPoint,
} from "@/lib/types";

const xmlParser = new XMLParser({
  ignoreAttributes: true,
  isArray: (name) => name === "entry" || name === "week",
  parseAttributeValue: false,
  parseTagValue: false,
  removeNSPrefix: true,
});

export function parseFiniteNumber(input: unknown): number | null {
  if (typeof input === "number") return Number.isFinite(input) ? input : null;
  if (typeof input !== "string") return null;

  const value = input.trim().replaceAll(",", "");
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(value)) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function parseIsoDate(input: unknown): string | null {
  if (typeof input !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(input)) return null;
  const date = new Date(`${input}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== input
    ? null
    : input;
}

export function parseUsDate(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(input.trim());
  if (!match) return null;
  return parseIsoDate(`${match[3]}-${match[1]}-${match[2]}`);
}

export function parseXml(input: string): Record<string, unknown> {
  return xmlParser.parse(input) as Record<string, unknown>;
}

export function createUnavailableObservation(
  input: Omit<MetricObservation, "status" | "value" | "observedAt" | "history"> & {
    observedAt?: string | null;
  },
): MetricObservation {
  return {
    ...input,
    value: null,
    observedAt: input.observedAt ?? null,
    history: [],
    status: "unavailable",
  };
}

export function createAvailableObservation(
  input: Omit<MetricObservation, "status">,
): MetricObservation {
  if (!Number.isFinite(input.value) || !parseIsoDate(input.observedAt)) {
    return createUnavailableObservation({
      key: input.key,
      label: input.label,
      unit: input.unit,
      source: input.source,
      sourceUrl: input.sourceUrl,
      fetchedAt: input.fetchedAt,
      cadence: input.cadence,
      detail: "The provider returned an invalid value or observation date.",
    });
  }

  const history: ObservationPoint[] = input.history.filter(
    (point) => parseIsoDate(point.date) !== null && Number.isFinite(point.value),
  );

  return { ...input, history, status: "available" };
}

export function observationFailure(
  key: ObservationKey,
  label: string,
  unit: string,
  source: string,
  sourceUrl: string,
  fetchedAt: string,
  cadence: MetricObservation["cadence"],
  detail = "The public source is temporarily unavailable.",
): MetricObservation {
  return createUnavailableObservation({
    key,
    label,
    unit,
    source,
    sourceUrl,
    fetchedAt,
    cadence,
    detail,
  });
}

export function getLatestHistoryPoint(points: ObservationPoint[]): ObservationPoint | null {
  return [...points].sort((a, b) => a.date.localeCompare(b.date)).at(-1) ?? null;
}
