import { WifiOff } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";

export const metadata = { title: "Frakoblet" };
export default function OfflinePage() { return <><PageHeader title="Du er frakoblet" description="FlowLog får ikke kontakt med nettet akkurat nå." /><Section><EmptyState icon={WifiOff} title="Ingen nettforbindelse" description="Kontroller forbindelsen og prøv igjen når du er på nett." /></Section></>; }
