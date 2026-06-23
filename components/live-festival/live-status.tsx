import { Activity, Clock3, Gauge, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatDashboardNumber } from "@/services/dashboard-service";
import type { LiveSnapshot } from "@/types/live-festival";

type Props = { snapshot: LiveSnapshot; timeSince: string; paused: boolean };

export function LiveStatus({ snapshot, timeSince, paused }: Props) {
  const items = [
    { label: "Siste registrering", value: snapshot.sisteTid ? `${snapshot.sisteTid} · ${timeSince}` : "Ingen ennå", icon: Clock3 },
    { label: "Antall registreringer", value: String(snapshot.antall), icon: Activity },
    { label: "Totalt solgt hittil", value: `${formatDashboardNumber(snapshot.totaltSolgt)} L`, icon: TrendingUp },
  ];
  return (
    <section>
      <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-semibold">Status</h2><span className={`rounded-full px-3 py-1 text-xs font-semibold ${paused ? "bg-amber-400/10 text-amber-200" : "bg-success/10 text-success"}`}>{paused ? "Pauset" : "Oppdrag aktivt"}</span></div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Card className="flex min-h-36 flex-col justify-between p-5 sm:col-span-2"><Gauge className="size-5 text-primary" /><div><p className="text-xs text-muted-foreground">Siste registrerte målerstand</p><p className="mt-1 text-3xl font-semibold">{snapshot.sisteMalerstand === null ? "–" : `${formatDashboardNumber(snapshot.sisteMalerstand)} L`}</p></div></Card>
        {items.map(({ label, value, icon: Icon }) => <Card key={label} className="flex min-h-32 flex-col justify-between p-5"><Icon className="size-5 text-primary" /><div><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 font-semibold">{value}</p></div></Card>)}
      </div>
    </section>
  );
}
