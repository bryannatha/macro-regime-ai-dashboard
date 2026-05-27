"use client";

import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  Bitcoin,
  Droplets,
  Gauge,
  RefreshCw,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
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
} from "@/lib/types";
import { cn } from "@/lib/utils";

interface RegimeDashboardProps {
  assessment: RegimeAssessment;
  current: MarketSnapshot;
  history: MarketSnapshot[];
  playbook: AssetPlaybook;
  previous: MarketSnapshot;
  scores: CategoryScore[];
}

const scoreThemes: Record<
  ScoreKey,
  { icon: LucideIcon; iconClass: string; meter: string }
> = {
  inflationPressure: {
    icon: Activity,
    iconClass: "bg-amber-50 text-amber-700",
    meter: "bg-amber-500",
  },
  growthStress: {
    icon: Gauge,
    iconClass: "bg-rose-50 text-rose-700",
    meter: "bg-rose-500",
  },
  liquidity: {
    icon: Droplets,
    iconClass: "bg-teal-50 text-teal-700",
    meter: "bg-teal-500",
  },
  cryptoDemand: {
    icon: Bitcoin,
    iconClass: "bg-blue-50 text-blue-700",
    meter: "bg-blue-500",
  },
  indonesiaRisk: {
    icon: Banknote,
    iconClass: "bg-violet-50 text-violet-700",
    meter: "bg-violet-500",
  },
};

const metricKeys = Object.keys(metricMetadata) as MetricKey[];

function formatMetric(key: MetricKey, value: number): string {
  const metric = metricMetadata[key];
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: metric.decimals,
    maximumFractionDigits: metric.decimals,
  }).format(value);
}

function metricChange(key: MetricKey, current: number, previous: number): string {
  const delta = current - previous;
  const prefix = delta > 0 ? "+" : "";
  return `${prefix}${formatMetric(key, delta)}`;
}

function formatReportTime(value: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date(value));
}

const tooltipStyle = {
  borderRadius: "12px",
  borderColor: "#e2e8f0",
  boxShadow: "0 8px 20px rgba(15, 23, 42, 0.08)",
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
  const [report, setReport] = useState<AIReport | null>(null);
  const [reportError, setReportError] = useState<string | null>(null);
  const [loadingReport, setLoadingReport] = useState(true);

  const requestReport = useCallback(async () => {
    setLoadingReport(true);
    setReportError(null);

    try {
      const response = await fetch("/api/ai-report", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Report endpoint returned an error.");
      }
      setReport((await response.json()) as AIReport);
    } catch {
      setReportError("The mock daily report could not be loaded.");
    } finally {
      setLoadingReport(false);
    }
  }, []);

  useEffect(() => {
    void requestReport();
  }, [requestReport]);

  const chartData = useMemo(
    () =>
      history.map(({ date, metrics }) => ({
        label: new Intl.DateTimeFormat("en-US", { month: "short" }).format(
          new Date(`${date}T00:00:00`),
        ),
        cpi: metrics.cpi,
        coreCpi: metrics.coreCpi,
        oil: metrics.oil,
        btc: metrics.btcPrice / 1000,
        stablecoins: metrics.stablecoinMarketCap,
        dxy: metrics.dxy,
        usdidr: metrics.usdidr,
      })),
    [history],
  );

  return (
    <main className="mx-auto flex min-h-screen max-w-[1480px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant="positive">Macro Regime Engine</Badge>
            <Badge variant="outline">Mock data through 27 May 2026</Badge>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Macro Regime AI Dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            A rules-based view of inflation, growth stress, market liquidity, digital asset
            demand, and Indonesia external vulnerability.
          </p>
        </div>
        <div className="rounded-lg border bg-white px-4 py-3 text-sm text-muted-foreground shadow-panel">
          Educational research tool, not financial advice.
        </div>
      </header>

      <section className="grid gap-4 xl:grid-cols-5">
        {scores.map((score) => {
          const theme = scoreThemes[score.key];
          const Icon = theme.icon;

          return (
            <Card key={score.key}>
              <CardHeader className="space-y-4 p-5 pb-3">
                <div className="flex items-start justify-between">
                  <span className={cn("rounded-md p-2", theme.iconClass)}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <Badge variant={score.score >= 65 ? "caution" : "secondary"}>
                    {score.reading}
                  </Badge>
                </div>
                <CardTitle className="text-sm text-muted-foreground">{score.label}</CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <div className="mb-3 flex items-baseline gap-1">
                  <span className="tabular text-3xl font-semibold">{score.score}</span>
                  <span className="text-sm text-muted-foreground">/ 100</span>
                </div>
                <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div
                    className={cn("h-full rounded-full", theme.meter)}
                    style={{ width: `${score.score}%` }}
                  />
                </div>
                <p className="text-xs leading-5 text-muted-foreground">{score.summary}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-slate-950 text-white">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <CardDescription className="mb-2 text-slate-400">Detected regime</CardDescription>
                <CardTitle className="text-3xl">{assessment.regime}</CardTitle>
              </div>
              <div className="rounded-lg bg-white/10 px-4 py-3">
                <div className="text-xs text-slate-300">Confidence</div>
                <div className="tabular text-2xl font-semibold">{assessment.confidence}%</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-5 p-6 sm:grid-cols-2">
            {assessment.rationale.map((item) => (
              <div className="flex gap-3 text-sm leading-6" key={item}>
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-teal-500" />
                <span>{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Asset Playbook</CardTitle>
            <CardDescription>{playbook.thesis}</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-3 text-xs">
            <PlaybookGroup label="Favor" items={playbook.favor} className="text-teal-700" />
            <PlaybookGroup label="Neutral" items={playbook.neutral} className="text-slate-600" />
            <PlaybookGroup label="Reduce" items={playbook.reduce} className="text-rose-700" />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <ChartCard title="Inflation Pulse" description="CPI versus energy cost backdrop">
          <ResponsiveContainer height={230} width="100%">
            <LineChart data={chartData}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
              <XAxis axisLine={false} dataKey="label" fontSize={12} tickLine={false} />
              <YAxis axisLine={false} domain={[2, 4]} fontSize={12} tickLine={false} />
              <YAxis axisLine={false} fontSize={12} orientation="right" tickLine={false} yAxisId="oil" />
              <Tooltip contentStyle={tooltipStyle} />
              <Line dataKey="cpi" dot={false} name="CPI %" stroke="#0f766e" strokeWidth={2} />
              <Line dataKey="coreCpi" dot={false} name="Core CPI %" stroke="#2563eb" strokeWidth={2} />
              <Line dataKey="oil" dot={false} name="Oil USD" stroke="#d97706" strokeWidth={2} yAxisId="oil" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Crypto Liquidity" description="BTC demand and stablecoin capacity">
          <ResponsiveContainer height={230} width="100%">
            <LineChart data={chartData}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
              <XAxis axisLine={false} dataKey="label" fontSize={12} tickLine={false} />
              <YAxis axisLine={false} fontSize={12} tickLine={false} />
              <YAxis axisLine={false} fontSize={12} orientation="right" tickLine={false} yAxisId="stable" />
              <Tooltip contentStyle={tooltipStyle} />
              <Line dataKey="btc" dot={false} name="BTC USD k" stroke="#2563eb" strokeWidth={2} />
              <Line
                dataKey="stablecoins"
                dot={false}
                name="Stablecoins USD bn"
                stroke="#0f766e"
                strokeWidth={2}
                yAxisId="stable"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Indonesia FX Risk" description="USDIDR pressure against broad dollar">
          <ResponsiveContainer height={230} width="100%">
            <LineChart data={chartData}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
              <XAxis axisLine={false} dataKey="label" fontSize={12} tickLine={false} />
              <YAxis axisLine={false} fontSize={12} tickLine={false} />
              <YAxis axisLine={false} fontSize={12} orientation="right" tickLine={false} yAxisId="dxy" />
              <Tooltip contentStyle={tooltipStyle} />
              <Line dataKey="usdidr" dot={false} name="USDIDR" stroke="#7c3aed" strokeWidth={2} />
              <Line dataKey="dxy" dot={false} name="DXY" stroke="#64748b" strokeWidth={2} yAxisId="dxy" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.78fr_1.22fr]">
        <Card>
          <CardHeader>
            <CardTitle>Latest Metrics</CardTitle>
            <CardDescription>Local mock dataset, current versus prior observation</CardDescription>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="text-right">Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metricKeys.map((key) => {
                  const difference = current.metrics[key] - previous.metrics[key];
                  return (
                    <TableRow key={key}>
                      <TableCell>
                        <div className="font-medium">{metricMetadata[key].label}</div>
                        <div className="text-xs text-muted-foreground">
                          {metricMetadata[key].unit}
                        </div>
                      </TableCell>
                      <TableCell className="tabular text-right font-medium">
                        {formatMetric(key, current.metrics[key])}
                      </TableCell>
                      <TableCell className="tabular text-right">
                        <span
                          className={cn(
                            "inline-flex items-center gap-0.5",
                            difference > 0
                              ? "text-slate-700"
                              : difference < 0
                                ? "text-teal-700"
                                : "text-muted-foreground",
                          )}
                        >
                          {difference > 0 ? (
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          ) : difference < 0 ? (
                            <ArrowDownRight className="h-3.5 w-3.5" />
                          ) : null}
                          {metricChange(key, current.metrics[key], previous.metrics[key])}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader className="flex-row items-start justify-between space-y-0">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-teal-600" />
                <CardTitle>AI-Assisted Daily Report</CardTitle>
              </div>
              <CardDescription>
                Mock structured JSON from <code className="rounded bg-secondary px-1">/api/ai-report</code>
              </CardDescription>
            </div>
            <Button disabled={loadingReport} onClick={() => void requestReport()} size="sm" variant="outline">
              <RefreshCw className={cn("h-4 w-4", loadingReport && "animate-spin")} />
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            {loadingReport ? (
              <div className="space-y-3">
                <div className="h-5 w-56 animate-pulse rounded bg-secondary" />
                <div className="h-16 animate-pulse rounded bg-secondary" />
                <div className="h-24 animate-pulse rounded bg-secondary" />
              </div>
            ) : reportError ? (
              <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                {reportError}
              </div>
            ) : report ? (
              <div className="space-y-6">
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Badge variant="positive">{report.regime}</Badge>
                    <span className="text-xs text-muted-foreground">
                      Generated {formatReportTime(report.generatedAt)} WIB
                    </span>
                  </div>
                  <h3 className="font-semibold">{report.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {report.executiveSummary}
                  </p>
                </div>
                <ReportList label="Key signals" items={report.signals} />
                <ReportList label="Watchlist" items={report.watchlist} />
                <div className="rounded-lg bg-secondary/60 p-4 text-xs leading-5 text-muted-foreground">
                  {report.riskNote}
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </section>

      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        Educational research tool, not financial advice. No brokerage connectivity or trade
        execution is provided.
      </footer>
    </main>
  );
}

function PlaybookGroup({
  className,
  items,
  label,
}: {
  className: string;
  items: string[];
  label: string;
}) {
  return (
    <div>
      <div className={cn("mb-3 font-semibold uppercase tracking-wide", className)}>{label}</div>
      <div className="space-y-2 text-foreground">
        {items.map((item) => (
          <div className="rounded-md bg-secondary/60 px-2 py-2 leading-4" key={item}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function ChartCard({
  children,
  description,
  title,
}: {
  children: ReactNode;
  description: string;
  title: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pl-2 pr-5">{children}</CardContent>
    </Card>
  );
}

function ReportList({ items, label }: { items: string[]; label: string }) {
  return (
    <div>
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </h4>
      <div className="space-y-3">
        {items.map((item) => (
          <div className="flex gap-3 text-sm leading-6" key={item}>
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
