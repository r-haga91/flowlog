import { Activity, Clock3, Gauge, Timer, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatDashboardNumber } from "@/services/dashboard-service";
import type { DashboardMetrics } from "@/types/dashboard";

export function DashboardKpis({ metrics }: { metrics: DashboardMetrics }) {
  const items = [
    { label: "Startmåling", value: `${formatDashboardNumber(metrics.startmaling)} L`, icon: Gauge },
    { label: "Sluttmåling", value: `${formatDashboardNumber(metrics.sluttmaling)} L`, icon: Gauge },
    { label: "Antall avlesninger", value: formatDashboardNumber(metrics.antallAvlesninger), icon: Activity },
    { label: "Gjennomsnitt liter/time", value: `${formatDashboardNumber(metrics.gjennomsnittPerTime)} L/t`, icon: Timer },
    { label: "Høyeste liter/time", value: `${formatDashboardNumber(metrics.hoyestePerTime)} L/t`, icon: TrendingUp },
    { label: "Første avlesning", value: metrics.forsteAvlesning, icon: Clock3 },
    { label: "Siste avlesning", value: metrics.sisteAvlesning, icon: Clock3 },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="relative overflow-hidden p-6 sm:col-span-2 lg:col-span-2">
        <div className="absolute -right-8 -top-8 size-32 rounded-full bg-success/10 blur-2xl" />
        <p className="text-sm font-medium text-muted-foreground">Totalt solgt</p>
        <p className="mt-3 text-4xl font-semibold tracking-tight text-success sm:text-5xl">{formatDashboardNumber(metrics.totaltSolgt)} <span className="text-2xl">liter</span></p>
      </Card>
      {items.map(({ label, value, icon: Icon }) => <Card key={label} className="flex min-h-36 flex-col justify-between p-6"><span className="w-fit rounded-xl bg-primary/10 p-2.5 text-primary"><Icon className="size-5" /></span><div><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-lg font-semibold leading-snug">{value}</p></div></Card>)}
    </div>
  );
}
