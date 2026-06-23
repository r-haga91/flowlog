"use client";

import { CalendarDays, Flag, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { addArrangor, addFestival } from "@/app/actions/settings-actions";
import { useToast } from "@/components/providers/toast-provider";
import { CreateArrangementDialog } from "@/components/settings/create-arrangement-dialog";
import { BackupPanel } from "@/components/settings/backup-panel";
import { CreateNameDialog } from "@/components/settings/create-name-dialog";
import { SettingsCard } from "@/components/settings/settings-card";
import { SettingItem } from "@/components/settings/setting-item";
import { ThemeSettings } from "@/components/settings/theme-settings";
import { useFavorites } from "@/hooks/use-favorites";
import type { SelectOption } from "@/types/common";
import type { BackupStatus } from "@/types/backup";

type Props = {
  festivaler: SelectOption[];
  arrangorer: SelectOption[];
  arrangementer: Array<SelectOption & { festivalId: number; festival: { navn: string } }>;
  backupStatus: BackupStatus;
};

export function SettingsPanel({ festivaler, arrangorer, arrangementer, backupStatus }: Props) {
  const router = useRouter();
  const { favorites, toggle } = useFavorites();
  const { toast } = useToast();
  function changed(nextMessage: string) { toast(nextMessage); router.refresh(); }
  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-3">
        <SettingsCard title="Festivaler" description="Festivaler som skal dokumenteres." icon={Flag} hasItems={!!festivaler.length} items={festivaler.map((item) => <SettingItem key={item.id} {...item} kind="festival" favorite={favorites.festivaler.includes(item.id)} onFavorite={() => toggle("festivaler", item.id)} onChanged={changed} />)} emptyText="Ingen festivaler opprettet." action={<CreateNameDialog label="Festival" description="Gi festivalen et tydelig navn." action={addFestival} onCreated={changed} />} />
        <SettingsCard title="Arrangører" description="Virksomheter som står for salget." icon={Users} hasItems={!!arrangorer.length} items={arrangorer.map((item) => <SettingItem key={item.id} {...item} kind="arrangor" onChanged={changed} />)} emptyText="Ingen arrangører opprettet." action={<CreateNameDialog label="Arrangør" description="Registrer navnet på arrangøren." action={addArrangor} onCreated={changed} />} />
        <SettingsCard title="Arrangementer" description="Salgsområder knyttet til en festival." icon={CalendarDays} hasItems={!!arrangementer.length} items={arrangementer.map((item) => <SettingItem key={item.id} id={item.id} navn={item.navn} kind="arrangement" detail={item.festival.navn} festivalId={item.festivalId} festivaler={festivaler} favorite={favorites.arrangementer.includes(item.id)} onFavorite={() => toggle("arrangementer", item.id)} onChanged={changed} />)} emptyText="Ingen arrangementer opprettet." action={<CreateArrangementDialog festivaler={festivaler} onCreated={changed} />} />
      </div>
      {!festivaler.length && <p className="text-sm text-muted-foreground">Opprett en festival før du oppretter et arrangement.</p>}
      <section className="pt-8"><ThemeSettings /></section>
      <section className="pt-8"><div className="mb-6"><h2 className="text-xl font-semibold">Backup og data</h2><p className="mt-1 text-sm text-muted-foreground">Ta vare på data lokalt eller importer en tidligere FlowLog-backup.</p></div><BackupPanel status={backupStatus} options={{ festivaler, arrangorer, arrangementer }} /></section>
    </div>
  );
}
