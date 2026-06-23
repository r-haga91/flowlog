import { HistoryView } from "@/components/history/history-view";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { getHistoryOptions } from "@/repositories/history-repository";
import { requireProfile } from "@/lib/auth";

export const metadata = { title: "Historikk" };
export const dynamic = "force-dynamic";

export default async function Page() {
  await requireProfile();
  const options = await getHistoryOptions();
  return <><PageHeader eyebrow="Sesonginnsikt" title="Historikk" description="Sammenlign festivaler, arrangementer og salg over tid." /><Section><HistoryView options={options} /></Section></>;
}
