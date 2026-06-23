import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { SettingsPanel } from "@/components/settings/settings-panel";
import { getSettingsData } from "@/repositories/settings-repository";
import { backupService } from "@/services/backup-service";
import { requireAdministrator } from "@/lib/auth";
import { listManagedUsers } from "@/services/user-service";
import { UserManagementPanel } from "@/components/settings/user-management-panel";

export const metadata = { title: "Innstillinger" };
export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await requireAdministrator();
  const [data, backupStatus, users] = await Promise.all([getSettingsData(), backupService.getStatus(), listManagedUsers()]);
  return <><PageHeader eyebrow="FlowLog" title="Innstillinger" description="Opprett festivaler, arrangører og arrangementer før registreringen begynner." /><Section><SettingsPanel {...data} backupStatus={backupStatus} /><UserManagementPanel users={users} currentUserId={session.user.id} /></Section></>;
}
