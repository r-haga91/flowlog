"use client";

import { memo } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { formatDashboardNumber } from "@/services/dashboard-service";
import type { DashboardPoint } from "@/types/dashboard";

type Props = { malerstand: DashboardPoint[]; intervaller: DashboardPoint[]; kumulativ: DashboardPoint[] };
const axis = { fill: "hsl(215 14% 65%)", fontSize: 11 };

export const DashboardCharts = memo(function DashboardCharts({ malerstand, intervaller, kumulativ }: Props) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <ChartCard title="Målerstand over tid" description="Kumulativ målerstand for hver registrering.">
        <ResponsiveContainer width="100%" height="100%"><LineChart data={malerstand} margin={{ top: 10, right: 10, left: -18, bottom: 8 }}><Grid /><XAxis dataKey="etikett" tick={axis} minTickGap={28} /><YAxis tick={axis} tickFormatter={shortNumber} /><ChartTooltip suffix="L" /><Line type="monotone" dataKey="malerstand" name="Målerstand" stroke="hsl(207 45% 64%)" strokeWidth={3} dot={false} activeDot={{ r: 5 }} /></LineChart></ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Liter/time" description="Hastighet mellom hver avlesning.">
        <ResponsiveContainer width="100%" height="100%"><BarChart data={intervaller} margin={{ top: 10, right: 10, left: -18, bottom: 8 }}><Grid /><XAxis dataKey="etikett" tick={axis} minTickGap={28} /><YAxis tick={axis} tickFormatter={shortNumber} /><ChartTooltip suffix="L/t" /><Bar dataKey="literPerTime" name="Liter/time" fill="hsl(207 45% 64%)" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Solgt mellom avlesninger" description="Mengde registrert i hvert intervall.">
        <ResponsiveContainer width="100%" height="100%"><BarChart data={intervaller} margin={{ top: 10, right: 10, left: -18, bottom: 8 }}><Grid /><XAxis dataKey="etikett" tick={axis} minTickGap={28} /><YAxis tick={axis} tickFormatter={shortNumber} /><ChartTooltip suffix="L" /><Bar dataKey="solgt" name="Solgt" fill="hsl(207 32% 52%)" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Kumulativt salg" description="Utvikling fra første avlesning, som starter på 0.">
        <ResponsiveContainer width="100%" height="100%"><LineChart data={kumulativ} margin={{ top: 10, right: 10, left: -18, bottom: 8 }}><Grid /><XAxis dataKey="etikett" tick={axis} minTickGap={28} /><YAxis tick={axis} tickFormatter={shortNumber} /><ChartTooltip suffix="L" /><Line type="monotone" dataKey="solgt" name="Kumulativt salg" stroke="hsl(151 35% 52%)" strokeWidth={3} dot={false} activeDot={{ r: 5 }} /></LineChart></ResponsiveContainer>
      </ChartCard>
    </div>
  );
});

function ChartCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return <Card className="p-5 sm:p-7"><h2 className="text-lg font-semibold">{title}</h2><p className="mt-1 text-sm text-muted-foreground">{description}</p><div className="mt-6 h-72 w-full">{children}</div></Card>;
}

function Grid() { return <CartesianGrid stroke="hsl(216 20% 18%)" strokeDasharray="4 4" vertical={false} />; }
function ChartTooltip({ suffix }: { suffix: string }) {
  return <Tooltip contentStyle={{ background: "hsl(216 29% 9%)", border: "1px solid hsl(216 20% 18%)", borderRadius: 14 }} labelStyle={{ color: "hsl(210 25% 96%)", marginBottom: 6 }} itemStyle={{ color: "hsl(215 14% 75%)" }} formatter={(value) => [`${formatDashboardNumber(Number(value))} ${suffix}`]} />;
}
function shortNumber(value: number) { return Intl.NumberFormat("nb-NO", { notation: "compact", maximumFractionDigits: 1 }).format(value); }
