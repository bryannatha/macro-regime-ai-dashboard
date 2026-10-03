"use client";

import React, { useCallback, useEffect, useState } from "react";
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
import { SCORING_MODEL } from "@/lib/scoring";
import type {
  AIReport,
  CategoryScore,
  DashboardPayload,
  MetricObservation,
  ObservationKey,
  Regime,
  ScoreKey,
  ScoreOrientation,
} from "@/lib/types";
import { cn } from "@/lib/utils";

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

const tooltipStyle = {
  borderRadius: "8px",
  borderColor: "#dbe3e8",
  boxShadow: "0 12px 30px rgba(15, 23, 42, 0.1)",
  fontSize: "12px",
};

const requiredCore: ScoreKey[] = [
  "inflationPressure",
  "growthStress",
  "liquidity",
  "cryptoDemand",
];

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
  const date = new Date(value.length === 10 ? `${value}T00:00:00Z` : value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(includeTime ? { hour: "2-digit", minute: "2-digit" } : {}),
    timeZone: "Asia/Jakarta",
  }).format(date);
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

function formatPeriod(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "2-digit",
    timeZone: "UTC",
  }).format(new Date(`${value.slice(0, 10)}T00:00:00Z`));
}

function sourceCount(payload: DashboardPayload): { available: number; total: number; excluded: number } {
  const observations = Object.values(payload.observations);
  return {
    available: observations.filter((item) => item.status === "available").length,
    total: observations.filter((item) => item.status !== "excluded").length,
    excluded: observations.filter((item) => item.status === "excluded").length,
  };
}

export function RegimeDashboard({ payload }: RegimeDashboardProps) {
  const [view, setView] = useState<DashboardView>("overview");
  const [report, setReport] = useState<AIReport | null>(null);
  const [reportError, setReportError] = useState<string | null>(null);
  const [loadingReport, setLoadingReport] = useState(true);
  const counts = sourceCount(payload);

  const requestReport = useCallback(async () => {
    setLoadingReport(true);
    setReportError(null);
    try {
      const response = await fetch("/api/ai-report", { cache: "no-store" });
      if (!response.ok) throw new Error("Report request failed");
      setReport((await response.json()) as AIReport);
    } catch {
      setReportError("The rules brief could not be loaded. The dashboard data is still available.");
    } finally {
      setLoadingReport(false);
    }
  }, []);

  useEffect(() => {
    void requestReport();
  }, [requestReport]);

  const title = view === "overview"
    ? "Macro regime overview"
    : view === "sources"
      ? "Data & sources"
      : "Methodology";
  const subtitle = view === "overview"
    ? "A concise, public-data read across inflation, growth, liquidity, crypto blockspace, and Indonesia FX."
    : view === "sources"
      ? "Every value carries a source, observation date, retrieval time, cadence, and availability state."
      : "Transparent, provisional rules; missing inputs are never scored as zero.";

  return (
    <div className="min-h-screen bg-[#f4f7f8] text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-[72px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 xl:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-xs font-bold text-white">MR</div>
            <div className="min-w-0">
              <h1 className="truncate text-sm font-semibold tracking-tight">Macro Regime AI Dashboard</h1>
              <p className="mt-0.5 hidden text-[11px] text-slate-500 sm:block">Daily macro monitor · public sources · read only</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden text-right sm:block">
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Data checked</div>
              <div className="tabular mt-0.5 text-xs font-medium text-slate-700">{formatDate(payload.generatedAt, true)} WIB</div>
            </div>
            <Badge variant={counts.available > 0 ? "positive" : "caution"} className="whitespace-nowrap">
              {counts.available}/{counts.total} feeds available
            </Badge>
            <Button aria-label="Refresh dashboard data" onClick={() => window.location.reload()} size="sm" variant="outline">
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
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
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-700">Daily context · rules-based · provisional</div>
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
      <section aria-label="Macro scores" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {payload.scores.map((score) => <ScoreCard key={score.key} score={score} />)}
      </section>
      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <ObservationCharts observations={payload.observations} />
        <PlaybookCard payload={payload} />
      </section>
      <ReportCard
        error={reportError}
        loading={loadingReport}
        onRefresh={onRefreshReport}
        report={report}
      />
    </>
  );
}

function RegimeSummary({ payload }: { payload: DashboardPayload }) {
  const coreScores = requiredCore.map((key) => payload.scores.find((score) => score.key === key)).filter(Boolean) as CategoryScore[];
  return (
    <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
      <Card className={cn(
        "overflow-hidden border-slate-800 bg-slate-950 text-white shadow-none",
        !payload.regime && "border-amber-300 bg-amber-50 text-slate-900",
      )}>
        <div className="grid gap-6 p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className={cn("text-[10px] font-semibold uppercase tracking-[0.18em]", payload.regime ? "text-teal-300" : "text-amber-800")}>Current regime</span>
              <Badge variant={payload.regime ? "outline" : "caution"} className={payload.regime ? "border-white/20 bg-white/5 text-slate-300" : ""}>
                {payload.regime ? "Rules classification" : "Core coverage required"}
              </Badge>
            </div>
            <h3 className="text-3xl font-semibold tracking-tight sm:text-[34px]">
              {payload.regime?.regime ?? "Regime withheld"}
            </h3>
            <p className={cn("mt-3 max-w-2xl text-sm leading-6", payload.regime ? "text-slate-300" : "text-slate-700")}>
              {payload.regime
                ? payload.regime.rationale[0]
                : "Inflation, growth, liquidity, and crypto blockspace scores each need at least 60% input coverage. No default regime is substituted."}
            </p>
          </div>
          {payload.regime ? (
            <div className="min-w-[148px] rounded-md border border-white/10 bg-white/[0.04] p-4">
              <div className="text-[10px] font-medium uppercase tracking-[0.15em] text-slate-400">Heuristic confidence</div>
              <div className="tabular mt-2 font-mono text-3xl font-semibold">{payload.regime.confidence}<span className="text-lg text-slate-400">%</span></div>
              <div className="mt-1 text-[10px] text-slate-500">Not calibrated or backtested</div>
            </div>
          ) : (
            <div className="min-w-[148px] rounded-md border border-amber-200 bg-white/70 p-4">
              <div className="text-[10px] font-medium uppercase tracking-[0.15em] text-amber-800">Required inputs</div>
              <div className="mt-2 text-xs font-semibold text-slate-800">4 core categories</div>
              <div className="mt-1 text-[10px] text-slate-500">Each at 60%+ coverage</div>
            </div>
          )}
        </div>
        <div className={cn("flex flex-col gap-2 border-t px-5 py-3 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6", payload.regime ? "border-white/10 text-slate-300" : "border-amber-200 text-slate-700")}>
          <span>{payload.regime?.rationale[1] ?? "Scores and regime thresholds are provisional heuristics, not a forecast."}</span>
          <span className="font-mono text-[10px] uppercase tracking-wide opacity-70">As of {formatDate(payload.dataAsOf)}</span>
        </div>
      </Card>

      <Card className="border-slate-200 shadow-none">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-sm">Core data coverage</CardTitle>
            <Badge variant="outline" className="text-[10px]">60% minimum</Badge>
          </div>
          <CardDescription>Coverage is available configured input weight; missing data is not zero.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {coreScores.map((score) => (
            <div className="flex items-center gap-3" key={score.key}>
              <span className={cn("h-2 w-2 rounded-full", score.score === null ? "bg-amber-500" : "bg-teal-500")} />
              <span className="min-w-0 flex-1 truncate text-xs font-medium text-slate-700">{score.label}</span>
              <span className="tabular font-mono text-xs text-slate-500">{score.coveragePercent}%</span>
              <span className="min-w-[76px] text-right text-[10px] text-slate-500">{score.score === null ? "Withheld" : `${score.score}/100`}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
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
          <Badge variant={score.score === null ? "caution" : "outline"} className="max-w-[130px] truncate text-[9px]">{score.reading}</Badge>
        </div>
        <div className="mt-3 truncate text-xs font-medium text-slate-600">{score.label}</div>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="tabular font-mono text-[27px] font-semibold tracking-tight text-slate-950">{score.score ?? "N/A"}</span>
          {score.score !== null && <span className="text-[10px] text-slate-400">/ 100</span>}
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-100">
          {score.score !== null && <div className={cn("h-full rounded-full", theme.bar)} style={{ width: `${score.score}%` }} />}
        </div>
        <p className="mt-2 min-h-[30px] text-[10px] leading-[15px] text-slate-500" title={score.explanation}>
          {score.coveragePercent}% coverage · {score.score === null ? "60% needed" : "available inputs reweighted"}
        </p>
      </CardContent>
    </Card>
  );
}

function PlaybookCard({ payload }: { payload: DashboardPayload }) {
  const playbook = payload.playbook;
  return (
    <Card className="border-slate-200 shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-teal-700" />
          <CardTitle className="text-sm">Asset playbook</CardTitle>
          {playbook && <Badge variant="outline" className="ml-auto text-[10px]">{playbook.regime}</Badge>}
        </div>
        <CardDescription>{playbook?.thesis ?? "Withheld until required core score coverage supports a regime classification."}</CardDescription>
      </CardHeader>
      <CardContent>
        {playbook ? (
          <div className="space-y-3">
            <PlaybookGroup label="Research areas to favor" items={playbook.favor} tone="positive" />
            <PlaybookGroup label="Keep neutral" items={playbook.neutral} tone="neutral" />
            <PlaybookGroup label="Research areas to reduce" items={playbook.reduce} tone="caution" />
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 px-3 py-5 text-center text-xs text-slate-500">
            No regime, no playbook. This panel does not fill missing data with a default scenario.
          </div>
        )}
        <p className="mt-4 border-t border-slate-100 pt-3 text-[10px] leading-4 text-slate-400">Scenario context only. No weights, timing, or personalized allocation.</p>
      </CardContent>
    </Card>
  );
}

function PlaybookGroup({
  items,
  label,
  tone,
}: {
  items: string[];
  label: string;
  tone: "positive" | "neutral" | "caution";
}) {
  const theme = {
    positive: "border-teal-100 bg-teal-50/70 text-teal-900",
    neutral: "border-slate-100 bg-slate-50 text-slate-700",
    caution: "border-amber-100 bg-amber-50/70 text-amber-900",
  }[tone];
  return (
    <div>
      <div className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-400">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => <span className={cn("rounded border px-2 py-1 text-[10px]", theme)} key={item}>{item}</span>)}
      </div>
    </div>
  );
}

function ReportCard({
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
      <CardHeader className="flex-row items-start justify-between space-y-0 pb-3">
        <div>
          <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-teal-700" /><CardTitle className="text-sm">Daily rules brief</CardTitle></div>
          <CardDescription className="mt-1">Deterministic rules output; not AI-generated.</CardDescription>
        </div>
        <Button disabled={loading} onClick={onRefresh} size="sm" variant="outline">
          <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} /> Refresh brief
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="rounded-md bg-slate-50 p-4 text-xs text-slate-500">Loading the current coverage-aware brief…</p>
        ) : error ? (
          <p className="rounded-md border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">{error}</p>
        ) : report ? (
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={report.regime ? "positive" : "caution"}>{report.regime ?? "Regime withheld"}</Badge>
                <span className="text-[10px] text-slate-400">Generated {formatDate(report.generatedAt, true)} WIB</span>
              </div>
              <h3 className="mt-2 text-sm font-semibold text-slate-800">{report.title}</h3>
              <p className="mt-1.5 text-xs leading-5 text-slate-600">{report.executiveSummary}</p>
              <p className="mt-3 text-[10px] text-slate-400">Latest input date: {formatDate(report.dataAsOf)} · ruleset output</p>
            </div>
            <div className="grid content-start gap-4 sm:grid-cols-2">
              <ReportList items={report.signals} label="Key readings" />
              <ReportList items={report.watchlist} label="Watchlist" />
            </div>
          </div>
        ) : null}
        <p className="mt-4 border-t border-slate-100 pt-3 text-[10px] leading-4 text-slate-400">
          {report?.riskNote ?? "Rules-generated research context, not a forecast. Educational research tool, not financial advice."}
        </p>
      </CardContent>
    </Card>
  );
}

function ReportList({ items, label }: { items: string[]; label: string }) {
  return (
    <div>
      <h4 className="mb-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-400">{label}</h4>
      <ul className="space-y-2">
        {items.length ? items.map((item) => <li className="flex gap-2 text-[10px] leading-4 text-slate-600" key={item}><span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-teal-600" />{item}</li>) : <li className="text-[10px] text-slate-400">No items available.</li>}
      </ul>
    </div>
  );
}

function SourcesView({ payload }: { payload: DashboardPayload }) {
  return (
    <>
      <ObservationTable payload={payload} />
      <ObservationCharts observations={payload.observations} />
    </>
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
                    <div className="mt-1 text-[9px] leading-4 text-slate-400 sm:hidden">As of {formatDate(observation.observedAt)} · {observation.cadence}</div>
                  </TableCell>
                  <TableCell className="hidden max-w-[380px] py-3 md:table-cell">
                    <div className="text-[10px] font-medium text-slate-600">
                      {observation.sourceUrl ? (
                        <a className="underline decoration-slate-300 underline-offset-2 hover:text-teal-700" href={observation.sourceUrl} rel="noreferrer" target="_blank">{observation.source}</a>
                      ) : observation.source}
                    </div>
                    <div className="mt-1 text-[10px] leading-4 text-slate-400">{observation.detail}</div>
                    <div className="mt-1 text-[9px] text-slate-400">Retrieved {formatDate(observation.fetchedAt, true)} WIB</div>
                  </TableCell>
                  <TableCell className="hidden py-3 text-[10px] text-slate-500 lg:table-cell">{observation.cadence}</TableCell>
                  <TableCell className="tabular whitespace-nowrap px-2 py-3 text-right font-mono text-xs font-medium text-slate-800 sm:px-3">{formatValue(observation)}</TableCell>
                  <TableCell className="hidden py-3 text-right text-[10px] text-slate-500 sm:table-cell">{formatDate(observation.observedAt)}</TableCell>
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
    <section>
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Provider history</h3>
          <p className="mt-1 text-[11px] text-slate-500">Only dated observations returned by the source are charted. No synthetic score history.</p>
        </div>
        <Badge variant="outline" className="text-[10px]">{chartable.length} series with history</Badge>
      </div>
      {chartable.length ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
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
  const history = observation.history.slice(-60).map((point) => ({
    ...point,
    period: formatPeriod(point.date),
  }));
  const color = chartColors[observation.key] ?? "#0f9b8e";
  return (
    <Card className="border-slate-200 shadow-none">
      <CardHeader className="pb-1">
        <CardTitle className="text-xs">{observation.label}</CardTitle>
        <CardDescription>{observation.unit} · {history.length} dated points</CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <ResponsiveContainer height={150} width="100%">
          <LineChart data={history} margin={{ left: -22, right: 4, top: 5, bottom: 0 }}>
            <CartesianGrid stroke="#e8edf0" strokeDasharray="3 4" vertical={false} />
            <XAxis axisLine={false} dataKey="period" fontSize={9} tickLine={false} tick={{ fill: "#94a3b8" }} />
            <YAxis axisLine={false} fontSize={9} tickLine={false} tick={{ fill: "#94a3b8" }} width={42} />
            <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value} ${observation.unit}`, observation.label]} />
            <Line dataKey="value" dot={false} name={observation.label} stroke={color} strokeWidth={2} type="monotone" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function MethodView({ payload }: { payload: DashboardPayload }) {
  const rules: Array<[Regime, string]> = [
    ["Hard Landing", "Growth stress ≥ 68, liquidity < 42, inflation < 62"],
    ["Stagflation", "Inflation ≥ 62 and growth stress ≥ 55"],
    ["Commodity Inflation", "Inflation ≥ 60 and observed Brent ≥ $85"],
    ["Fiat Debasement", "Liquidity ≥ 64, crypto score ≥ 63, and observed gold ≥ $2,850"],
    ["Liquidity Reflation", "Liquidity ≥ 52 and crypto score ≥ 54"],
    ["Goldilocks", "Residual state after the four core categories have adequate coverage"],
  ];
  return (
    <>
      <Card className="border-amber-200 bg-amber-50/70 shadow-none">
        <CardContent className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center">
          <div className="flex shrink-0 items-center gap-2 text-xs font-semibold text-amber-900"><ShieldAlert className="h-4 w-4" /> Provisional model</div>
          <p className="text-xs leading-5 text-amber-900/80">Linear bounds and fixed thresholds are illustrative, not calibrated forecasts. The rules have not been backtested. Scores below 60% input-weight coverage are withheld.</p>
        </CardContent>
      </Card>
      <Card className="border-slate-200 shadow-none">
        <CardHeader>
          <CardTitle className="text-sm">Score construction</CardTitle>
          <CardDescription>Each available input is linearly scaled between its bounds and clamped to 0–100. Present weights are renormalized only when coverage is at least 60%.</CardDescription>
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
        <CardHeader><CardTitle className="text-sm">Regime decision order</CardTitle><CardDescription>First matching rule wins. All four core score categories must have adequate coverage first.</CardDescription></CardHeader>
        <CardContent className="px-3 pb-3 sm:px-5">
          <Table>
            <TableHeader><TableRow className="border-slate-100 hover:bg-transparent"><TableHead>Regime</TableHead><TableHead>Rule</TableHead><TableHead className="hidden text-right sm:table-cell">Order</TableHead></TableRow></TableHeader>
            <TableBody>
              {rules.map(([regime, rule], index) => (
                <TableRow className="border-slate-100" key={regime}>
                  <TableCell className="text-xs font-medium">{regime}</TableCell>
                  <TableCell className="font-mono text-[10px] text-slate-500">{rule}</TableCell>
                  <TableCell className="hidden text-right font-mono text-[10px] text-slate-400 sm:table-cell">{String(index + 1).padStart(2, "0")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
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
