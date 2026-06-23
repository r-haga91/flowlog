import { AlertTriangle, Clock3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { DashboardStatus } from "@/types/dashboard";

export function DashboardStatusCard({ status }: { status: DashboardStatus }) {
  return (
    <Card className="p-6 sm:p-8">
      <div className="flex items-center gap-3"><span className="rounded-xl bg-primary/10 p-2.5 text-primary"><Clock3 className="size-5" /></span><div><p className="text-sm text-muted-foreground">Status</p><h2 className="text-lg font-semibold">Siste registrering</h2></div></div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2"><div><p className="text-xs text-muted-foreground">Tidspunkt</p><p className="mt-1 font-semibold">{status.sisteRegistrering}</p></div><div><p className="text-xs text-muted-foreground">Tid siden siste registrering</p><p className="mt-1 font-semibold">{status.tidSiden}</p></div></div>
      {status.overEnTime && <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-amber-200"><AlertTriangle className="mt-0.5 size-5 shrink-0" /><p className="text-sm font-medium">Det er over en time siden siste registrering.</p></div>}
    </Card>
  );
}
