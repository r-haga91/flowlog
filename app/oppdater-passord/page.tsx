import { UpdatePasswordForm } from "@/components/auth/update-password-form";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { requireProfile } from "@/lib/auth";

export const metadata = { title: "Endre passord" };

export default async function Page() {
  await requireProfile();
  return <><PageHeader eyebrow="Sikkerhet" title="Endre passord" description="Velg et nytt passord med minst åtte tegn." /><Section className="max-w-lg"><UpdatePasswordForm /></Section></>;
}
