import { FileCheck2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Notice } from "@/components/ui/notice";
import { formatDate, formatLiters } from "@/services/documentation-service";
import type { DocumentationFilter, DocumentationLabels, ReadingSummary } from "@/types/documentation";

export function DocumentationSummary({ summary, labels, filter }: { summary: ReadingSummary; labels: DocumentationLabels; filter: DocumentationFilter }) {
  return (
    <div className="space-y-4">
      <Card className="print-surface overflow-hidden border-primary/25 p-6 sm:p-9">
        <div className="flex items-center gap-3 text-primary"><FileCheck2 className="size-6" /><p className="text-sm font-semibold uppercase tracking-wider">Totalt solgt</p></div>
        <p className="mt-5 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">{formatLiters(summary.totaltSolgt)}</p>
        <div className="mt-7 grid grid-cols-2 gap-4 text-sm text-muted-foreground"><span>Startmåling<br /><strong className="mt-1 block text-lg text-foreground">{summary.startmaling}</strong></span><span>Sluttmåling<br /><strong className="mt-1 block text-lg text-foreground">{summary.sluttmaling}</strong></span></div>
      </Card>
      {summary.antall === 1 && <Notice>Det trengs minst to avlesninger for å beregne solgt mengde.</Notice>}
      {summary.rollover && <Notice>Målerstand gikk ned i perioden. Dette er beregnet som rollover.</Notice>}
      {summary.mangelfull && <Notice variant="error">Kontroller avlesningene i valgt periode.</Notice>}
      <Card className="print-surface grid gap-5 p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-3">
        <Info label="Festival" value={labels.festival} /><Info label="Arrangør" value={labels.arrangor} /><Info label="Arrangement" value={labels.arrangement} />
        <Info label="Periode" value={`${formatDate(filter.fra)} – ${formatDate(filter.til)}`} /><Info label="Antall avlesninger" value={summary.antall.toString()} /><Info label="Første avlesning" value={summary.forsteAvlesning} /><Info label="Siste avlesning" value={summary.sisteAvlesning} />
      </Card>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p><p className="mt-1.5 text-base font-medium">{value}</p></div>;
}
