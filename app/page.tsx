import { ActionCard } from "@/components/features/action-card";
import { HomeOverview } from "@/components/home/home-overview";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { getHomeData } from "@/repositories/home-repository";
import { navigationItems } from "@/services/navigation-service";
import { requireProfile } from "@/lib/auth";
import { canAccessPath } from "@/services/access-service";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await requireProfile();
  const data = await getHomeData();
  const homeActions = [navigationItems[1], navigationItems[0], ...navigationItems.slice(2)].filter((item) => canAccessPath(session.profile.role, item.href));
  return (
    <>
      <PageHeader eyebrow="FlowLog" title="Dokumentasjon av måleravlesninger" description="Registrer, følg og dokumenter festivalsalg i én samlet arbeidsflate." />
      <Section title="Status" description="Et raskt overblikk over registreringene.">
        <HomeOverview latest={data.siste} count={data.antallAvlesninger} options={data.options} role={session.profile.role} />
      </Section>
      <Section title="FlowLog" description="Velg arbeidsområde.">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {homeActions.map((item, index) => <ActionCard key={item.href} item={item} index={index} featured={index === 0} />)}
        </div>
      </Section>
    </>
  );
}
