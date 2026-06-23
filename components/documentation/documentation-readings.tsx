import { Card } from "@/components/ui/card";
import { formatDate } from "@/services/documentation-service";
import type { DocumentationReading } from "@/types/documentation";

export function DocumentationReadings({ readings }: { readings: DocumentationReading[] }) {
  return (
    <section className="space-y-4">
      <div><h2 className="text-xl font-semibold">Avlesninger i perioden</h2><p className="mt-1 text-sm text-muted-foreground">Vist i kronologisk rekkefølge.</p></div>
      <div className="mobile-reading-list space-y-3 md:hidden">
        {readings.map((reading) => <ReadingCard key={reading.id} reading={reading} />)}
      </div>
      <Card className="print-surface desktop-reading-table hidden overflow-hidden md:block">
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b border-border bg-white/[0.03] text-xs uppercase tracking-wider text-muted-foreground"><tr><Head>Dato</Head><Head>Tid</Head><Head>Festival</Head><Head>Arrangør</Head><Head>Arrangement</Head><Head>Målerstand</Head><Head>Kommentar</Head></tr></thead><tbody>{readings.map((reading) => <tr key={reading.id} className="border-b border-border/60 last:border-0"><Cell>{formatDate(reading.dato)}</Cell><Cell>{reading.klokkeslett}</Cell><Cell>{reading.festival}</Cell><Cell>{reading.arrangor}</Cell><Cell>{reading.arrangement}</Cell><Cell>{reading.malerstand}</Cell><Cell>{reading.kommentar || "–"}</Cell></tr>)}</tbody></table></div>
      </Card>
    </section>
  );
}

function ReadingCard({ reading }: { reading: DocumentationReading }) {
  return <Card className="print-surface p-5"><div className="grid grid-cols-2 gap-4"><Info label="Dato" value={formatDate(reading.dato)} /><Info label="Tid" value={reading.klokkeslett} /><Info label="Festival" value={reading.festival} /><Info label="Arrangør" value={reading.arrangor} /><Info label="Arrangement" value={reading.arrangement} /><Info label="Målerstand" value={reading.malerstand.toString()} /><div className="col-span-2"><Info label="Kommentar" value={reading.kommentar || "Ingen kommentar"} /></div></div></Card>;
}

function Info({ label, value }: { label: string; value: string }) { return <div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p><p className="mt-1 text-sm font-medium">{value}</p></div>; }
function Head({ children }: { children: React.ReactNode }) { return <th className="px-4 py-4 font-semibold">{children}</th>; }
function Cell({ children }: { children: React.ReactNode }) { return <td className="whitespace-nowrap px-4 py-4 align-top">{children}</td>; }
