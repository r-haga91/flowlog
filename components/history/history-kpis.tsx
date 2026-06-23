import { Activity, CalendarDays, MapPin, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatDashboardNumber } from "@/services/dashboard-service";
import type { HistoryData } from "@/types/history";

export function HistoryKpis({ metrics }: { metrics: HistoryData["metrics"] }) {
  const items = [
    { label: "Antall festivaler", value: String(metrics.antallFestivaler), icon: MapPin },
    { label: "Antall arrangementer", value: String(metrics.antallArrangementer), icon: CalendarDays },
    { label: "Antall avlesninger", value: String(metrics.antallAvlesninger), icon: Activity },
    { label: "Beste festival", value: metrics.besteFestival, icon: Trophy },
    { label: "Beste arrangement", value: metrics.besteArrangement, icon: Trophy },
    { label: "Beste år", value: metrics.besteAr, icon: Trophy },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="relative overflow-hidden p-6 sm:col-span-2 lg:col-span-2"><div className="absolute -right-8 -top-8 size-32 rounded-full bg-success/10 blur-2xl" /><p className="text-sm text-muted-foreground">Totalt solgt i valgt filter</p><p className="mt-3 text-4xl font-semibold tracking-tight text-success sm:text-5xl">{formatDashboardNumber(metrics.totaltSolgt)} <span className="text-2xl">liter</span></p></Card>
      {items.map(({ label, value, icon: Icon }) => <Card key={label} className="flex min-h-36 flex-col justify-between p-6"><span className="w-fit rounded-xl bg-primary/10 p-2.5 text-primary"><Icon className="size-5" /></span><div><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-lg font-semibold leading-snug">{value}</p></div></Card>)}
    </div>
  );
}
