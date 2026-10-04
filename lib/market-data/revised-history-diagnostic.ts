import { evaluateRegime } from "@/lib/regime";
import type {
  AssessmentStatus,
  CoreReadinessStatus,
  FactorMomentumInput,
  LeadingDirectionAssessment,
  PriorTensionComparison,
  Regime,
  RegimeAssessment,
  RegimeFactorKey,
  RegimeSensitivity,
  RegimeTension,
  RuleDiagnostic,
  ScoreBounds,
  SourceRegistryEntry,
  TransitionRiskAssessment,
  InflationDirectionAssessment,
} from "@/lib/types";
import { buildCoreFactors, type CoreFactorEvaluationMode } from "./core-factors";
import { createRegimeInputsFromCoreFactors } from "./regime-inputs";
import type { CoreFactorsResult, CoreObservationSeriesResult } from "./types";

export const CURRENT_REVISED_HISTORY_LABEL = "CURRENT / REVISED-HISTORY DIAGNOSTIC";
export const CURRENT_REVISED_HISTORY_DISCLAIMER =
  "Current revised historical values and current seasonal factors are not point-in-time vintages. This diagnostic does not claim true vintage validation or point-in-time performance.";
export const DEFAULT_DIAGNOSTIC_START_MONTH = "2015-01";
export const DEFAULT_DIAGNOSTIC_END_MONTH = "2025-12";
export const DEFAULT_WARMUP_MONTHS = 14;

export interface DiagnosticInspectionWindow {
  id: string;
  label: string;
  startMonth: string;
  endMonth: string;
}

export const DIAGNOSTIC_INSPECTION_WINDOWS: readonly DiagnosticInspectionWindow[] = [
  { id: "2017-2019", label: "2017-2019 expansion", startMonth: "2017-01", endMonth: "2019-12" },
  { id: "2020", label: "2020 shock and rebound", startMonth: "2020-01", endMonth: "2020-12" },
  { id: "2021", label: "2021 reflation", startMonth: "2021-01", endMonth: "2021-12" },
  { id: "2022", label: "2022 inflation and tightening", startMonth: "2022-01", endMonth: "2022-12" },
  { id: "2023-2024", label: "2023-2024 disinflation and soft landing", startMonth: "2023-01", endMonth: "2024-12" },
  { id: "2025", label: "2025 mixed episodes", startMonth: "2025-01", endMonth: "2025-12" },
];

export interface DiagnosticCalendar {
  warmupMonths: string[];
  snapshotMonths: string[];
}

export interface DiagnosticInspectionMonth extends DiagnosticInspectionWindow {
  snapshotCount: number;
  evaluated: boolean;
}

export interface DiagnosticFactorSnapshot {
  score: number | null;
  coverage: number;
  bounds: ScoreBounds;
  eligibleFamilies: number;
  configuredFamilies: number;
  historyYears: number | null;
  releaseQuality: number;
  status: CoreReadinessStatus;
}

export interface DiagnosticSnapshot {
  period: string;
  asOf: string;
  assessmentStatus: AssessmentStatus;
  regime: Regime | null;
  dataQuality: number | null;
  regimeClarity: number | null;
  factors: Record<RegimeFactorKey, DiagnosticFactorSnapshot>;
  ruleDiagnostics: Record<Regime, RuleDiagnostic>;
  tensions: RegimeTension[];
  leadingDirection: LeadingDirectionAssessment;
  inflationDirection: InflationDirectionAssessment;
  transitionRisk: TransitionRiskAssessment;
  thresholdSensitivity: RegimeSensitivity | null;
  sourceGaps: string[];
}

export interface DiagnosticHistoryMark {
  period: string;
  regime: Regime | null;
  assessmentStatus: AssessmentStatus;
  sensitivity: RegimeSensitivity | null;
}

export type DiagnosticFlagCode =
  | "SHORT_NAMED_DURATION"
  | "HIGH_NAMED_CHANGES"
  | "PROLONGED_MIXED_NO_ENVELOPE"
  | "THRESHOLD_SENSITIVE";

export interface DiagnosticFlag {
  code: DiagnosticFlagCode;
  periodStart: string;
  periodEnd: string;
  durationMonths: number;
  details: string;
  severity?: RegimeSensitivity["classification"];
}

export interface RegimeEpisode {
  regime: Regime;
  startPeriod: string;
  endPeriod: string;
  durationMonths: number;
}

export interface RegimeHistorySummary {
  episodes: RegimeEpisode[];
  namedChangesByYear: Record<string, number>;
  flags: DiagnosticFlag[];
}

export interface CurrentRevisedHistoryDiagnostic {
  label: typeof CURRENT_REVISED_HISTORY_LABEL;
  methodologyVersion: "US-MACRO-0.3";
  status: "COMPLETE" | "NOT_RUN";
  pointInTimeVintageValidation: false;
  vintageDisclaimer: string;
  calendar: DiagnosticCalendar;
  blockers: string[];
  sourceGaps: string[];
  snapshots: DiagnosticSnapshot[];
  summary: RegimeHistorySummary;
  inspectionWindows: DiagnosticInspectionMonth[];
}

interface DiagnosticOptions {
  sourceRegistry: SourceRegistryEntry[];
  series: CoreObservationSeriesResult[];
  startMonth?: string;
  endMonth?: string;
  warmupMonths?: number;
}

interface DiagnosticExecutionOptions extends Omit<DiagnosticOptions, "series"> {
  loadSeries: () => Promise<CoreObservationSeriesResult[]>;
}

const FACTOR_KEYS: RegimeFactorKey[] = [
  "inflation", "growth", "labor", "policyRates", "creditConditions", "liquidityProxy",
];
const ANCHOR_KEYS: RegimeFactorKey[] = ["inflation", "growth", "labor", "policyRates"];
const SUPPORT_KEYS: RegimeFactorKey[] = ["creditConditions", "liquidityProxy"];
const EVALUATION_MODE: CoreFactorEvaluationMode = "current-revised-history";

function isCoreFactorClassifiable(factor: CoreFactorsResult["factors"][RegimeFactorKey]): boolean {
  const { lower, upper } = factor.bounds;
  return Number.isFinite(lower) && Number.isFinite(upper) && lower >= 0 && upper <= 100 && lower <= upper &&
    factor.coverage >= 0.6 && factor.eligibleFamilies >= 2;
}

function eligibleFamilyKeys(core: CoreFactorsResult, factor: RegimeFactorKey): string[] {
  return core.factors[factor].families.filter(({ eligible }) => eligible).map(({ key }) => key).sort();
}

export function comparePriorTensions(
  previousCore: CoreFactorsResult | null,
  previousAssessment: Pick<RegimeAssessment, "assessmentStatus" | "factorReadiness" | "tensions"> | null,
  currentCore: CoreFactorsResult,
): PriorTensionComparison {
  if (!previousCore || !previousAssessment || previousAssessment.assessmentStatus === "INSUFFICIENT_DATA") {
    return { comparable: false, tensions: [] };
  }

  const comparableFactors = FACTOR_KEYS.every((key) =>
    previousAssessment.factorReadiness[key].classifiable &&
    isCoreFactorClassifiable(previousCore.factors[key]) &&
    isCoreFactorClassifiable(currentCore.factors[key]) &&
    eligibleFamilyKeys(previousCore, key).join("\0") === eligibleFamilyKeys(currentCore, key).join("\0"));
  return comparableFactors
    ? { comparable: true, tensions: previousAssessment.tensions }
    : { comparable: false, tensions: [] };
}

function monthSerial(month: string): number {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) throw new Error(`Invalid diagnostic month: ${month}`);
  const [year, monthNumber] = month.split("-").map(Number);
  return year * 12 + monthNumber - 1;
}

function monthFromSerial(serial: number): string {
  const year = Math.floor(serial / 12);
  const month = (serial % 12) + 1;
  return `${year}-${String(month).padStart(2, "0")}`;
}

function sequence(start: number, end: number): string[] {
  return Array.from({ length: end - start + 1 }, (_, index) => monthFromSerial(start + index));
}

export function buildDiagnosticCalendar(
  startMonth = DEFAULT_DIAGNOSTIC_START_MONTH,
  endMonth = DEFAULT_DIAGNOSTIC_END_MONTH,
  warmupMonths = DEFAULT_WARMUP_MONTHS,
): DiagnosticCalendar {
  const start = monthSerial(startMonth);
  const end = monthSerial(endMonth);
  if (end < start) throw new Error("Diagnostic end month must be on or after the start month.");
  if (!Number.isInteger(warmupMonths) || warmupMonths < 1) throw new Error("Diagnostic warm-up must be a positive whole number of months.");
  return {
    warmupMonths: sequence(start - warmupMonths, start - 1),
    snapshotMonths: sequence(start, end),
  };
}

export function getDiagnosticInspectionWindow(period: string): DiagnosticInspectionWindow | null {
  monthSerial(period);
  return DIAGNOSTIC_INSPECTION_WINDOWS.find((window) =>
    period >= window.startMonth && period <= window.endMonth) ?? null;
}

function isNamed(regime: Regime | null): regime is Exclude<Regime, "MIXED"> {
  return regime !== null && regime !== "MIXED";
}

function consecutive(previous: string, current: string): boolean {
  return monthSerial(current) === monthSerial(previous) + 1;
}

export function summarizeRegimeHistory(
  marks: DiagnosticHistoryMark[],
  options: { minimumNamedMonths?: number; maximumNamedChangesPerYear?: number; prolongedMixedMonths?: number } = {},
): RegimeHistorySummary {
  const minimumNamedMonths = options.minimumNamedMonths ?? 2;
  const maximumNamedChangesPerYear = options.maximumNamedChangesPerYear ?? 4;
  const prolongedMixedMonths = options.prolongedMixedMonths ?? 6;
  const ordered = [...marks].sort((left, right) => monthSerial(left.period) - monthSerial(right.period));
  if (new Set(ordered.map(({ period }) => period)).size !== ordered.length) throw new Error("Diagnostic history contains duplicate months.");

  const eligible = ordered.map((mark) => ({
    ...mark,
    regime: mark.assessmentStatus === "INSUFFICIENT_DATA" ? null : mark.regime,
  }));
  const episodes: RegimeEpisode[] = [];
  let current: RegimeEpisode | null = null;
  for (const mark of eligible) {
    if (mark.regime === null) {
      if (current) episodes.push(current);
      current = null;
      continue;
    }
    if (current && current.regime === mark.regime && consecutive(current.endPeriod, mark.period)) {
      current.endPeriod = mark.period;
      current.durationMonths += 1;
    } else {
      if (current) episodes.push(current);
      current = { regime: mark.regime, startPeriod: mark.period, endPeriod: mark.period, durationMonths: 1 };
    }
  }
  if (current) episodes.push(current);

  const namedChangesByYear: Record<string, number> = {};
  for (let index = 1; index < eligible.length; index += 1) {
    const previous = eligible[index - 1];
    const mark = eligible[index];
    if (!consecutive(previous.period, mark.period) || !isNamed(previous.regime) || !isNamed(mark.regime) || previous.regime === mark.regime) continue;
    const year = mark.period.slice(0, 4);
    namedChangesByYear[year] = (namedChangesByYear[year] ?? 0) + 1;
  }

  const flags: DiagnosticFlag[] = [];
  for (const episode of episodes) {
    if (isNamed(episode.regime) && episode.durationMonths < minimumNamedMonths) {
      flags.push({
        code: "SHORT_NAMED_DURATION",
        periodStart: episode.startPeriod,
        periodEnd: episode.endPeriod,
        durationMonths: episode.durationMonths,
        details: `${episode.regime} lasted ${episode.durationMonths} month(s).`,
      });
    }
    if (episode.regime === "MIXED" && episode.durationMonths >= prolongedMixedMonths) {
      flags.push({
        code: "PROLONGED_MIXED_NO_ENVELOPE",
        periodStart: episode.startPeriod,
        periodEnd: episode.endPeriod,
        durationMonths: episode.durationMonths,
        details: `MIXED/no-envelope persisted for ${episode.durationMonths} consecutive months.`,
      });
    }
  }

  for (const [year, count] of Object.entries(namedChangesByYear)) {
    if (count <= maximumNamedChangesPerYear) continue;
    const yearMarks = eligible.filter(({ period }) => period.startsWith(`${year}-`));
    flags.push({
      code: "HIGH_NAMED_CHANGES",
      periodStart: yearMarks[0].period,
      periodEnd: yearMarks.at(-1)!.period,
      durationMonths: yearMarks.length,
      details: `${count} changes between adjacent resolved named regimes occurred in ${year}.`,
    });
  }

  for (const mark of eligible) {
    const sensitivity = mark.sensitivity;
    if (!sensitivity || sensitivity.classification === "ROBUST") continue;
    flags.push({
      code: "THRESHOLD_SENSITIVE",
      periodStart: mark.period,
      periodEnd: mark.period,
      durationMonths: 1,
      details: `Threshold sensitivity is ${sensitivity.classification}; single-cutoff agreement ${sensitivity.singleAgreement}, coherent-cutoff agreement ${sensitivity.coherentAgreement}.`,
      severity: sensitivity.classification,
    });
  }

  return { episodes, namedChangesByYear, flags };
}

export function createDiagnosticSnapshot(
  period: string,
  core: CoreFactorsResult,
  assessment: RegimeAssessment,
  sourceGaps: string[],
): DiagnosticSnapshot {
  const factors = Object.fromEntries(FACTOR_KEYS.map((key) => {
    const factor = core.factors[key];
    return [key, {
      score: factor.score,
      coverage: factor.coverage,
      bounds: { ...factor.bounds },
      eligibleFamilies: factor.eligibleFamilies,
      configuredFamilies: factor.configuredFamilies,
      historyYears: factor.historyYears,
      releaseQuality: factor.releaseQuality,
      status: factor.status,
    }];
  })) as Record<RegimeFactorKey, DiagnosticFactorSnapshot>;
  return {
    period,
    asOf: monthEnd(period),
    assessmentStatus: assessment.assessmentStatus,
    regime: assessment.regime,
    dataQuality: assessment.dataQuality,
    regimeClarity: assessment.regimeClarity,
    factors,
    ruleDiagnostics: assessment.ruleDiagnostics,
    tensions: assessment.tensions,
    leadingDirection: assessment.leadingDirection,
    inflationDirection: assessment.inflationDirection,
    transitionRisk: assessment.transitionRisk,
    thresholdSensitivity: assessment.sensitivity,
    sourceGaps: Array.from(new Set(sourceGaps)).sort(),
  };
}

function monthEnd(period: string): string {
  const serial = monthSerial(period);
  const year = Math.floor(serial / 12);
  const month = (serial % 12) + 1;
  return new Date(Date.UTC(year, month, 0, 23, 59, 59, 999)).toISOString();
}

function methodBlockers(sourceRegistry: SourceRegistryEntry[]): string[] {
  const treasury = sourceRegistry.find(({ id }) => id === "treasury-real-yield");
  if (!treasury || treasury.reuseStatus !== "CLEARED" || treasury.sourceHealth === "REDISTRIBUTION_BLOCKED") {
    return ["treasury-real-yield (TC_10YEAR): feed-specific reuse/display clearance is unresolved; the Policy/Rates anchor is unclassifiable (POLICY_RATES_WITHHELD — TREASURY_REUSE_UNRESOLVED)."];
  }
  return [];
}

function registeredFamilyGaps(sourceRegistry: SourceRegistryEntry[]): string[] {
  const configured = buildCoreFactors([], "2025-12-31T23:59:59.999Z").factors;
  return FACTOR_KEYS.flatMap((factor) => {
    const registered = new Set(sourceRegistry.flatMap((source) => source.familyAllocations
      .filter((allocation) => allocation.factor === factor)
      .map(({ family }) => family)));
    return configured[factor].families
      .filter(({ key }) => !registered.has(key))
      .map((family) => {
        const detail = family.slots.map(({ reason }) => reason).find((reason) => reason !== null);
        return `${factor}.${family.key}: No admitted source is registered for this configured family${detail ? ` (${detail})` : "."}`;
      });
  });
}

function knownSourceGaps(sourceRegistry: SourceRegistryEntry[]): string[] {
  const h41 = sourceRegistry.find(({ id }) => id === "federal-reserve-h41-liquidity");
  const h41Gap = h41?.expectedReleaseSchedule.includes("does not publish total assets as a weekly average")
    ? [`${h41.id}: H.4.1 Table 5 total assets are Wednesday-only; the approved balance-sheet proxy requires a weekly-average total-assets input.`]
    : [];
  return [...h41Gap, ...registeredFamilyGaps(sourceRegistry)];
}

function snapshotSourceGaps(core: CoreFactorsResult): string[] {
  return FACTOR_KEYS.flatMap((factorKey) => core.factors[factorKey].families
    .filter((family) => !family.eligible)
    .map((family) => {
      const sourceIds = family.sourceIds.length ? ` [${family.sourceIds.join(", ")}]` : "";
      return `${factorKey}.${family.key}${sourceIds}: ${family.reason ?? family.slots.map(({ reason }) => reason).filter(Boolean).join("; ")}`;
    }));
}

function commonFactorMomentum(previous: CoreFactorsResult | null, current: CoreFactorsResult, key: RegimeFactorKey): FactorMomentumInput | null {
  if (!previous) return null;
  const priorFamilies = new Map(previous.factors[key].families.map((family) => [family.key, family]));
  const common = current.factors[key].families.flatMap((family) => {
    const prior = priorFamilies.get(family.key);
    return family.eligible && prior?.eligible && family.score !== null && prior.score !== null
      ? [{ weight: family.weight, current: family.score, prior: prior.score }]
      : [];
  });
  const commonEligibleWeight = common.reduce((sum, item) => sum + item.weight, 0);
  if (!common.length || commonEligibleWeight === 0) {
    return { scoreChange: null, commonEligibleWeight: 0, commonEligibleFamilies: 0 };
  }
  const currentScore = common.reduce((sum, item) => sum + item.weight * item.current, 0) / commonEligibleWeight;
  const previousScore = common.reduce((sum, item) => sum + item.weight * item.prior, 0) / commonEligibleWeight;
  return {
    scoreChange: currentScore - previousScore,
    commonEligibleWeight,
    commonEligibleFamilies: common.length,
  };
}

function difference(current: number | null, previous: number | null): number | null {
  return current !== null && previous !== null && Number.isFinite(current) && Number.isFinite(previous)
    ? current - previous
    : null;
}

function coreYoY(core: CoreFactorsResult): number | null {
  const cpi = core.factors.inflation.families.find(({ key }) => key === "cpi")?.slots.find(({ key }) => key === "coreYoY")?.value ?? null;
  const pce = core.factors.inflation.families.find(({ key }) => key === "pce")?.slots.find(({ key }) => key === "coreYoY")?.value ?? null;
  return cpi !== null && pce !== null ? 0.5 * cpi + 0.5 * pce : null;
}

function inflationPace(core: CoreFactorsResult): number | null {
  const cpi = core.momentum.cpiCoreAnnualized3m.value;
  const pce = core.momentum.pceCoreAnnualized3m.value;
  return cpi !== null && pce !== null ? 0.5 * cpi + 0.5 * pce : null;
}

function policyTarget(core: CoreFactorsResult): number | null {
  return core.native.realPolicyRate !== null && coreYoY(core) !== null
    ? core.native.realPolicyRate + core.factors.inflation.families.find(({ key }) => key === "pce")!.slots.find(({ key }) => key === "coreYoY")!.value!
    : null;
}

function realFinancing(core: CoreFactorsResult): number | null {
  return core.factors.policyRates.families.find(({ key }) => key === "realFinancing")?.slots[0]?.value ?? null;
}

function setHistoricalComparisons(
  inputs: ReturnType<typeof createRegimeInputsFromCoreFactors>,
  current: CoreFactorsResult,
  threeMonthsPrior: CoreFactorsResult | null,
) {
  if (!threeMonthsPrior) return;
  inputs.native.deltaPi = difference(inflationPace(current), inflationPace(threeMonthsPrior));
  inputs.native.coreYoYChange = difference(coreYoY(current), coreYoY(threeMonthsPrior));
  inputs.native.deltaP = difference(current.factors.policyRates.score, threeMonthsPrior.factors.policyRates.score);
  inputs.native.deltaR = difference(realFinancing(current), realFinancing(threeMonthsPrior));
  inputs.native.deltaTarget = difference(policyTarget(current), policyTarget(threeMonthsPrior));
  inputs.native.creditStressChange = difference(current.factors.creditConditions.score, threeMonthsPrior.factors.creditConditions.score);
  inputs.native.liquidityStressChange = difference(current.factors.liquidityProxy.score, threeMonthsPrior.factors.liquidityProxy.score);
  const changes = FACTOR_KEYS.map((key) => difference(current.factors[key].score, threeMonthsPrior.factors[key].score));
  inputs.native.worseningMomenta = changes.every((change) => change !== null)
    ? changes.filter((change) => change! >= 8).length
    : null;
}

function qualityOfPeriod(core: CoreFactorsResult, assessment: RegimeAssessment): string[] {
  const gaps: string[] = [];
  for (const key of ANCHOR_KEYS) {
    if (assessment.factorReadiness[key].classifiable) continue;
    const factor = core.factors[key];
    const unready = factor.families.filter(({ eligible }) => !eligible).map(({ key: family, reason }) => `${family}: ${reason ?? "required family unavailable"}`);
    gaps.push(`${key} anchor has ${Math.round(factor.coverage * 100)}% coverage and ${factor.eligibleFamilies}/${factor.configuredFamilies} eligible families${unready.length ? ` (${unready.join("; ")})` : ""}.`);
  }
  if (!SUPPORT_KEYS.some((key) => assessment.factorReadiness[key].classifiable)) {
    gaps.push("Neither Credit Conditions nor System Liquidity Proxy is classifiable; no required supporting factor is available.");
  }
  if (assessment.assessmentStatus === "INSUFFICIENT_DATA" && gaps.length === 0) {
    gaps.push(`The shared evaluator returned INSUFFICIENT_DATA (${assessment.reasonCodes.join(", ") || "no detailed reason code"}).`);
  }
  return gaps;
}

function emptySummary(): RegimeHistorySummary {
  return { episodes: [], namedChangesByYear: {}, flags: [] };
}

function result(
  status: CurrentRevisedHistoryDiagnostic["status"],
  calendar: DiagnosticCalendar,
  blockers: string[],
  sourceGaps: string[],
  snapshots: DiagnosticSnapshot[],
): CurrentRevisedHistoryDiagnostic {
  const summary = status === "COMPLETE"
    ? summarizeRegimeHistory(snapshots.map(({ period, regime, assessmentStatus, thresholdSensitivity }) => ({
      period,
      regime,
      assessmentStatus,
      sensitivity: thresholdSensitivity,
    })))
    : emptySummary();
  const inspectionWindows = DIAGNOSTIC_INSPECTION_WINDOWS.map((window) => ({
    ...window,
    snapshotCount: status === "COMPLETE"
      ? snapshots.filter(({ period }) => period >= window.startMonth && period <= window.endMonth).length
      : 0,
    evaluated: status === "COMPLETE",
  }));
  return {
    label: CURRENT_REVISED_HISTORY_LABEL,
    methodologyVersion: "US-MACRO-0.3",
    status,
    pointInTimeVintageValidation: false,
    vintageDisclaimer: CURRENT_REVISED_HISTORY_DISCLAIMER,
    calendar,
    blockers: Array.from(new Set(blockers)),
    sourceGaps: Array.from(new Set(sourceGaps)),
    snapshots,
    summary,
    inspectionWindows,
  };
}

export function runCurrentRevisedHistoryDiagnostic(options: DiagnosticOptions): CurrentRevisedHistoryDiagnostic {
  const calendar = buildDiagnosticCalendar(options.startMonth, options.endMonth, options.warmupMonths);
  const admissionBlockers = methodBlockers(options.sourceRegistry);
  const metadataGaps = knownSourceGaps(options.sourceRegistry);
  if (admissionBlockers.length) {
    return result("NOT_RUN", calendar, admissionBlockers, [...metadataGaps, ...admissionBlockers], []);
  }

  const periods = [...calendar.warmupMonths, ...calendar.snapshotMonths];
  const coreHistory: CoreFactorsResult[] = [];
  const assessmentHistory: RegimeAssessment[] = [];
  const snapshots: DiagnosticSnapshot[] = [];
  for (const period of periods) {
    const core = buildCoreFactors(options.series, monthEnd(period), { mode: EVALUATION_MODE });
    const inputs = createRegimeInputsFromCoreFactors(core);
    const previous = coreHistory.at(-1) ?? null;
    const threeMonthsPrior = coreHistory.length >= 3 ? coreHistory.at(-3)! : null;
    inputs.sourceMomentum = {
      growth: commonFactorMomentum(previous, core, "growth"),
      labor: commonFactorMomentum(previous, core, "labor"),
      credit: commonFactorMomentum(previous, core, "creditConditions"),
    };
    setHistoricalComparisons(inputs, core, threeMonthsPrior);
    const previousAssessment = assessmentHistory.at(-1);
    inputs.priorTensionComparison = comparePriorTensions(previous, previousAssessment ?? null, core);
    const assessment = evaluateRegime(inputs);

    if (calendar.snapshotMonths.includes(period)) {
      const missing = qualityOfPeriod(core, assessment);
      if (missing.length) {
        const blockers = missing.map((gap) => `${period}: ${gap}`);
        return result("NOT_RUN", calendar, blockers, [...metadataGaps, ...blockers], []);
      }
      snapshots.push(createDiagnosticSnapshot(period, core, assessment, snapshotSourceGaps(core)));
    }
    coreHistory.push(core);
    assessmentHistory.push(assessment);
  }

  return result("COMPLETE", calendar, [], [...metadataGaps, ...snapshots.flatMap(({ sourceGaps }) => sourceGaps)], snapshots);
}

export async function executeCurrentRevisedHistoryDiagnostic(
  options: DiagnosticExecutionOptions,
): Promise<CurrentRevisedHistoryDiagnostic> {
  const calendar = buildDiagnosticCalendar(options.startMonth, options.endMonth, options.warmupMonths);
  const blockers = methodBlockers(options.sourceRegistry);
  const metadataGaps = knownSourceGaps(options.sourceRegistry);
  if (blockers.length) return result("NOT_RUN", calendar, blockers, [...metadataGaps, ...blockers], []);
  try {
    const series = await options.loadSeries();
    return runCurrentRevisedHistoryDiagnostic({ ...options, series });
  } catch (error) {
    const loadFailure = `Core history sources could not be loaded: ${error instanceof Error ? error.message : "unknown adapter error"}`;
    return result("NOT_RUN", calendar, [loadFailure], [...metadataGaps, loadFailure], []);
  }
}

export function renderDiagnosticMarkdown(diagnostic: CurrentRevisedHistoryDiagnostic): string {
  const generatedAt = new Date().toISOString();
  const lines = [
    `# ${diagnostic.label}`,
    "",
    `Generated: ${generatedAt}`,
    `Status: **${diagnostic.status === "NOT_RUN" ? "NOT RUN" : "COMPLETE"}**`,
    `Methodology: ${diagnostic.methodologyVersion}`,
    `Requested monthly snapshots: ${diagnostic.calendar.snapshotMonths[0]} through ${diagnostic.calendar.snapshotMonths.at(-1)}`,
    `Warm-up period: ${diagnostic.calendar.warmupMonths[0]} through ${diagnostic.calendar.warmupMonths.at(-1)} (${diagnostic.calendar.warmupMonths.length} months)`,
    "",
    `> ${diagnostic.vintageDisclaimer}`,
    "",
    "Revised-history observations retain their actual source release and retrieval timestamps. Historical alignment uses the observation period only; it does not claim that the value or seasonal adjustment was known at that time.",
    "",
    "## Source Gaps",
    "",
    ...(diagnostic.sourceGaps.length ? diagnostic.sourceGaps.map((gap) => `- ${gap}`) : ["- None reported by the diagnostic runner."]),
    "",
  ];

  if (diagnostic.status === "NOT_RUN") {
    lines.push(
      "## Run Gate",
      "",
      ...diagnostic.blockers.map((blocker) => `- ${blocker}`),
      "",
      "No monthly snapshots were generated because the source/method gate did not pass. No regime history, episode flags, or A/B sensitivity results are inferred from missing data.",
      "",
      "## Episode Review",
      "",
      ...diagnostic.inspectionWindows.map((window) => `- ${window.label} (${window.startMonth} to ${window.endMonth}): NOT EVALUATED`),
      "",
    );
    return `${lines.join("\n")}\n`;
  }

  lines.push(
    "## Episode Review",
    "",
    ...diagnostic.inspectionWindows.map((window) => `- ${window.label} (${window.startMonth} to ${window.endMonth}): ${window.snapshotCount} monthly snapshots included; manual review still required.`),
    "",
    "## Regime Episodes",
    "",
    "| Regime | Start | End | Months |",
    "| --- | --- | --- | ---: |",
    ...diagnostic.summary.episodes.map((episode) => `| ${episode.regime} | ${episode.startPeriod} | ${episode.endPeriod} | ${episode.durationMonths} |`),
    "",
    "## Investigation Flags",
    "",
    ...(diagnostic.summary.flags.length
      ? ["| Flag | Start | End | Months | Details |", "| --- | --- | --- | ---: | --- |", ...diagnostic.summary.flags.map((flag) => `| ${flag.code} | ${flag.periodStart} | ${flag.periodEnd} | ${flag.durationMonths} | ${flag.details} |`)]
      : ["No duration, flip-rate, MIXED/no-envelope, or threshold-sensitivity flags were produced."]),
    "",
    "## Monthly Snapshots",
    "",
    "The following JSON retains factor scores/bounds/coverage/readiness, regime status and label, Data Quality, Regime Clarity, rule diagnostics, tensions, directions, Transition Risk, A/B threshold sensitivity, and source gaps.",
    "",
    "```json",
    JSON.stringify(diagnostic.snapshots, null, 2),
    "```",
    "",
  );
  return `${lines.join("\n")}\n`;
}
