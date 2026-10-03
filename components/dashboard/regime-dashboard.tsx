"use client";

import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  Bitcoin,
  BookOpen,
  ChevronRight,
  Command,
  Droplets,
  Gauge,
  LayoutDashboard,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import { metricMetadata } from "@/data/mock-metrics";
import type {
  AIReport,
  AssetPlaybook,
  CategoryScore,
  MarketSnapshot,
  MetricKey,
  RegimeAssessment,
  ScoreKey,
  ScoreOrientation,
} from "@/lib/types";
import { SCORING_MODEL, calculateScores } from "@/lib/scoring";
import { cn } from "@/lib/utils";

interface RegimeDashboardProps {
  assessment: RegimeAssessment;
  current: MarketSnapshot;
  history: MarketSnapshot[];
  playbook: AssetPlaybook;
  previous: MarketSnapshot;
  scores: CategoryScore[];
}

type DashboardView = "overview" | "signals" | "method";

const scoreThemes: Record<ScoreOrientation, { icon: LucideIcon; tint: string; bar: string }> = {
  risk: { icon: ShieldAlert, tint: "bg-rose-50 text-rose-700", bar: "bg-rose-500" },
  support: { icon: Droplets, tint: "bg-teal-50 text-teal-700", bar: "bg-teal-500" },
  demand: { icon: Bitcoin, tint: "bg-blue-50 text-blue-700", bar: "bg-blue-500" },
};

const scoreIcons: Record<ScoreKey, LucideIcon> = {
  inflationPressure: Activity,
  growthStress: Gauge,
  liquidity: Droplets,
  cryptoDemand: Bitcoin,
  indonesiaRisk: Banknote,
};

const metricKeys = Object.keys(metricMetadata) as MetricKey[];
const chartColors = {
  inflationPressure: "#f59e0b",
  growthStress: "#e11d48",
  liquidity: "#0f9b8e",
  cryptoDemand: "#3b82f6",
  indonesiaRisk: "#8b5cf6",
};

function formatMetric(key: MetricKey, value: number): string {
  const metric = metricMetadata[key];
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: metric.decimals,
    maximumFractionDigits: metric.decimals,
  }).format(value);
}

function formatDate(value: string, style: "short" | "long" = "short"): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: style === "short" ? "2-digit" : "numeric",
    month: style === "short" ? "short" : "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(new Date(`${value.slice(0, 10)}T00:00:00+07:00`));
}

function formatPeriod(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "2-digit",
    timeZone: "UTC",
  }).format(new Date(`${value.slice(0, 10)}T00:00:00Z`));
}

function changeText(key: MetricKey, current: number, previous: number): string {
  const delta = current - previous;
  return `${delta > 0 ? "+" : ""}${formatMetric(key, delta)}`;
}

function reportTime(value: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  }).format(new Date(value));
}

const tooltipStyle = {
  borderRadius: "8px",
  borderColor: "#dbe3e8",
  boxShadow: "0 12px 30px rgba(15, 23, 42, 0.1)",
  fontSize: "12px",
};

export function RegimeDashboard({
  assessment,
  current,
  history,
  playbook,
  previous,
  scores,
}: RegimeDashboardProps) {
  const [view, setView] = useState<DashboardView>("overview");
  const [period, setPeriod] = useState<"6M" | "1Y" | "MAX">("1Y");
  const [report, setReport] = useState<AIReport | null>(null);
  const [reportError, setReportError] = useState<string | null>(null);
  const [loadingReport, setLoadingReport] = useState(true);

  const requestReport = useCallback(async () => {
    setLoadingReport(true);
    setReportError(null);

    try {
      const response = await fetch("/api/ai-report", { cache: "no-store" });
      if (!response.ok) throw new Error("Brief endpoint returned an error.");
      setReport((await response.json()) as AIReport);
    } catch {
      setReportError("The rules brief could not be loaded. Try again in a moment.");
    } finally {
      setLoadingReport(false);
    }
  }, []);

  useEffect(() => {
    void requestReport();
  }, [requestReport]);

  const selectedHistory = useMemo(() => {
    if (period === "MAX") return history;
    const count = period === "6M" ? 6 : 12;
    return history.slice(-count);
  }, [history, period]);

  const scoreHistory = useMemo(
    () =>
      selectedHistory.map((snapshot, index) => {
        const historyIndex = history.indexOf(snapshot);
        const prior = history[Math.max(historyIndex - 1, 0)] ?? selectedHistory[index];
        const row: Record<string, string | number> = { period: formatPeriod(snapshot.date) };
        calculateScores(snapshot, prior).forEach((score) => {
          row[score.key] = score.score;
        });
        return row;
      }),
    [history, selectedHistory],
  );

  const marketHistory = useMemo(
    () =>
      selectedHistory.map((snapshot) => ({
        period: formatPeriod(snapshot.date),
        cpi: snapshot.metrics.cpi,
        coreCpi: snapshot.metrics.coreCpi,
        oil: snapshot.metrics.oil,
        btc: snapshot.metrics.btcPrice / 1000,
        stablecoins: snapshot.metrics.stablecoinMarketCap,
        usdidr: snapshot.metrics.usdidr,
      })),
    [selectedHistory],
  );

  const navigation: Array<{ id: DashboardView; label: string; icon: LucideIcon }> = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "signals", label: "Signals & data", icon: TrendingUp },
    { id: "method", label: "Methodology", icon: BookOpen },
  ];

  const heading = {
    overview: ["Macro monitor", "A concise read on the forces shaping risk."],
    signals: ["Signals & data", "Inspect the latest sample values and the path behind each score."],
    method: ["Methodology", "Every score is rules-based, bounded, and inspectable."],
  }[view];

  return (
    <div className="min-h-screen bg-[#f4f7f8] text-slate-900 lg:flex">
      <aside className="hidden w-[228px] shrink-0 flex-col border-r border-slate-200 bg-white lg:sticky lg:top-0 lg:flex lg:h-screen">
        <div className="flex h-[76px] items-center gap-3 border-b border-slate-100 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-xs font-bold tracking-tight text-white">
            MR
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight">Macro Research</div>
            <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">Monitor</div>
          </div>
        </div>

        <div className="px-3 pt-6">
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Workspace
          </div>
          <nav aria-label="Dashboard views" className="space-y-1">
            {navigation.map(({ id, icon: Icon, label }) => (
              <button
                aria-current={view === id ? "page" : undefined}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition",
                  view === id
                    ? "bg-slate-950 font-medium text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                )}
                key={id}
                onClick={() => setView(id)}
                type="button"
              >
                <Icon className="h-4 w-4" />
                {label}
                {view === id && <ChevronRight className="ml-auto h-3.5 w-3.5" />}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto space-y-3 p-4">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-amber-800">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Demo data
            </div>
            <p className="mt-2 text-xs leading-5 text-amber-900/80">
              Synthetic sample series. No live provider is connected.
            </p>
            <div className="mt-2 border-t border-amber-200 pt-2 text-[10px] text-amber-800">
              Sample ends {formatDate(current.date)}
            </div>
          </div>
          <div className="flex items-center gap-2 px-2 text-[10px] text-slate-400">
            <Command className="h-3.5 w-3.5" />
            <span>Research console · v0.2</span>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex min-h-[76px] max-w-[1500px] items-center justify-between gap-4 px-4 sm:px-6 xl:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-950 text-[10px] font-bold text-white lg:hidden">
                MR
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">Macro Regime Dashboard</div>
                <div className="mt-0.5 hidden text-[11px] text-slate-500 sm:block">
                  Monitoring workspace <span className="px-1 text-slate-300">/</span> {heading[0]}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden text-right sm:block">
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Sample data as of</div>
                <div className="tabular mt-0.5 text-xs font-medium text-slate-700">{formatDate(current.date)}</div>
              </div>
              <Badge className="border-amber-200 bg-amber-50 text-amber-800" variant="outline">
                <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-amber-500" /> Static demo
              </Badge>
              <Button
                className="hidden sm:inline-flex"
                disabled={loadingReport}
                onClick={() => void requestReport()}
                size="sm"
                variant="outline"
              >
                <RefreshCw className={cn("h-3.5 w-3.5", loadingReport && "animate-spin")} />
                Refresh brief
              </Button>
            </div>
          </div>
          <nav aria-label="Dashboard views" className="flex gap-1 overflow-x-auto border-t border-slate-100 px-4 py-2 lg:hidden">
            {navigation.map(({ id, label }) => (
              <button
                aria-current={view === id ? "page" : undefined}
                className={cn(
                  "whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium",
                  view === id ? "bg-slate-950 text-white" : "text-slate-500 hover:bg-slate-100",
                )}
                key={id}
                onClick={() => setView(id)}
                type="button"
              >
                {label}
              </button>
            ))}
          </nav>
        </header>

        <main className="mx-auto flex max-w-[1500px] flex-col gap-5 px-4 py-6 sm:px-6 xl:px-8">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-700">Daily context · rules-based</div>
              <h1 className="mt-1 text-[26px] font-semibold tracking-tight text-slate-950">{heading[0]}</h1>
              <p className="mt-1 text-sm text-slate-500">{heading[1]}</p>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span className="font-mono text-slate-400">LOCAL / JAKARTA</span>
              <span className="text-slate-300">·</span>
              <span>Observation date: {formatDate(current.date)}</span>
            </div>
          </div>

          <MarketStrip current={current} previous={previous} />

          {view === "overview" ? (
            <OverviewView
              assessment={assessment}
              current={current}
              history={scoreHistory}
              playbook={playbook}
              report={report}
              reportError={reportError}
              loadingReport={loadingReport}
              onRefresh={() => void requestReport()}
              period={period}
              setPeriod={setPeriod}
              scores={scores}
            />
          ) : view === "signals" ? (
            <SignalsView
              current={current}
              marketHistory={marketHistory}
              previous={previous}
              scoreHistory={scoreHistory}
              scores={scores}
              period={period}
              setPeriod={setPeriod}
            />
          ) : (
            <MethodView />
          )}

          <footer className="flex flex-col justify-between gap-2 border-t border-slate-200 py-4 text-[11px] text-slate-500 sm:flex-row sm:items-center">
            <span>Educational research tool, not financial advice. No trade execution.</span>
            <span>Synthetic demo observations · sample ends {formatDate(current.date)}</span>
          </footer>
        </main>
      </div>
    </div>
  );
}

function MarketStrip({ current, previous }: { current: MarketSnapshot; previous: MarketSnapshot }) {
  const items: Array<{ key: MetricKey; ticker: string }> = [
    { key: "dxy", ticker: "DXY" },
    { key: "twoYearYield", ticker: "US 2Y" },
    { key: "btcPrice", ticker: "BTC / USD" },
    { key: "goldPrice", ticker: "GOLD / USD" },
    { key: "usdidr", ticker: "USD / IDR" },
  ];

  return (
    <section aria-label="Market snapshot" className="grid grid-cols-2 overflow-hidden rounded-lg border border-slate-200 bg-white sm:grid-cols-3 lg:grid-cols-5">
      {items.map(({ key, ticker }, index) => {
        const delta = current.metrics[key] - previous.metrics[key];
        return (
          <div className={cn("flex min-w-0 flex-col gap-1 px-4 py-3", index > 0 && "border-l border-slate-100")} key={key}>
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">{ticker}</span>
            <div className="flex items-baseline justify-between gap-2">
              <span className="tabular truncate font-mono text-[15px] font-semibold tracking-tight text-slate-900">
                {formatMetric(key, current.metrics[key])}
              </span>
              <span className="tabular shrink-0 font-mono text-[10px] text-slate-400">
                {delta > 0 ? "+" : ""}{formatMetric(key, delta)}
              </span>
            </div>
          </div>
        );
      })}
    </section>
  );
}

function OverviewView({
  assessment,
  current,
  history,
  playbook,
  report,
  reportError,
  loadingReport,
  onRefresh,
  period,
  setPeriod,
  scores,
}: {
  assessment: RegimeAssessment;
  current: MarketSnapshot;
  history: Array<Record<string, string | number>>;
  playbook: AssetPlaybook;
  report: AIReport | null;
  reportError: string | null;
  loadingReport: boolean;
  onRefresh: () => void;
  period: "6M" | "1Y" | "MAX";
  setPeriod: (period: "6M" | "1Y" | "MAX") => void;
  scores: CategoryScore[];
}) {
  const topSignals = [...scores].sort((a, b) => b.score - a.score).slice(0, 3);
  return (
    <>
      <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <Card className="overflow-hidden border-slate-800 bg-slate-950 text-white shadow-none">
          <div className="grid gap-6 p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-teal-300">Current regime</span>
                <span className="rounded border border-white/15 px-2 py-0.5 text-[10px] font-medium text-slate-300">FIRST-MATCH RULESET</span>
              </div>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-[34px]">{assessment.regime}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">{assessment.rationale[0]} {playbook.thesis}</p>
            </div>
            <div className="min-w-[148px] rounded-md border border-white/10 bg-white/[0.04] p-4">
              <div className="text-[10px] font-medium uppercase tracking-[0.15em] text-slate-400">Heuristic confidence</div>
              <div className="tabular mt-2 font-mono text-3xl font-semibold">{assessment.confidence}<span className="text-lg text-slate-400">%</span></div>
              <div className="mt-1 text-[10px] text-slate-500">Not statistically calibrated</div>
            </div>
          </div>
          <div className="flex flex-col gap-2 border-t border-white/10 px-5 py-3 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <span className="text-slate-300">{assessment.rationale[1]}</span>
            <span className="font-mono text-[10px] uppercase tracking-wide text-slate-500">Sample · {formatDate(current.date)}</span>
          </div>
        </Card>

        <Card className="border-slate-200 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-sm">Signal watch</CardTitle>
              <Badge variant="outline" className="text-[10px]">Top readings</Badge>
            </div>
            <CardDescription>Highest category scores in the sample</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topSignals.map((signal) => (
              <div className="flex items-center gap-3" key={signal.key}>
                <span className={cn("h-2 w-2 rounded-full", scoreThemes[signal.orientation].bar)} />
                <span className="min-w-0 flex-1 truncate text-xs font-medium text-slate-700">{signal.label}</span>
                <span className="tabular font-mono text-xs text-slate-400">{signal.score}</span>
                <span className="min-w-[76px] text-right text-[10px] text-slate-500">{signal.reading}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section aria-label="Macro scores" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {scores.map((score) => <ScoreCard key={score.key} score={score} />)}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <ScoreHistoryCard history={history} period={period} setPeriod={setPeriod} />
        <PlaybookCard playbook={playbook} />
      </section>

      <ReportCard
        loading={loadingReport}
        onRefresh={onRefresh}
        report={report}
        error={reportError}
      />
    </>
  );
}

function ScoreCard({ score }: { score: CategoryScore }) {
  const theme = scoreThemes[score.orientation];
  const Icon = scoreIcons[score.key];
  return (
    <Card className="border-slate-200 shadow-none">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className={cn("rounded-md p-2", theme.tint)}><Icon className="h-3.5 w-3.5" /></div>
          <Badge variant="outline" className="max-w-[110px] truncate text-[9px]">{score.reading}</Badge>
        </div>
        <div className="mt-3 truncate text-xs font-medium text-slate-600">{score.label}</div>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="tabular font-mono text-[27px] font-semibold tracking-tight text-slate-950">{score.score}</span>
          <span className="text-[10px] text-slate-400">/ 100</span>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-100">
          <div className={cn("h-full rounded-full", theme.bar)} style={{ width: `${score.score}%` }} />
        </div>
        <p className="mt-2 min-h-[30px] text-[10px] leading-[15px] text-slate-500">Higher = {score.orientation === "risk" ? "more risk" : score.orientation === "support" ? "more support" : "more demand"}.</p>
      </CardContent>
    </Card>
  );
}

function ScoreHistoryCard({
  history,
  period,
  setPeriod,
}: {
  history: Array<Record<string, string | number>>;
  period: "6M" | "1Y" | "MAX";
  setPeriod: (period: "6M" | "1Y" | "MAX") => void;
}) {
  const controls: Array<"6M" | "1Y" | "MAX"> = ["6M", "1Y", "MAX"];
  return (
    <Card className="border-slate-200 shadow-none">
      <CardHeader className="flex-row items-start justify-between space-y-0 pb-1">
        <div>
          <CardTitle className="text-sm">Regime inputs over time</CardTitle>
          <CardDescription className="mt-1">Normalized category scores · sample observations</CardDescription>
        </div>
        <div className="flex rounded-md border border-slate-200 p-0.5">
          {controls.map((control) => (
            <button className={cn("rounded px-2 py-1 font-mono text-[9px]", period === control ? "bg-slate-950 text-white" : "text-slate-500 hover:bg-slate-100")} key={control} onClick={() => setPeriod(control)} type="button">
              {control}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pt-3">
        <div className="mb-3 flex flex-wrap gap-x-4 gap-y-2">
          {([
            ["inflationPressure", "Inflation", chartColors.inflationPressure],
            ["growthStress", "Growth stress", chartColors.growthStress],
            ["liquidity", "Liquidity", chartColors.liquidity],
            ["indonesiaRisk", "Indonesia risk", chartColors.indonesiaRisk],
          ] as const).map(([key, label, color]) => (
            <span className="flex items-center gap-1.5 text-[10px] text-slate-500" key={key}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />{label}
            </span>
          ))}
        </div>
        <ResponsiveContainer height={230} width="100%">
          <LineChart data={history} margin={{ left: -20, right: 8, top: 6, bottom: 0 }}>
            <CartesianGrid stroke="#e8edf0" strokeDasharray="3 4" vertical={false} />
            <XAxis axisLine={false} dataKey="period" fontSize={10} tickLine={false} tick={{ fill: "#94a3b8" }} />
            <YAxis axisLine={false} domain={[0, 100]} fontSize={10} tickLine={false} tick={{ fill: "#94a3b8" }} ticks={[0, 25, 50, 75, 100]} />
            <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value}/100`, "Score"]} />
            <Line dataKey="inflationPressure" dot={false} name="Inflation" stroke={chartColors.inflationPressure} strokeWidth={2} type="monotone" />
            <Line dataKey="growthStress" dot={false} name="Growth stress" stroke={chartColors.growthStress} strokeWidth={2} type="monotone" />
            <Line dataKey="liquidity" dot={false} name="Liquidity" stroke={chartColors.liquidity} strokeWidth={2} type="monotone" />
            <Line dataKey="indonesiaRisk" dot={false} name="Indonesia risk" stroke={chartColors.indonesiaRisk} strokeWidth={2} type="monotone" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function PlaybookCard({ playbook }: { playbook: AssetPlaybook }) {
  return (
    <Card className="border-slate-200 shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-teal-700" />
          <CardTitle className="text-sm">Regime playbook</CardTitle>
        </div>
        <CardDescription>{playbook.thesis}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <PlaybookGroup label="Research areas to favor" items={playbook.favor} tone="positive" />
        <PlaybookGroup label="Keep neutral" items={playbook.neutral} tone="neutral" />
        <PlaybookGroup label="Research areas to reduce" items={playbook.reduce} tone="caution" />
        <p className="border-t border-slate-100 pt-3 text-[10px] leading-4 text-slate-400">Scenario context only. No weights, timing, or personalized allocation.</p>
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
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-teal-700" />
            <CardTitle className="text-sm">Daily rules brief</CardTitle>
          </div>
          <CardDescription className="mt-1">Generated from the current sample, not an AI model.</CardDescription>
        </div>
        <Button disabled={loading} onClick={onRefresh} size="sm" variant="outline">
          <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} /> Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="grid gap-3 sm:grid-cols-3">
            {[0, 1, 2].map((item) => <div className="h-[82px] animate-pulse rounded-md bg-slate-100" key={item} />)}
          </div>
        ) : error ? (
          <p className="rounded-md border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">{error}</p>
        ) : report ? (
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="positive">{report.regime}</Badge>
                <span className="text-[10px] text-slate-400">Brief generated {reportTime(report.generatedAt)} WIB</span>
              </div>
              <h3 className="mt-2 text-sm font-semibold text-slate-800">{report.title}</h3>
              <p className="mt-1.5 text-xs leading-5 text-slate-600">{report.executiveSummary}</p>
              <p className="mt-3 text-[10px] text-slate-400">Underlying sample: {formatDate(report.dataAsOf)} · ruleset output</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <ReportList items={report.signals} label="Key readings" />
              <ReportList items={report.watchlist} label="Watch levels" />
            </div>
          </div>
        ) : null}
        <div className="mt-4 border-t border-slate-100 pt-3 text-[10px] text-slate-400">{report?.riskNote ?? "Educational research only; not a market feed or investment recommendation."}</div>
      </CardContent>
    </Card>
  );
}

function ReportList({ items, label }: { items: string[]; label: string }) {
  return (
    <div>
      <h4 className="mb-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-400">{label}</h4>
      <ul className="space-y-2">
        {items.map((item) => <li className="flex gap-2 text-[10px] leading-4 text-slate-600" key={item}><span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-teal-600" />{item}</li>)}
      </ul>
    </div>
  );
}

function SignalsView({
  current,
  marketHistory,
  previous,
  scoreHistory,
  scores,
  period,
  setPeriod,
}: {
  current: MarketSnapshot;
  marketHistory: Array<Record<string, string | number>>;
  previous: MarketSnapshot;
  scoreHistory: Array<Record<string, string | number>>;
  scores: CategoryScore[];
  period: "6M" | "1Y" | "MAX";
  setPeriod: (period: "6M" | "1Y" | "MAX") => void;
}) {
  return (
    <>
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {scores.map((score) => <ScoreCard key={score.key} score={score} />)}
      </section>
      <ScoreHistoryCard history={scoreHistory} period={period} setPeriod={setPeriod} />
      <Card className="border-slate-200 shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Latest observations</CardTitle>
          <CardDescription>Synthetic fixture · sample date {formatDate(current.date)} · period-to-period changes use the prior sample.</CardDescription>
        </CardHeader>
        <CardContent className="px-2 pb-2 sm:px-4">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100 hover:bg-transparent">
                <TableHead>Series</TableHead>
                <TableHead>Cadence</TableHead>
                <TableHead className="text-right">Sample</TableHead>
                <TableHead className="text-right">Change</TableHead>
                <TableHead className="hidden text-right md:table-cell">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metricKeys.map((key) => {
                const delta = current.metrics[key] - previous.metrics[key];
                return (
                  <TableRow className="border-slate-100" key={key}>
                    <TableCell className="py-3">
                      <div className="text-xs font-medium text-slate-800">{metricMetadata[key].label}</div>
                      <div className="mt-0.5 text-[10px] text-slate-400">{metricMetadata[key].unit}</div>
                    </TableCell>
                    <TableCell className="text-[10px] text-slate-500">{metricMetadata[key].cadence}</TableCell>
                    <TableCell className="tabular text-right font-mono text-xs font-medium">{formatMetric(key, current.metrics[key])}</TableCell>
                    <TableCell className="tabular text-right font-mono text-[10px] text-slate-500">
                      <span className="inline-flex items-center justify-end gap-1">
                        {delta > 0 ? <ArrowUpRight className="h-3 w-3 text-slate-400" /> : delta < 0 ? <ArrowDownRight className="h-3 w-3 text-slate-400" /> : null}
                        {changeText(key, current.metrics[key], previous.metrics[key])}
                      </span>
                    </TableCell>
                    <TableCell className="hidden text-right md:table-cell"><Badge variant="outline" className="text-[9px]">Demo · {formatDate(current.date)}</Badge></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        <MarketHistoryCard title="Inflation inputs" subtitle="CPI series and Brent crude sample" data={marketHistory} lines={[{ key: "cpi", label: "CPI %", color: "#0f9b8e" }, { key: "coreCpi", label: "Core CPI %", color: "#3b82f6" }, { key: "oil", label: "Brent USD", color: "#f59e0b", axis: "oil" }]} />
        <MarketHistoryCard title="Crypto demand" subtitle="BTC (USD thousands) and stablecoin cap (USD bn)" data={marketHistory} lines={[{ key: "btc", label: "BTC USD k", color: "#3b82f6" }, { key: "stablecoins", label: "Stablecoins USD bn", color: "#0f9b8e", axis: "stable" }]} />
      </div>
    </>
  );
}

function MarketHistoryCard({
  data,
  lines,
  subtitle,
  title,
}: {
  data: Array<Record<string, string | number>>;
  lines: Array<{ key: string; label: string; color: string; axis?: string }>;
  subtitle: string;
  title: string;
}) {
  return (
    <Card className="border-slate-200 shadow-none">
      <CardHeader className="pb-1"><CardTitle className="text-sm">{title}</CardTitle><CardDescription>{subtitle}</CardDescription></CardHeader>
      <CardContent className="pt-2">
        <ResponsiveContainer height={220} width="100%">
          <LineChart data={data} margin={{ left: -18, right: 0, top: 5, bottom: 0 }}>
            <CartesianGrid stroke="#e8edf0" strokeDasharray="3 4" vertical={false} />
            <XAxis axisLine={false} dataKey="period" fontSize={10} tickLine={false} tick={{ fill: "#94a3b8" }} />
            <YAxis axisLine={false} fontSize={10} tickLine={false} tick={{ fill: "#94a3b8" }} />
            {lines.some((line) => line.axis) && <YAxis axisLine={false} fontSize={10} orientation="right" tickLine={false} tick={{ fill: "#94a3b8" }} yAxisId={lines.find((line) => line.axis)?.axis} />}
            <Tooltip contentStyle={tooltipStyle} />
            {lines.map((line) => <Line dataKey={line.key} dot={false} key={line.key} name={line.label} stroke={line.color} strokeWidth={2} type="monotone" yAxisId={line.axis} />)}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function MethodView() {
  const inputLabel = (input: string) => {
    if (input === "btcMomentum") return "BTC change vs prior sample";
    if (input === "stablecoinMomentum") return "Stablecoin cap change vs prior sample";
    return metricMetadata[input as MetricKey].label;
  };

  const regimeRules = [
    ["Hard Landing", "Growth stress ≥ 68, liquidity < 42, inflation < 62"],
    ["Stagflation", "Inflation ≥ 62 and growth stress ≥ 55"],
    ["Commodity Inflation", "Inflation ≥ 60 and Brent ≥ $85"],
    ["Fiat Debasement", "Liquidity ≥ 64, crypto demand ≥ 63, gold ≥ $2,850"],
    ["Liquidity Reflation", "Liquidity ≥ 52 and crypto demand ≥ 54"],
    ["Goldilocks", "Residual state when no earlier rule matches; not a forecast"],
  ];

  return (
    <>
      <Card className="border-amber-200 bg-amber-50/70 shadow-none">
        <CardContent className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-900"><ShieldAlert className="h-4 w-4" /> Prototype model</div>
          <p className="text-xs leading-5 text-amber-900/80">Fixed thresholds and linear normalization are illustrative. The confidence percentage is heuristic and has not been calibrated or backtested.</p>
        </CardContent>
      </Card>
      <Card className="border-slate-200 shadow-none">
        <CardHeader>
          <CardTitle className="text-sm">Score construction</CardTitle>
          <CardDescription>Each component is linearly scaled between its low and high bounds, clamped to 0–100, then combined by weight. “Lower” reverses the scale.</CardDescription>
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
                      <span className="text-slate-600">{inputLabel(component.input)}</span>
                      <span className="font-mono text-slate-400">{component.direction === "lower" ? "↓" : "↑"} {component.low}–{component.high}</span>
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
        <CardHeader><CardTitle className="text-sm">Regime decision order</CardTitle><CardDescription>First matching rule wins. The residual label is shown last.</CardDescription></CardHeader>
        <CardContent className="px-3 pb-3 sm:px-5">
          <Table>
            <TableHeader><TableRow className="border-slate-100 hover:bg-transparent"><TableHead>Regime</TableHead><TableHead>Rule</TableHead><TableHead className="hidden text-right sm:table-cell">Order</TableHead></TableRow></TableHeader>
            <TableBody>
              {regimeRules.map(([regime, rule], index) => (
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
        <CardContent className="grid gap-4 p-4 sm:grid-cols-3">
          <MethodFact label="Dataset" value="Synthetic fixture" />
          <MethodFact label="Sample ends" value="27 May 2026" />
          <MethodFact label="Live data" value="Not connected" />
        </CardContent>
      </Card>
    </>
  );
}

function MethodFact({ label, value }: { label: string; value: string }) {
  return <div><div className="text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-400">{label}</div><div className="mt-1 text-xs font-medium text-slate-700">{value}</div></div>;
}
