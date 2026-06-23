import { formatDate } from "@/services/documentation-service";
import { formatDashboardNumber } from "@/services/dashboard-service";
import type { DocumentationReading } from "@/types/documentation";

export function DashboardLatestReadings({ readings }: { readings: DocumentationReading[] }) {
  return (
    <section>
      <div className="mb-5"><h2 className="text-xl font-semibold">Siste registreringer</h2><p className="mt-1 text-sm text-muted-foreground">De 10 nyeste avlesningene i valgt periode.</p></div>
      <div className="grid gap-3 md:hidden">{readings.map((reading) => <article key={reading.id} className="rounded-2xl border border-border bg-card p-5"><div className="flex items-start justify-between gap-4"><div><p className="font-semibold">{formatDate(reading.dato)} kl. {reading.klokkeslett}</p><p className="mt-1 text-sm text-muted-foreground">{reading.festival} · {reading.arrangement}</p></div><p className="shrink-0 text-lg font-semibold">{formatDashboardNumber(reading.malerstand)} L</p></div>{reading.kommentar && <p className="mt-4 border-t border-border pt-4 text-sm text-muted-foreground">{reading.kommentar}</p>}</article>)}</div>
      <div className="hidden overflow-hidden rounded-3xl border border-border bg-card md:block"><table className="w-full text-left text-sm"><thead className="bg-white/[0.03] text-xs text-muted-foreground"><tr><th className="px-6 py-4 font-medium">Dato og tid</th><th className="px-6 py-4 font-medium">Festival</th><th className="px-6 py-4 font-medium">Arrangement</th><th className="px-6 py-4 font-medium">Målerstand</th><th className="px-6 py-4 font-medium">Kommentar</th></tr></thead><tbody className="divide-y divide-border">{readings.map((reading) => <tr key={reading.id}><td className="px-6 py-4 font-medium">{formatDate(reading.dato)} kl. {reading.klokkeslett}</td><td className="px-6 py-4 text-muted-foreground">{reading.festival}</td><td className="px-6 py-4 text-muted-foreground">{reading.arrangement}</td><td className="px-6 py-4 font-semibold">{formatDashboardNumber(reading.malerstand)} L</td><td className="max-w-xs truncate px-6 py-4 text-muted-foreground">{reading.kommentar || "–"}</td></tr>)}</tbody></table></div>
    </section>
  );
}
