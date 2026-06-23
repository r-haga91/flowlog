import { ArrangementSummaries } from "@/components/documentation/arrangement-summaries";
import { DocumentationReadings } from "@/components/documentation/documentation-readings";
import { DocumentationSummary } from "@/components/documentation/documentation-summary";
import { ReportActions } from "@/components/documentation/report-actions";
import type { ArrangementSummary, DocumentationFilter, DocumentationLabels, DocumentationReading, ReadingSummary } from "@/types/documentation";

type Props = { filter: DocumentationFilter; labels: DocumentationLabels; readings: DocumentationReading[]; summary: ReadingSummary; arrangements: ArrangementSummary[] };

export function DocumentationReport({ filter, labels, readings, summary, arrangements }: Props) {
  return (
    <div className="print-report space-y-8">
      <ReportActions filter={filter} labels={labels} summary={summary} />
      <DocumentationSummary filter={filter} labels={labels} summary={summary} />
      {!filter.arrangementId && arrangements.length > 0 && <ArrangementSummaries summaries={arrangements} />}
      <DocumentationReadings readings={readings} />
    </div>
  );
}
