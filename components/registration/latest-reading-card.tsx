import { Gauge, MessageSquareText } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { LatestReading } from "@/types/reading";

export function LatestReadingCard({ reading }: { reading: LatestReading | null }) {
  return (
    <Card className="p-6 sm:p-8">
      <div className="mb-6 flex items-center gap-3"><span className="rounded-xl bg-primary/10 p-2.5 text-primary"><Gauge className="size-5" /></span><h2 className="text-xl font-semibold">Siste registrerte avlesning</h2></div>
      {!reading ? <p className="text-sm text-muted-foreground">Ingen avlesninger er registrert ennå.</p> : (
        <div className="grid grid-cols-2 gap-5">
          <Info label="Dato" value={new Date(`${reading.dato}T00:00:00`).toLocaleDateString("nb-NO")} />
          <Info label="Tid" value={reading.klokkeslett} />
          <Info label="Festival" value={reading.festival} />
          <Info label="Arrangement" value={reading.arrangement} />
          <Info label="Målerstand" value={new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 3 }).format(reading.malerstand)} prominent />
          <div className="col-span-2"><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"><MessageSquareText className="size-3.5" />Kommentar</p><p className="mt-2 text-sm leading-6">{reading.kommentar || "Ingen kommentar"}</p></div>
        </div>
      )}
    </Card>
  );
}

function Info({ label, value, prominent = false }: { label: string; value: string; prominent?: boolean }) {
  return <div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p><p className={prominent ? "mt-1 text-2xl font-semibold" : "mt-1 text-base font-medium"}>{value}</p></div>;
}
