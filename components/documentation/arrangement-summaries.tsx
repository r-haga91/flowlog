import { Card } from "@/components/ui/card";
import { formatLiters } from "@/services/documentation-service";
import type { ArrangementSummary } from "@/types/documentation";

export function ArrangementSummaries({ summaries }: { summaries: ArrangementSummary[] }) {
  return (
    <section className="space-y-4">
      <div><h2 className="text-xl font-semibold">Oppsummering per arrangement</h2><p className="mt-1 text-sm text-muted-foreground">Beregnet separat med første og siste måling for hvert arrangement.</p></div>
      <div className="grid gap-4 lg:grid-cols-2">
        {summaries.map((summary) => (
          <Card key={summary.arrangementId} className="print-surface p-6">
            <h3 className="text-lg font-semibold">{summary.arrangement}</h3>
            <p className="mt-4 text-3xl font-semibold tracking-tight">{formatLiters(summary.totaltSolgt)}</p>
            <div className="mt-5 grid grid-cols-3 gap-3 text-sm"><Info label="Start" value={summary.startmaling} /><Info label="Slutt" value={summary.sluttmaling} /><Info label="Avlesninger" value={summary.antall} /></div>
          </Card>
        ))}
      </div>
    </section>
  );
}

function Info({ label, value }: { label: string; value: number }) {
  return <div><p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p><p className="mt-1 font-semibold">{value}</p></div>;
}
