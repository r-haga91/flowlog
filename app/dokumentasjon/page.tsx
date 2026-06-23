import { FileSearch } from "lucide-react";
import { DocumentationFilter } from "@/components/documentation/documentation-filter";
import { DocumentationReport } from "@/components/documentation/documentation-report";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { getDocumentationOptions, getDocumentationReadings } from "@/repositories/documentation-repository";
import { summarizeByArrangement, summarizeReadings } from "@/services/documentation-service";
import { documentationFilterSchema, type DocumentationLabels } from "@/types/documentation";
import { requireProfile } from "@/lib/auth";

export const metadata = { title: "Dokumentasjon" };
export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  await requireProfile();
  const params = await searchParams;
  const today = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Oslo" }).format(new Date());
  const defaults = { festivalId: "alle", arrangorId: "alle", arrangementId: "alle", fra: `${today.slice(0, 8)}01`, til: today };
  const input = Object.fromEntries(Object.keys(defaults).map((key) => [key, single(params[key]) ?? defaults[key as keyof typeof defaults]]));
  const parsed = documentationFilterSchema.safeParse(input);
  const filter = parsed.success ? parsed.data : documentationFilterSchema.parse(defaults);
  const [options, readings] = await Promise.all([getDocumentationOptions(), getDocumentationReadings(filter)]);
  const summary = summarizeReadings(readings, filter.arrangementId === null);
  const labels: DocumentationLabels = {
    festival: optionName(options.festivaler, filter.festivalId, "Alle festivaler"),
    arrangor: optionName(options.arrangorer, filter.arrangorId, "Alle arrangører"),
    arrangement: optionName(options.arrangementer, filter.arrangementId, "Alle arrangementer"),
  };

  return (
    <>
      <PageHeader eyebrow="Salgsgrunnlag" title="Dokumentasjon" description="Dokumenter solgt mengde fra første og siste avlesning i valgt periode." />
      <Section className="space-y-8">
        <DocumentationFilter {...options} filter={filter} />
        {summary ? <DocumentationReport filter={filter} labels={labels} readings={readings} summary={summary} arrangements={summarizeByArrangement(readings)} /> : <EmptyState icon={FileSearch} title="Ingen avlesninger funnet for valgt periode." description="Juster filtrene eller velg en annen datoperiode." />}
      </Section>
    </>
  );
}

function single(value: string | string[] | undefined) { return Array.isArray(value) ? value[0] : value; }
function optionName(options: Array<{ id: number; navn: string }>, id: number | null, fallback: string) { return options.find((item) => item.id === id)?.navn ?? fallback; }
