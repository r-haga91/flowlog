import { CalendarDays, Code2, Scale, Tag } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { StatCard } from "@/components/ui/stat-card";
import { requireProfile } from "@/lib/auth";

export const metadata = { title: "Om FlowLog" };

export default async function AboutPage() {
  await requireProfile();
  const buildDate = new Date().toLocaleDateString("nb-NO", { timeZone: "Europe/Oslo", day: "2-digit", month: "long", year: "numeric" });
  return <><PageHeader eyebrow="Appinformasjon" title="Om FlowLog" description="Et fokusert arbeidsverktøy for dokumentasjon av måleravlesninger og festivalsalg." /><Section><div className="grid gap-4 sm:grid-cols-2"><StatCard label="Versjon" value="FlowLog v1.0.1" icon={Tag} /><StatCard label="Bygget dato" value={buildDate} icon={CalendarDays} /><StatCard label="Utvikler" value="Robin Haga" icon={Code2} /><StatCard label="Lisens" value="Proprietær" icon={Scale} /></div></Section></>;
}
