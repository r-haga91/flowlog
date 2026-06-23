import { LiveFestivalView } from "@/components/live-festival/live-festival-view";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { getDocumentationOptions } from "@/repositories/documentation-repository";
import { requireEditor } from "@/lib/auth";

export const metadata = { title: "Live Festival" };
export const dynamic = "force-dynamic";

export default async function Page() {
  await requireEditor();
  const options = await getDocumentationOptions();
  return (
    <>
      <PageHeader eyebrow="Feltmodus" title="Live Festival" description="Rask registrering for et aktivt oppdrag." />
      <Section><LiveFestivalView options={options} /></Section>
    </>
  );
}
