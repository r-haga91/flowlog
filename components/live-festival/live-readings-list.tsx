import { Card } from "@/components/ui/card";
import { formatDashboardNumber } from "@/services/dashboard-service";
import type { LiveReading } from "@/types/live-festival";

export function LiveReadingsList({ readings }: { readings: LiveReading[] }) {
  return (
    <section>
      <div className="mb-4"><h2 className="text-xl font-semibold">Siste 5 avlesninger</h2><p className="mt-1 text-sm text-muted-foreground">Nyeste registrering vises øverst.</p></div>
      {!readings.length ? <Card className="p-6 text-center text-sm text-muted-foreground">Ingen avlesninger registrert på oppdraget ennå.</Card> : <div className="space-y-3">{readings.map((reading) => <Card key={reading.id} className="p-5"><div className="flex items-center justify-between gap-4"><div><p className="font-semibold">kl. {reading.klokkeslett}</p>{reading.rollover && <span className="mt-2 inline-flex rounded-full bg-amber-400/10 px-2.5 py-1 text-xs font-semibold text-amber-200">Rollover</span>}</div><p className="text-xl font-semibold">{formatDashboardNumber(reading.malerstand)} L</p></div>{reading.kommentar && <p className="mt-3 border-t border-border pt-3 text-sm text-muted-foreground">{reading.kommentar}</p>}</Card>)}</div>}
    </section>
  );
}
