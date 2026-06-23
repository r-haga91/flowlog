import { BarChart3, FileText, History, Radio, Settings, SquarePen } from "lucide-react";
import type { NavigationItem } from "@/types/navigation";

export const navigationItems: NavigationItem[] = [
  { label: "Registrer avlesning", description: "Dokumenter en ny avlesning", href: "/registrering", icon: SquarePen },
  { label: "Live Festival", description: "Registrer raskt på et aktivt oppdrag", href: "/live-festival", icon: Radio },
  { label: "Dokumentasjon", description: "Samle og organiser grunnlaget", href: "/dokumentasjon", icon: FileText },
  { label: "Analyse", description: "Utforsk innsikten når den er klar", href: "/analyse", icon: BarChart3 },
  { label: "Historikk", description: "Finn tidligere festivaler og hendelser", href: "/historikk", icon: History },
  { label: "Innstillinger", description: "Tilpass FlowLog til arbeidet ditt", href: "/innstillinger", icon: Settings },
];
