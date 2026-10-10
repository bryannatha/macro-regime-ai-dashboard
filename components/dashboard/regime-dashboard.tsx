"use client";

import React, { useCallback, useRef, useState } from "react";
import {
  Activity,
  Banknote,
  Bitcoin,
  BookOpen,
  Database,
  Droplets,
  Gauge,
  LayoutDashboard,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { REGIME_LABELS } from "@/lib/regime";
import { SCORING_MODEL } from "@/lib/scoring";
import { SOURCE_STATES, TREASURY_POLICY_BLOCKER } from "@/lib/types";
import type {
  AIReport,
  CategoryScore,
  CoreReadinessStatus,
  DashboardPayload,
  MetricObservation,
  ObservationKey,
  Regime,
  RegimeFactorKey,
  ScoreKey,
  ScoreOrientation,
  SourceRegistryEntry,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import { createDashboardSnapshot, createSnapshotRefresher } from "@/lib/dashboard-snapshot";
import { withheldRegimeExplanation } from "@/lib/assessment-copy";
import { AssessmentExplanation } from "./assessment-explanation";

interface RegimeDashboardProps {
  payload: DashboardPayload;
}

type DashboardView = "overview" | "sources" | "method";
type Freshness = "current" | "stale" | "unavailable" | "excluded";

const navigation: Array<{ id: DashboardView; label: string; icon: LucideIcon }> = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "sources", label: "Data & sources", icon: Database },
  { id: "method", label: "Methodology", icon: BookOpen },
];

const scoreIcons: Record<ScoreKey, LucideIcon> = {
  inflationPressure: Activity,
  growthStress: Gauge,
  liquidity: Droplets,
  cryptoDemand: Bitcoin,
  indonesiaRisk: Banknote,
};

const scoreThemes: Record<ScoreOrientation, { icon: string; bar: string }> = {
  risk: { icon: "bg-rose-50 text-rose-700", bar: "bg-rose-500" },
  support: { icon: "bg-teal-50 text-teal-700", bar: "bg-teal-500" },
  demand: { icon: "bg-blue-50 text-blue-700", bar: "bg-blue-500" },
};

const observationOrder: ObservationKey[] = [
  "cpi",
  "coreCpi",
  "oil",
  "broadDollarIndex",
  "twoYearYield",
  "tenYearRealYield",
  "joblessClaims",
  "mempoolVsize",
  "mempoolMedianFeeRate",
  "usdidr",
  "btcPrice",
  "hySpread",
  "goldPrice",
  "stablecoinMarketCap",
];

const chartColors: Record<string, string> = {
  cpi: "#0f9b8e",
  coreCpi: "#3b82f6",
  oil: "#f59e0b",
  broadDollarIndex: "#8b5cf6",
  twoYearYield: "#e11d48",
  tenYearRealYield: "#0f9b8e",
  joblessClaims: "#f97316",
  usdidr: "#2563eb",
};

const inputNames: Record<ObservationKey, string> = {
  cpi: "CPI",
  coreCpi: "Core CPI",
  oil: "Brent crude",
  broadDollarIndex: "Broad Dollar Index",
  twoYearYield: "2Y Treasury yield",
  tenYearRealYield: "10Y real Treasury yield",
  joblessClaims: "Initial claims (SA)",
  mempoolVsize: "Mempool virtual size",
  mempoolMedianFeeRate: "Projected block median fee",
  usdidr: "USD/IDR ECB reference cross",
  btcPrice: "BTC spot price (excluded)",
  hySpread: "High-yield spread (excluded)",
  goldPrice: "Gold (excluded)",
  stablecoinMarketCap: "Stablecoin market cap (excluded)",
};

const tooltipStyle: React.CSSProperties = {
  borderRadius: "8px",
  borderColor: "#dbe3e8",
  boxShadow: "0 12px 30px rgba(15, 23, 42, 0.1)",
  fontSize: "12px",
  maxWidth: "260px",
  whiteSpace: "normal",
};

const regimeFactorOrder: RegimeFactorKey[] = [
  "inflation", "growth", "labor", "policyRates", "creditConditions", "liquidityProxy",
];

const regimeFactorLabels: Record<RegimeFactorKey, string> = {
  inflation: "Inflation",
  growth: "Growth",
  labor: "Labor",
  policyRates: "Policy / Rates",
  creditConditions: "Credit Conditions",
  liquidityProxy: "System Liquidity Proxy",
};

const assessmentStatusLabels = {
  NORMAL: "Normal",
  PROVISIONAL: "Provisional",
  INSUFFICIENT_DATA: "Insufficient data",
} as const;

export function observationFreshness(observation: MetricObservation, referenceTime: string): Freshness {
  if (observation.status === "excluded") return "excluded";
  if (observation.status !== "available") return "unavailable";
  if (!observation.observedAt) return "stale";

  const observed = Date.parse(`${observation.observedAt.slice(0, 10)}T00:00:00Z`);
  const reference = Date.parse(`${referenceTime.slice(0, 10)}T00:00:00Z`);
  if (!Number.isFinite(observed) || !Number.isFinite(reference)) return "stale";

  const ageDays = Math.max(0, Math.floor((reference - observed) / 86_400_000));
  const maxAgeDays = observation.key === "broadDollarIndex"
    ? 14
    : observation.cadence === "Current"
      ? 1
      : observation.cadence === "Weekly"
        ? 14
        : observation.cadence === "Monthly"
          ? 50
          : 3;
  return ageDays > maxAgeDays ? "stale" : "current";
}

function formatDate(value: string | null, includeTime = false): string {
  if (!value) return "Not available";
  const hasTime = includeTime && value.length > 10;
  // Reference dates keep their calendar component; only actual instants convert to WIB.
  const date = new Date(hasTime ? value : `${value.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return "Not available";
  const formatted = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(hasTime ? { hour: "2-digit", minute: "2-digit" } : {}),
    timeZone: hasTime ? "Asia/Jakarta" : "UTC",
  }).format(date);
  return hasTime ? `${formatted} WIB` : formatted;
}

function formatValue(observation: MetricObservation): string {
  if (observation.value === null) return observation.status === "excluded" ? "Excluded" : "Unavailable";
  const decimals: Partial<Record<ObservationKey, number>> = {
    cpi: 1,
    coreCpi: 1,
    oil: 2,
    broadDollarIndex: 2,
    twoYearYield: 2,
    tenYearRealYield: 2,
    joblessClaims: 0,
    mempoolVsize: 0,
    mempoolMedianFeeRate: 1,
    usdidr: 0,
  };
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: decimals[observation.key] ?? 2,
    minimumFractionDigits: decimals[observation.key] ?? 2,
  }).format(observation.value);
}

function formatBound(value: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value);
}

export function formatChartDate(value: string, cadence: MetricObservation["cadence"]): string {
  return new Intl.DateTimeFormat("en-GB", {
    ...(cadence !== "Monthly" ? { day: "2-digit" } : {}),
    month: "short",
    year: "2-digit",
    timeZone: "UTC",
  }).format(new Date(`${value.slice(0, 10)}T00:00:00Z`));
}

export function chartDateTicks(history: MetricObservation["history"]): string[] {
  const count = Math.min(4, history.length);
  return Array.from(new Set(Array.from({ length: count }, (_, index) =>
    history[Math.round(index * (history.length - 1) / Math.max(1, count - 1))].date)));
}

function sourceCount(payload: DashboardPayload): { available: number; total: number; excluded: number } {
  const observations = Object.values(payload.observations);
  return {
    available: observations.filter((item) => item.status === "available").length,
    total: observations.filter((item) => item.status !== "excluded").length,
    excluded: observations.filter((item) => item.status === "excluded").length,
  };
}

function coreFactorCount(payload: DashboardPayload): { classifiable: number; total: number } {
  const factors = Object.values(payload.regime.factorReadiness);
  return {
    classifiable: factors.filter((factor) => factor.classifiable).length,
    total: factors.length,
  };
}

function formatCoverage(coverage: number): string {
  const percent = Math.round(coverage * 1000) / 10;
  return `${Number.isInteger(percent) ? percent.toFixed(0) : percent.toFixed(1)}%`;
}

function sourcesForFactor(payload: DashboardPayload, factor: RegimeFactorKey): SourceRegistryEntry[] {
  return payload.sourceRegistry.filter((source) =>
    source.familyAllocations.some((allocation) => allocation.factor === factor));
}

function unregisteredFamilyCount(factor: RegimeFactorKey, configuredFamilies: number, sources: SourceRegistryEntry[]): number {
  const registeredFamilies = new Set(sources.flatMap((source) => source.familyAllocations
    .filter((allocation) => allocation.factor === factor)
    .map(({ family }) => family)));
  return Math.max(0, configuredFamilies - registeredFamilies.size);
}

function sourceHealthSummary(sources: SourceRegistryEntry[]): string {
  if (!sources.length) return "No core source metadata available";
  const counts = SOURCE_STATES.map((state) => ({
    state,
    count: sources.filter((source) => source.sourceHealth === state).length,
  })).filter(({ count }) => count > 0);
  return counts.map(({ state, count }) => `${count} ${state.toLowerCase()}`).join(" · ");
}

function sourceReasons(source: SourceRegistryEntry): string[] {
  const reasons = source.healthReason ? [source.healthReason] : [];
  if (source.sourceHealth === "REDISTRIBUTION_BLOCKED") {
    reasons.push(source.id === "treasury-real-yield" ? TREASURY_POLICY_BLOCKER : "Source reuse/display is blocked.");
  } else if (source.sourceHealth === "FAILED") {
    reasons.push("The latest source fetch or parser validation failed; no value is eligible.");
  } else if (source.sourceHealth === "STALE") {
    reasons.push("The latest source observation is outside its approved freshness window.");
  } else if (source.sourceHealth === "MISSING") {
    reasons.push("No current core observation is attached to the dashboard payload.");
  }
  if (source.reuseStatus === "UNRESOLVED" && source.sourceHealth !== "REDISTRIBUTION_BLOCKED") {
    reasons.push("Source-specific reuse/display clearance is unresolved.");
  }
  if (source.parserStatus === "FAILED") reasons.push("Parser validation failed.");
  else if (source.parserStatus !== "VERIFIED") reasons.push(`Parser state is ${source.parserStatus.toLowerCase()}.`);
  if (source.historyStatus === "FAILED") reasons.push("Historical-series validation failed.");
  else if (source.historyStatus !== "VERIFIED") reasons.push(`History state is ${source.historyStatus.toLowerCase()}.`);
  return Array.from(new Set(reasons));
}

function readinessVariant(status: CoreReadinessStatus): "positive" | "caution" | "outline" {
  return status === "READY" || status === "ADEQUATE" ? "positive"
    : status === "LIMITED" ? "caution" : "outline";
}

function sourceStateVariant(state: SourceRegistryEntry["sourceHealth"]): "positive" | "caution" | "outline" {
  return state === "AVAILABLE" ? "positive"
    : state === "MISSING" ? "outline" : "caution";
}

export function RegimeDashboard({ payload: initialPayload }: RegimeDashboardProps) {
  const [view, setView] = useState<DashboardView>("overview");
  const [snapshot, setSnapshot] = useState(() => createDashboardSnapshot(initialPayload));
  const { payload, report } = snapshot;
  const [reportError, setReportError] = useState<string | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const refresh = useRef<ReturnType<typeof createSnapshotRefresher> | null>(null);
  if (!refresh.current) {
    refresh.current = createSnapshotRefresher(snapshot, async () => {
      const response = await fetch("/api/market-data", { cache: "no-store" });
      if (!response.ok) throw new Error("Snapshot request failed");
      return await response.json() as DashboardPayload;
    }, setSnapshot);
  }
  const counts = sourceCount(payload);
  const coreFactors = coreFactorCount(payload);

  const requestReport = useCallback(async () => {
    setLoadingReport(true);
    setReportError(null);
    try {
      await refresh.current!();
    } catch {
      setReportError("Refresh failed. The overview and brief still show the previous assessment snapshot; current source health has not been rechecked.");
    } finally {
      setLoadingReport(false);
    }
  }, []);

  const title = view === "overview"
    ? "Macro regime overview"
    : view === "sources"
      ? "Data & sources"
      : "Methodology";
  const subtitle = view === "overview"
    ? "A concise, public-data read across inflation, growth, liquidity, Bitcoin blockspace activity, and Indonesia FX."
    : view === "sources"
      ? "Monitoring timestamps and core-source admission, health, and release state are shown separately."
      : "Transparent, provisional rules; missing inputs are never scored as zero.";

  return (
    <div className="macro-dashboard min-h-screen bg-[#f4f7f8] text-slate-900" data-snapshot-id={snapshot.id}>
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto grid max-w-[1440px] grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 px-4 py-3 sm:px-6 lg:grid-cols-[minmax(0,1fr)_auto_auto] xl:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-xs font-bold text-white">MR</div>
            <div className="min-w-0">
              <h1 className="text-sm font-semibold leading-5 tracking-tight">Macro Regime AI Dashboard</h1>
              <p className="mt-0.5 hidden text-[11px] text-slate-500 sm:block">Daily macro monitor · public sources · read only</p>
            </div>
          </div>
          <div className="col-span-2 row-start-2 flex flex-wrap items-center gap-2 sm:gap-4 lg:col-span-1 lg:col-start-2 lg:row-start-1">
            <div className="text-left lg:text-right">
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Assessment as of</div>
              <div className="tabular mt-0.5 text-xs font-medium text-slate-700">{formatDate(payload.generatedAt, true)}</div>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge aria-label={`${counts.available} of ${counts.total} monitoring indicators available`} variant={counts.available > 0 ? "positive" : "caution"} className="whitespace-nowrap">
                Monitoring indicators {counts.available}/{counts.total} available
              </Badge>
              <Badge aria-label={`${coreFactors.classifiable} of ${coreFactors.total} core factors classifiable`} variant={coreFactors.classifiable > 0 ? "positive" : "caution"} className="whitespace-nowrap">
                Core factors {coreFactors.classifiable}/{coreFactors.total} classifiable
              </Badge>
            </div>
          </div>
          <Button aria-label="Refresh dashboard data" title="Refresh the shared overview and brief snapshot" disabled={loadingReport} className="col-start-2 row-start-1 lg:col-start-3" onClick={() => void requestReport()} size="sm" variant="outline">
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
        <nav aria-label="Dashboard sections" className="mx-auto flex max-w-[1440px] gap-1 overflow-x-auto px-3 sm:px-6 xl:px-8">
          {navigation.map(({ id, label, icon: Icon }) => (
            <button
              aria-current={view === id ? "page" : undefined}
              className={cn(
                "flex shrink-0 items-center gap-2 border-b-2 px-2 py-2.5 text-xs font-medium transition sm:px-3",
                view === id ? "border-teal-600 text-slate-950" : "border-transparent text-slate-500 hover:text-slate-900",
              )}
              key={id}
              onClick={() => setView(id)}
              type="button"
            >
              <Icon className="h-3.5 w-3.5" />{label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto flex max-w-[1440px] flex-col gap-5 px-4 py-6 sm:px-6 xl:px-8">
        {loadingReport && <p role="status" className="text-xs text-slate-600">Refreshing the overview and brief together. Showing the previous assessment as of {formatDate(payload.generatedAt, true)}.</p>}
        {reportError && <p role="alert" className="text-xs text-rose-700">{reportError} As of {formatDate(payload.generatedAt, true)}.</p>}
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-700">Daily context · rules-based · {assessmentStatusLabels[payload.regime.assessmentStatus].toLowerCase()}</div>
            <h2 className="mt-1 text-[26px] font-semibold tracking-tight text-slate-950">{title}</h2>
            <p className="mt-1 max-w-3xl text-sm leading-5 text-slate-500">{subtitle}</p>
          </div>
          <div className="text-[11px] text-slate-500 sm:text-right">
            <div>Latest source observation: <span className="font-medium text-slate-700">{formatDate(payload.dataAsOf)}</span></div>
            <div className="mt-0.5">{counts.excluded} series excluded pending redistribution clearance</div>
          </div>
        </div>

        {view === "overview" ? (
          <OverviewView
            payload={payload}
            report={report}
            reportError={reportError}
            loadingReport={loadingReport}
            onRefreshReport={() => void requestReport()}
          />
        ) : view === "sources" ? (
          <SourcesView payload={payload} />
        ) : (
          <MethodView payload={payload} />
        )}

        <footer className="flex flex-col justify-between gap-2 border-t border-slate-200 py-4 text-[11px] text-slate-500 sm:flex-row sm:items-center">
          <span>Educational research tool, not financial advice.</span>
          <span>Public data can be delayed, revised, or unavailable. No trade execution.</span>
        </footer>
      </main>
    </div>
  );
}

function OverviewView({
  payload,
  report,
  reportError,
  loadingReport,
  onRefreshReport,
}: {
  payload: DashboardPayload;
  report: AIReport | null;
  reportError: string | null;
  loadingReport: boolean;
  onRefreshReport: () => void;
}) {
  return (
    <>
      <RegimeSummary payload={payload} />
      <section aria-labelledby="supplementary-monitoring-title" className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-800" id="supplementary-monitoring-title">Supplementary Monitoring — Not classifier inputs</h3>
          <p className="mt-1 text-[11px] text-slate-500">These indicators provide adjacent market context; they do not determine the U.S. macro regime.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {payload.scores.map((score) => <ScoreCard key={score.key} score={score} />)}
        </div>
      </section>
      <section aria-label="Research implications">
        <ResearchImplicationsCard payload={payload} />
      </section>
      <ReportCard
        error={reportError}
        loading={loadingReport}
        onRefresh={onRefreshReport}
        report={report}
      />
      <ObservationCharts observations={payload.observations} />
    </>
  );
}

function RegimeSummary({ payload }: { payload: DashboardPayload }) {
  const assessment = payload.regime;
  const selectedRegime = assessment.regime;
  const resolved = selectedRegime !== null;
  return (
    <>
    <section aria-label="U.S. macro regime">
      <Card className={cn(
        "overflow-hidden border-slate-800 bg-slate-950 text-white shadow-none",
        !resolved && "border-amber-300 bg-amber-50 text-slate-900",
      )}>
        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center lg:gap-10 lg:p-7">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className={cn("text-[10px] font-semibold uppercase tracking-[0.18em]", resolved ? "text-teal-300" : "text-amber-800")}>U.S. macro regime</span>
              <Badge variant={resolved ? "outline" : "caution"} className={resolved ? "border-white/20 bg-white/5 text-slate-300" : ""}>
                {assessmentStatusLabels[assessment.assessmentStatus]}
              </Badge>
            </div>
            <h3 className="text-3xl font-semibold tracking-tight sm:text-[40px] sm:leading-tight">
              {selectedRegime ? REGIME_LABELS[selectedRegime] : "Regime withheld"}
            </h3>
            <p className={cn("mt-3 max-w-2xl text-sm leading-6", resolved ? "text-slate-300" : "text-slate-700")}>
              {resolved
                ? "A deterministic classification from the approved six-factor U.S. macro framework. It is descriptive research context, not a forecast."
                : `${withheldRegimeExplanation(assessment)} Monitoring indicators are not substitutes for core evidence.`}
            </p>
          </div>
          <div className={cn("grid min-w-0 grid-cols-2 gap-4 rounded-lg border p-4", resolved ? "border-white/10 bg-white/[0.04]" : "border-amber-200 bg-white/70")}>
            <div>
              <div className={cn("text-[10px] font-medium uppercase tracking-[0.1em]", resolved ? "text-slate-400" : "text-amber-800")}>Core Model Data Quality</div>
              <div className="tabular mt-2 font-mono text-3xl font-semibold">{assessment.dataQuality ?? "N/A"}<span className="text-xs text-slate-400"> / 100</span></div>
            </div>
            <div>
              <div className={cn("text-[10px] font-medium uppercase tracking-[0.1em]", resolved ? "text-slate-400" : "text-amber-800")}>Regime Clarity</div>
              <div className="tabular mt-2 font-mono text-3xl font-semibold">{assessment.regimeClarity ?? "N/A"}<span className="text-xs text-slate-400"> / 100</span></div>
            </div>
            <div className={cn("col-span-2 border-t pt-2 text-[10px] leading-4", resolved ? "border-white/10 text-slate-400" : "border-amber-200 text-slate-500")}>
              Separate measures; clarity is not probability or confidence.
            </div>
          </div>
        </div>
        <div className={cn("flex flex-col gap-2 border-t px-5 py-3 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6", resolved ? "border-white/10 text-slate-300" : "border-amber-200 text-slate-700")}>
          <span>{resolved ? `Sensitivity: ${assessment.sensitivity?.classification ?? "not available"}. Thresholds are provisional and not backtested.` : "Monitoring scores remain useful independently; no economic regime is inferred from missing inputs."}</span>
          <span className="font-mono text-[10px] uppercase tracking-wide opacity-70">As of {formatDate(payload.generatedAt, true)}</span>
        </div>
      </Card>

    </section>
      <AssessmentExplanation payload={payload} factorLabels={regimeFactorLabels} />
      <section aria-labelledby="core-data-coverage-title" className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="max-w-4xl">
            <h3 className="text-sm font-semibold text-slate-800" id="core-data-coverage-title">Core data coverage</h3>
            <p className="mt-1 text-xs leading-5 text-slate-500">U.S. data do not represent the world. Only the six U.S. core factors classify the regime; Indonesia FX, Energy, and Crypto remain separate overlays.</p>
            <p className="mt-1 text-[11px] text-slate-500">Classifiability is separate from NORMAL assessment quality. Source and eligibility details are in Data &amp; sources.</p>
          </div>
          <Badge variant="outline" className="text-[10px]">60% + 2 families</Badge>
        </div>
        <div className="grid items-start gap-3 md:grid-cols-2 lg:grid-cols-3">
          {regimeFactorOrder.map((key) => {
            const factor = assessment.factorReadiness[key];
            const sources = sourcesForFactor(payload, key);
            return (
              <article aria-label={regimeFactorLabels[key]} className="min-w-0 rounded-lg border border-slate-200 bg-white p-4" key={key}>
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-sm font-semibold leading-5 text-slate-800">{regimeFactorLabels[key]}</h4>
                  <Badge variant={readinessVariant(factor.status)} className="shrink-0 text-[10px]">{factor.status}</Badge>
                </div>
                <div className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="tabular font-mono text-2xl font-semibold tracking-tight text-slate-950">{formatCoverage(factor.coverage)}</span>
                  <span className="text-xs text-slate-500">coverage</span>
                </div>
                <div className="mt-2 text-xs text-slate-600">{factor.eligibleFamilies}/{factor.configuredFamilies} families eligible</div>
                <div className="mt-3 border-t border-slate-100 pt-2 text-[11px] leading-4 text-slate-500">Registry health: {sourceHealthSummary(sources)}</div>
              </article>
            );
          })}
        </div>
    </section>
    </>
  );
}

function ScoreCard({ score }: { score: CategoryScore }) {
  const Icon = scoreIcons[score.key];
  const theme = scoreThemes[score.orientation];
  return (
    <Card className="border-slate-200 shadow-none">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className={cn("rounded-md p-2", theme.icon)}><Icon className="h-3.5 w-3.5" /></div>
          <Badge variant={score.score === null ? "caution" : "outline"} className="text-[10px]">{score.reading}</Badge>
        </div>
        <div className="mt-3 text-xs font-medium leading-5 text-slate-600">{score.label}</div>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="tabular font-mono text-[27px] font-semibold tracking-tight text-slate-950">{score.score ?? "N/A"}</span>
          {score.score !== null && <span className="text-[10px] text-slate-400">/ 100</span>}
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-100">
          {score.score !== null && <div className={cn("h-full rounded-full", theme.bar)} style={{ width: `${score.score}%` }} />}
        </div>
        <p className="mt-2 text-[10px] leading-[15px] text-slate-500" title={score.explanation}>
          {score.coveragePercent}% indicator coverage · monitoring only
        </p>
      </CardContent>
    </Card>
  );
}

function ResearchImplicationsCard({ payload }: { payload: DashboardPayload }) {
  const implications = payload.researchImplications;
  const { assessmentStatus, regime } = payload.regime;
  const withheldDescription = assessmentStatus === "INSUFFICIENT_DATA"
    ? "Mandatory evidence requirements are not met and no regime is assigned."
    : regime
      ? `${REGIME_LABELS[regime]} is the current ${assessmentStatus === "PROVISIONAL" ? "provisional " : ""}macro regime.`
      : "No regime could be established from the admissible evidence.";
  const withheldReason = assessmentStatus === "INSUFFICIENT_DATA"
    ? "Research implications are withheld until the required evidence is available."
    : assessmentStatus === "PROVISIONAL"
      ? regime
        ? "Research implications are withheld because the assessment does not meet NORMAL-quality requirements."
        : "Research implications remain withheld while the assessment is provisional."
      : "Research implications are not available for this assessment.";
  return (
    <Card className="border-slate-200 shadow-none">
      <CardHeader className="p-5 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-teal-700" />
          <CardTitle className="text-sm">Research Implications</CardTitle>
          {implications && <Badge variant="outline" className="ml-auto text-[10px]">{REGIME_LABELS[implications.regime]}</Badge>}
        </div>
        <CardDescription className="text-xs leading-5">{implications?.thesis ?? withheldDescription}</CardDescription>
      </CardHeader>
      <CardContent className="px-5 pb-4">
        {implications ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <ResearchGroup label="Research themes" items={implications.researchThemes} />
            <ResearchGroup label="Counter-signals" items={implications.counterSignals} />
            <ResearchGroup label="Overlay context" items={implications.overlayContext} />
            <ResearchGroup label="Uncertainties" items={implications.uncertainties} />
            <ResearchGroup label="Guardrails" items={implications.guardrails} />
          </div>
        ) : (
          <div className="border-l-2 border-amber-300 pl-3 text-xs leading-5 text-slate-600">
            {withheldReason}
          </div>
        )}
        <p className="mt-3 text-[11px] leading-4 text-slate-500">Descriptive research questions and limitations only; no asset allocation or trading instructions.</p>
      </CardContent>
    </Card>
  );
}

function ResearchGroup({
  items,
  label,
}: {
  items: string[];
  label: string;
}) {
  return (
    <div className="rounded-md border border-slate-100 bg-slate-50/70 p-3">
      <div className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-400">{label}</div>
      <ul className="space-y-1.5">
        {items.map((item) => <li className="flex gap-2 text-[10px] leading-4 text-slate-600" key={item}><span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-teal-600" />{item}</li>)}
        {!items.length && <li className="text-[10px] text-slate-400">None registered.</li>}
      </ul>
    </div>
  );
}

export function ReportCard({
  error,
  loading,
  onRefresh,
  report,
}: {
  error: string | null;
  loading: boolean;
  onRefresh: () => void;
  report: AIReport | null;
}) {
  return (
    <Card className="border-slate-200 shadow-none">
      <CardHeader className="flex-row flex-wrap items-start justify-between gap-3 space-y-0 p-5 pb-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-teal-700" /><CardTitle className="text-sm">Daily rules brief</CardTitle></div>
          <CardDescription className="mt-1 text-xs">Deterministic rules output; not AI-generated.</CardDescription>
        </div>
        <Button disabled={loading} title="Refresh the shared overview and brief snapshot" onClick={onRefresh} size="sm" variant="outline">
          <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} /> Refresh brief
        </Button>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        {loading && !report ? (
          <p className="rounded-md bg-slate-50 p-4 text-xs text-slate-500">Loading the current coverage-aware brief…</p>
        ) : null}
        {error && (
          <p className="rounded-md border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">{error}</p>
        )}
        {report ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={report.regime ? "positive" : "caution"}>{report.regime ? REGIME_LABELS[report.regime] : "Regime withheld"}</Badge>
                <Badge variant="outline">{assessmentStatusLabels[report.assessmentStatus]}</Badge>
                <span className="text-[11px] text-slate-500 sm:ml-auto">Generated {formatDate(report.generatedAt, true)}</span>
              </div>
              <h3 className="mt-2 text-sm font-semibold text-slate-800">{report.title}</h3>
              <p className="mt-2 text-[11px] leading-5 text-slate-500">
                Latest input date: {formatDate(report.dataAsOf)} · Core Model Data Quality {report.dataQuality ?? "N/A"}/100 · Regime Clarity {report.regimeClarity ?? "N/A"}/100
              </p>
            </div>
            <div className="grid items-start gap-5 md:grid-cols-2">
              <ReportList items={report.signals} label="Key readings" />
              <ReportList items={report.watchlist} label="Watchlist" />
            </div>
            <details className="rounded-lg border border-slate-200">
              <summary className="cursor-pointer px-4 py-3 text-xs font-semibold text-slate-700">Full rules narrative</summary>
              <p className="border-t border-slate-100 px-4 py-3 text-xs leading-6 text-slate-600">{report.executiveSummary}</p>
            </details>
          </div>
        ) : null}
        <div className="mt-4 border-t border-slate-100 pt-4">
          <h4 className="text-xs font-semibold text-slate-700">Data limitations</h4>
          <p className="mt-1.5 text-xs leading-5 text-slate-500">
            {report?.riskNote ?? "Rules-generated research context, not a forecast. Educational research tool, not financial advice."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function ReportList({ items, label }: { items: string[]; label: string }) {
  return (
    <div className="min-w-0">
      <h4 className="mb-3 text-xs font-semibold text-slate-800">{label}</h4>
      <ul className="space-y-2">
        {items.length ? items.map((item) => <li className="flex gap-2 text-xs leading-5 text-slate-600" key={item}><span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-teal-600" /><span>{item}</span></li>) : <li className="text-xs text-slate-500">No items available.</li>}
      </ul>
    </div>
  );
}

function SourcesView({ payload }: { payload: DashboardPayload }) {
  return (
    <>
      <CoreFactorReadiness payload={payload} />
      <CoreSourceRegistry sources={payload.sourceRegistry} />
      <ObservationTable payload={payload} />
      <ObservationCharts observations={payload.observations} />
    </>
  );
}

export function CoreFactorReadiness({ payload }: { payload: DashboardPayload }) {
  return (
    <Card className="border-slate-200 shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">U.S. core factor readiness</CardTitle>
        <CardDescription>Coverage and eligible families are independent of supplementary monitoring-feed availability.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {regimeFactorOrder.map((key) => {
          const factor = payload.regime.factorReadiness[key];
          const sources = sourcesForFactor(payload, key);
          const reasons = sources.flatMap((source) => sourceReasons(source).map((reason) => `${source.id}: ${reason}`));
          const unregisteredFamilies = unregisteredFamilyCount(key, factor.configuredFamilies, sources);
          if (unregisteredFamilies > 0) {
            reasons.push(`${unregisteredFamilies} configured ${unregisteredFamilies === 1 ? "family has" : "families have"} no admitted source.`);
          }
          return (
            <div className="rounded-md border border-slate-200 bg-white p-3" key={key}>
              <div className="flex items-start justify-between gap-2">
                <div className="text-xs font-semibold text-slate-800">{regimeFactorLabels[key]}</div>
                <Badge variant={readinessVariant(factor.status)} className="text-[9px]">{factor.status}</Badge>
              </div>
              <div className="mt-2 tabular text-[11px] font-medium text-slate-700">
                {formatCoverage(factor.coverage)} coverage · {factor.eligibleFamilies}/{factor.configuredFamilies} families eligible
              </div>
              <div className="mt-1 text-[10px] text-slate-500">Registry health: {sourceHealthSummary(sources)}</div>
              {reasons.length ? (
                <details className="mt-2 border-t border-slate-100 pt-2">
                  <summary className="cursor-pointer text-[10px] font-medium text-amber-800">Unavailable / blocked reasons ({reasons.length})</summary>
                  <ul className="mt-2 space-y-1.5">
                    {reasons.map((reason) => <li className="break-words text-[9px] leading-4 text-slate-500" key={reason}>{reason}</li>)}
                  </ul>
                </details>
              ) : <p className="mt-2 text-[9px] text-teal-700">No registry blockers reported.</p>}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export function CoreSourceRegistry({ sources }: { sources: SourceRegistryEntry[] }) {
  return (
    <section aria-labelledby="core-source-registry-title" className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-slate-800" id="core-source-registry-title">Core source registry</h3>
        <p className="mt-1 text-[11px] text-slate-500">Registry health is admission metadata, not proof of a current observation. Observation, release, and retrieval dates remain separate from supplementary monitoring feeds.</p>
      </div>
      {sources.length ? (
        <div className="grid gap-3 xl:grid-cols-2">
          {sources.map((source) => {
            const reasons = sourceReasons(source);
            return (
              <Card className="border-slate-200 shadow-none" key={source.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <CardTitle className="text-xs leading-5">{source.name}</CardTitle>
                      <div className="mt-1 flex flex-wrap items-baseline gap-x-1.5 text-[9px] text-slate-400">
                        <span className="font-medium">Source ID</span>
                        <span className="break-all font-mono">{source.id}</span>
                      </div>
                    </div>
                    <Badge aria-label={`Registry source health: ${source.sourceHealth}`} variant={sourceStateVariant(source.sourceHealth)} className="shrink-0 text-[9px]">{source.sourceHealth}</Badge>
                  </div>
                  <CardDescription>{source.owner} · {source.accessMethod}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-[10px]">
                  <div>
                    <div className="font-semibold text-slate-500">Endpoint</div>
                    <a className="mt-0.5 block break-all text-teal-800 underline decoration-teal-200 underline-offset-2" href={source.endpoint} rel="noreferrer" target="_blank">{source.endpoint}</a>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-500">Reuse evidence</div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-slate-600">
                      <span>{source.reuseStatus}</span>
                      <a className="text-teal-800 underline decoration-teal-200 underline-offset-2" href={source.reuseEvidenceUrl ?? source.reuseReviewUrl} rel="noreferrer" target="_blank">Terms / review</a>
                    </div>
                  </div>
                  <div className="grid gap-x-4 gap-y-2 sm:grid-cols-2">
                    <RegistryField label="Cadence" value={source.cadence} />
                    <RegistryField label="Seasonal basis" value={source.seasonalBases.join(", ")} />
                    <RegistryField label="Units" value={source.units.join(", ")} />
                    <RegistryField label="Identifiers" value={source.identifiers.join(", ")} />
                    <RegistryField label="Parser" value={source.parserStatus} />
                    <RegistryField label="History" value={source.historyStatus} />
                    <RegistryField label="Release date quality" value={source.releaseDateQuality === null ? "Not available" : formatCoverage(source.releaseDateQuality)} />
                    <RegistryField label="First usable period" value={source.firstUsablePeriod ?? "Not available"} />
                    <RegistryField label="Verified" value={formatDate(source.verifiedAt)} />
                  </div>
                  <div className="grid gap-2 border-y border-slate-100 py-2 sm:grid-cols-3">
                    <RegistryField label="Observation date" value={formatDate(source.observedAt ?? null)} />
                    <RegistryField label="Release date" value={formatDate(source.releasedAt ?? null, true)} />
                    <RegistryField label="Retrieval date" value={formatDate(source.retrievedAt ?? null, true)} />
                  </div>
                  <RegistryField label="Attribution" value={source.attribution} />
                  <RegistryField label="Expected release schedule" value={source.expectedReleaseSchedule} />
                  {source.familyAllocations.length > 0 && (
                    <RegistryField
                      label="Configured family allocations"
                      value={source.familyAllocations.map(({ factor, family, weight }) => `${regimeFactorLabels[factor]} / ${family} (${formatCoverage(weight)})`).join("; ")}
                    />
                  )}
                  {reasons.length > 0 && (
                    <div className="rounded border border-amber-100 bg-amber-50/70 p-2">
                      <div className="font-semibold text-amber-900">Unavailable / blocked reason</div>
                      <ul className="mt-1 space-y-1 text-slate-600">
                        {reasons.map((reason) => <li className="break-words" key={reason}>{reason}</li>)}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-dashed border-slate-300 bg-white/70 shadow-none">
          <CardContent className="p-5 text-center text-xs text-slate-500">No core source registry entries are available.</CardContent>
        </Card>
      )}
    </section>
  );
}

function RegistryField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <div className="font-semibold text-slate-500">{label}</div>
      <div className="mt-0.5 break-words leading-4 text-slate-700">{value || "Not available"}</div>
    </div>
  );
}

export function ObservationTable({ payload }: { payload: DashboardPayload }) {
  return (
    <Card className="border-slate-200 shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Market observations</CardTitle>
        <CardDescription>Observation time is separate from retrieval time. Stale values remain visible but are labelled.</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pb-2 sm:px-4">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-100 hover:bg-transparent">
              <TableHead className="min-w-[125px] px-2 sm:px-3">Series</TableHead>
              <TableHead className="hidden md:table-cell">Source / note</TableHead>
              <TableHead className="hidden lg:table-cell">Cadence</TableHead>
              <TableHead className="whitespace-nowrap px-2 text-right sm:px-3">Latest</TableHead>
              <TableHead className="hidden whitespace-nowrap text-right sm:table-cell">As of</TableHead>
              <TableHead className="whitespace-nowrap px-2 text-right sm:px-3">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {observationOrder.map((key) => {
              const observation = payload.observations[key];
              const freshness = observationFreshness(observation, payload.generatedAt);
              return (
                <TableRow className="border-slate-100 align-top" key={key}>
                  <TableCell className="min-w-[125px] px-2 py-3 sm:min-w-[175px] sm:px-3">
                    <div className="text-xs font-medium text-slate-800">{observation.label}</div>
                    <div className="mt-0.5 text-[10px] text-slate-400">{observation.unit}</div>
                    <div className="mt-1 text-[9px] leading-4 text-slate-500 md:hidden">{observation.source}. {observation.detail}</div>
                    <div className="mt-1 text-[9px] leading-4 text-slate-400 sm:hidden">As of {formatDate(observation.observedAt, observation.cadence === "Current")} · {observation.cadence}</div>
                  </TableCell>
                  <TableCell className="hidden max-w-[380px] py-3 md:table-cell">
                    <div className="text-[10px] font-medium text-slate-600">
                      {observation.sourceUrl ? (
                        <a className="underline decoration-slate-300 underline-offset-2 hover:text-teal-700" href={observation.sourceUrl} rel="noreferrer" target="_blank">{observation.source}</a>
                      ) : observation.source}
                    </div>
                    <div className="mt-1 text-[10px] leading-4 text-slate-400">{observation.detail}</div>
                    <div className="mt-1 text-[9px] text-slate-400">Retrieved {formatDate(observation.fetchedAt, true)}</div>
                  </TableCell>
                  <TableCell className="hidden py-3 text-[10px] text-slate-500 lg:table-cell">{observation.cadence}</TableCell>
                  <TableCell className="tabular whitespace-nowrap px-2 py-3 text-right font-mono text-xs font-medium text-slate-800 sm:px-3">{formatValue(observation)}</TableCell>
                  <TableCell className="hidden py-3 text-right text-[10px] text-slate-500 sm:table-cell">{formatDate(observation.observedAt, observation.cadence === "Current")}</TableCell>
                  <TableCell className="whitespace-nowrap px-2 py-3 text-right sm:px-3"><FreshnessBadge freshness={freshness} /></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function FreshnessBadge({ freshness }: { freshness: Freshness }) {
  const options: Record<Freshness, { label: string; variant: "positive" | "caution" | "outline" }> = {
    current: { label: "Available", variant: "positive" },
    stale: { label: "Stale", variant: "caution" },
    unavailable: { label: "Unavailable", variant: "caution" },
    excluded: { label: "Excluded", variant: "outline" },
  };
  const option = options[freshness];
  return <Badge variant={option.variant} className="whitespace-nowrap text-[9px]">{option.label}</Badge>;
}

function ObservationCharts({ observations }: { observations: DashboardPayload["observations"] }) {
  const chartable = observationOrder
    .map((key) => observations[key])
    .filter((observation) => observation.status === "available" && observation.history.length >= 2);
  return (
    <section aria-labelledby="provider-history-title" className="min-w-0">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-800" id="provider-history-title">Provider history</h3>
          <p className="mt-1 text-[11px] text-slate-500">Only dated observations returned by the source are charted. No synthetic score history.</p>
        </div>
        <Badge variant="outline" className="text-[10px]">{chartable.length} series with history</Badge>
      </div>
      {chartable.length ? (
        <div className="grid items-start gap-3 md:grid-cols-2 lg:grid-cols-3">
          {chartable.map((observation) => <ObservationChart key={observation.key} observation={observation} />)}
        </div>
      ) : (
        <Card className="border-dashed border-slate-300 bg-white/70 shadow-none">
          <CardContent className="p-5 text-center text-xs text-slate-500">No source has returned enough dated history for a chart yet.</CardContent>
        </Card>
      )}
    </section>
  );
}

function ObservationChart({ observation }: { observation: MetricObservation }) {
  const history = observation.history.slice(-60);
  const color = chartColors[observation.key] ?? "#0f9b8e";
  return (
    <Card className="min-w-0 border-slate-200 shadow-none">
      <CardHeader className="p-4 pb-1">
        <CardTitle className="text-sm leading-5">{observation.label}</CardTitle>
        <CardDescription className="text-[11px] leading-4">{observation.unit} · {observation.cadence} · {history.length} dated points</CardDescription>
        <p className="text-[10px] leading-4 text-slate-500">{formatDate(history[0].date)} – {formatDate(history[history.length - 1].date)}</p>
      </CardHeader>
      <CardContent className="px-3 pb-3 pt-3">
        <ResponsiveContainer height={190} width="100%">
          <LineChart data={history} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
            <CartesianGrid stroke="#e8edf0" strokeDasharray="3 4" vertical={false} />
            <XAxis axisLine={false} dataKey="date" fontSize={10} height={32} minTickGap={16} tickMargin={10} tickLine={false} tick={{ fill: "#64748b" }} ticks={chartDateTicks(history)} tickFormatter={(date) => formatChartDate(String(date), observation.cadence)} />
            <YAxis axisLine={false} fontSize={10} tickLine={false} tick={{ fill: "#64748b" }} width={44} tickFormatter={(value) => new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(Number(value))} />
            <Tooltip contentStyle={tooltipStyle} itemStyle={{ whiteSpace: "normal" }} labelFormatter={(date) => formatDate(String(date))} formatter={(value) => [`${value} ${observation.unit}`, observation.label]} />
            <Line dataKey="value" dot={false} name={observation.label} stroke={color} strokeWidth={2} type="monotone" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function MethodView({ payload }: { payload: DashboardPayload }) {
  const rules: Array<[Regime, string]> = [
    ["GOLDILOCKS", "I≤45, G≤45, L≤50, P≤55; real policy rate≤1.50pp; rate, target and policy changes pass guardrails; C≤50 or Q≤55; C<65 and Q<70; all factors<80; Δπ<0.30pp; fewer than3 worsening momenta; no divergence."],
    ["INFLATIONARY_EXPANSION", "HOT: I≥60 or (I≥50 and Δπ≥0.30pp); RESILIENT: (G≤45 and L≤50) or (L≤45 and G≤50); no activity/labor divergence."],
    ["STAGFLATIONARY", "HOT and ((G≥55 and L≥55) or G≥65 or L≥65); no activity/labor divergence. Severe joint weakness adds a contraction-level qualifier."],
    ["CONTRACTION_RECESSIONARY", "G≥65 and L≥60, outside HOT inflation. Not official recession dating."],
    ["DISINFLATIONARY_SLOWDOWN", "I≤45, Δπ<0.30pp; G≥50 or L≥55; not resilient, severe joint weakness, or activity/labor divergence."],
    ["MIXED", "Resolved evidence with no named gate, or a proved activity/labor divergence. Missing-data ambiguity remains provisional, never Mixed."],
  ];
  return (
    <>
      <Card className="border-amber-200 bg-amber-50/70 shadow-none">
        <CardContent className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center">
          <div className="flex shrink-0 items-center gap-2 text-xs font-semibold text-amber-900"><ShieldAlert className="h-4 w-4" /> Research framework</div>
          <p className="text-xs leading-5 text-amber-900/80">Thresholds are transparent policy choices, not calibrated forecasts. No point-in-time/vintage backtest or predictive validation is claimed. Data Quality and Regime Clarity measure different things.</p>
        </CardContent>
      </Card>
      <Card className="border-slate-200 shadow-none">
        <CardHeader>
          <CardTitle className="text-sm">Supplementary Monitoring — Not classifier inputs</CardTitle>
          <CardDescription>These five public-feed cards are separate monitoring signals. Their scores are not mapped into or substituted for the six-factor regime classifier.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 xl:grid-cols-2">
          {(Object.keys(SCORING_MODEL) as ScoreKey[]).map((key) => {
            const model = SCORING_MODEL[key];
            return (
              <div className="overflow-hidden rounded-md border border-slate-200" key={key}>
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-3 py-2.5">
                  <span className="text-xs font-semibold text-slate-800">{model.label}</span>
                  <span className="text-[9px] font-medium uppercase tracking-wide text-slate-500">Higher = {model.orientation}</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {model.components.map((component) => (
                    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 px-3 py-2 text-[10px]" key={`${key}-${component.input}`}>
                      <span className="text-slate-600">{inputNames[component.input]}</span>
                      <span className="font-mono text-slate-400">{component.direction === "lower" ? "↓" : "↑"} {formatBound(component.low)}–{formatBound(component.high)}</span>
                      <span className="font-mono font-medium text-slate-700">{Math.round(component.weight * 100)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
      <Card className="border-slate-200 shadow-none">
        <CardHeader><CardTitle className="text-sm">U.S. regime gates</CardTitle><CardDescription>Unordered rules: one proven named gate assigns the label; zero proven gates with resolved evidence yields Mixed. Unknown mandatory evidence withholds the label.</CardDescription></CardHeader>
        <CardContent className="px-3 pb-3 sm:px-5">
          <Table>
            <TableHeader><TableRow className="border-slate-100 hover:bg-transparent"><TableHead>Regime</TableHead><TableHead>Required gates</TableHead></TableRow></TableHeader>
            <TableBody>
              {rules.map(([regime, rule]) => (
                <TableRow className="border-slate-100" key={regime}>
                  <TableCell className="whitespace-nowrap text-xs font-medium">{REGIME_LABELS[regime]}</TableCell>
                  <TableCell className="font-mono text-[10px] text-slate-500">{rule}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-slate-200 shadow-none">
          <CardHeader><CardTitle className="text-sm">U.S. core factor readiness</CardTitle><CardDescription>Every factor requires at least 60% coverage and two eligible source families; anchors also need required native comparisons.</CardDescription></CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-2">
            {regimeFactorOrder.map((key) => {
              const factor = payload.regime.factorReadiness[key];
              return (
                <div className="rounded border border-slate-100 bg-slate-50 px-3 py-2" key={key}>
                  <div className="text-[10px] font-medium text-slate-700">{regimeFactorLabels[key]}</div>
                  <div className="mt-1 text-[9px] text-slate-500">{Math.round(factor.coverage * 100)}% coverage · {factor.eligibleFamilies} eligible families · {factor.classifiable ? "Ready" : "Not classifiable"}</div>
                </div>
              );
            })}
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-none">
          <CardHeader><CardTitle className="text-sm">Core Model Data Quality &amp; Regime Clarity</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-xs leading-5 text-slate-600">
            <p><strong className="text-slate-800">Core Model Data Quality</strong> summarizes source eligibility, freshness, history, release quality, and fetch health using a fixed denominator. Missing source weight is not removed.</p>
            <p><strong className="text-slate-800">Regime Clarity</strong> combines rule support, threshold sensitivity, and residual core tensions. Defining evidence is not penalized twice; sensitivity caps apply to every regime label.</p>
            <p>Neither is a probability, forecast, or investment signal. Unresolved missing evidence is provisional or insufficient, not Mixed.</p>
          </CardContent>
        </Card>
      </div>
      <Card className="border-slate-200 shadow-none">
        <CardHeader><CardTitle className="text-sm">Source substitutions and limits</CardTitle></CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MethodFact label="Dollar measure" value="Federal Reserve H.10 Broad Dollar Index (Jan 2006=100), not ICE DXY." />
          <MethodFact label="Indonesia FX" value="ECB-derived EUR/IDR ÷ EUR/USD reference cross, not BI JISDOR or tradable spot." />
          <MethodFact label="Crypto input" value="Bitcoin mempool virtual size and projected fee; blockspace proxy, not price or investor flows." />
          <MethodFact label="Excluded series" value="BTC spot, HY spreads, gold, and stablecoin cap pending confirmed redistribution rights." />
        </CardContent>
      </Card>
      <ObservationTable payload={payload} />
    </>
  );
}

function MethodFact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-md border border-slate-100 bg-slate-50 p-3"><div className="text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-400">{label}</div><div className="mt-1 text-xs leading-5 text-slate-700">{value}</div></div>;
}
