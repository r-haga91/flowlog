import { FileText, Gauge, ListChecks } from "lucide-react";
import Link from "next/link";
import { HomeActiveAssignment } from "@/components/home/home-active-assignment";
import { Card } from "@/components/ui/card";
import { formatDashboardNumber } from "@/services/dashboard-service";
import type { SelectOption } from "@/types/common";
import { isEditor } from "@/services/access-service";
import type { UserRole } from "@/types/user";

type Latest = {
  dato: Date;
  klokkeslett: string;
  malerstand: number;
  festival: { navn: string };
  arrangor: { navn: string };
  arrangement: { navn: string };
};

type Options = { festivaler: SelectOption[]; arrangorer: SelectOption[]; arrangementer: Array<SelectOption & { festivalId: number }> };

export function HomeOverview({ latest, count, options, role }: { latest: Latest | null; count: number; options: Options; role: UserRole }) {
  const date = latest?.dato.toLocaleDateString("nb-NO", { timeZone: "Europe/Oslo" });
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {isEditor(role) && <HomeActiveAssignment options={options} />}
      <OverviewCard icon={Gauge} title="Siste registrering">
        {latest ? <><p className="text-xl font-semibold">{formatDashboardNumber(latest.malerstand)} L</p><p className="mt-1 text-sm text-muted-foreground">{date} kl. {latest.klokkeslett}</p></> : <EmptyText />}
      </OverviewCard>
      <OverviewCard icon={ListChecks} title="Antall avlesninger">
        <p className="text-3xl font-semibold tracking-tight">{formatDashboardNumber(count)}</p>
        <p className="mt-1 text-sm text-muted-foreground">registrert totalt</p>
      </OverviewCard>
      <Link href="/dokumentasjon" className="group"><OverviewCard icon={FileText} title="Dokumentasjon"><p className="font-semibold">Åpne salgsgrunnlag</p><p className="mt-1 text-sm text-muted-foreground group-hover:text-foreground">Filtrer, kopier eller skriv ut</p></OverviewCard></Link>
    </div>
  );
}

function OverviewCard({ icon: Icon, title, children }: { icon: typeof Gauge; title: string; children: React.ReactNode }) {
  return <Card className="animate-fade-up p-6 transition duration-200 hover:-translate-y-0.5 hover:border-primary/25 sm:p-7"><div className="mb-7 flex items-center gap-3 text-sm font-medium text-muted-foreground"><span className="rounded-xl bg-primary/10 p-2 text-primary"><Icon className="size-4" /></span>{title}</div>{children}</Card>;
}

function EmptyText() {
  return <p className="text-sm leading-6 text-muted-foreground">Ingen avlesninger registrert ennå.</p>;
}
