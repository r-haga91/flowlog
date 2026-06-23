import { DashboardView } from "@/components/dashboard/dashboard-view";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { getDocumentationOptions } from "@/repositories/documentation-repository";
import { requireProfile } from "@/lib/auth";

export const metadata = { title: "Analyse" };
export const dynamic = "force-dynamic";

export default async function Page() {
  await requireProfile();
  const options = await getDocumentationOptions();
  const today = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Oslo" }).format(new Date());
  const initialFilter = {
    festivalId: "alle",
    arrangorId: "alle",
    arrangementId: "alle",
    fra: `${today.slice(0, 8)}01`,
    til: today,
  };

  return (
    <>
      <PageHeader eyebrow="Analyse" title="Dashboard" description="Følg salget og aktiviteten for ett arrangement i valgt periode." />
      <Section className="space-y-8">
        <DashboardView options={options} initialFilter={initialFilter} />
      </Section>
    </>
  );
}
