import { RegistrationForm } from "@/components/registration/registration-form";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { getRegistrationData } from "@/repositories/reading-repository";
import { requireEditor } from "@/lib/auth";

export const metadata = { title: "Registrer avlesning" };
export const dynamic = "force-dynamic";

export default async function Page() {
  await requireEditor();
  const data = await getRegistrationData();
  return <><PageHeader eyebrow="Ny avlesning" title="Registrer avlesning" description="Fyll inn målerstanden og lagre – klart for neste avlesning på få sekunder." /><Section><RegistrationForm {...data} /></Section></>;
}
