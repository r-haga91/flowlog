"use client";

import { memo } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { formatDashboardNumber } from "@/services/dashboard-service";
import type { HistoryData, HistorySummary } from "@/types/history";

const axis = { fill: "hsl(215 14% 65%)", fontSize: 11 };
type Props = Pick<HistoryData, "festivaler" | "arrangementer" | "ar" | "utvikling">;

export const HistoryCharts = memo(function HistoryCharts({ festivaler, arrangementer, ar, utvikling }: Props) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <Chart title="Totalt solgt per festival" description="Hver festival summerer separate arrangementstotaler."><SummaryBars data={festivaler} /></Chart>
      <Chart title="Totalt solgt per arrangement" description="Siste målerstand minus første per arrangement."><SummaryBars data={arrangementer} /></Chart>
      <Chart title="Totalt solgt per år" description="Sammenlign sesonger på tvers av år."><SummaryBars data={ar} color="hsl(207 32% 52%)" /></Chart>
      <Chart title="Utvikling over tid" description="Kumulativt salg innen valgt filter."><ResponsiveContainer width="100%" height="100%"><LineChart data={utvikling} margin={{ top: 10, right: 10, left: -18, bottom: 8 }}><Grid /><XAxis dataKey="etikett" tick={axis} minTickGap={26} /><YAxis tick={axis} tickFormatter={shortNumber} /><HistoryTooltip /><Line type="monotone" dataKey="totaltSolgt" name="Totalt solgt" stroke="hsl(151 35% 52%)" strokeWidth={3} dot={false} activeDot={{ r: 5 }} /></LineChart></ResponsiveContainer></Chart>
    </div>
  );
});

function SummaryBars({ data, color = "hsl(207 45% 64%)" }: { data: HistorySummary[]; color?: string }) {
  return <ResponsiveContainer width="100%" height="100%"><BarChart data={data} margin={{ top: 10, right: 10, left: -18, bottom: 8 }}><Grid /><XAxis dataKey="label" tick={axis} minTickGap={20} /><YAxis tick={axis} tickFormatter={shortNumber} /><HistoryTooltip /><Bar dataKey="totaltSolgt" name="Totalt solgt" fill={color} radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer>;
}
function Chart({ title, description, children }: { title: string; description: string; children: React.ReactNode }) { return <Card className="p-5 sm:p-7"><h2 className="text-lg font-semibold">{title}</h2><p className="mt-1 text-sm text-muted-foreground">{description}</p><div className="mt-6 h-72">{children}</div></Card>; }
function Grid() { return <CartesianGrid stroke="hsl(216 20% 18%)" strokeDasharray="4 4" vertical={false} />; }
function HistoryTooltip() { return <Tooltip contentStyle={{ background: "hsl(216 29% 9%)", border: "1px solid hsl(216 20% 18%)", borderRadius: 14 }} labelStyle={{ color: "hsl(210 25% 96%)", marginBottom: 6 }} itemStyle={{ color: "hsl(215 14% 75%)" }} formatter={(value) => [`${formatDashboardNumber(Number(value))} L`]} />; }
function shortNumber(value: number) { return Intl.NumberFormat("nb-NO", { notation: "compact", maximumFractionDigits: 1 }).format(value); }
