import type { DocumentationReading } from "@/types/documentation";

export type DashboardFilterInput = {
  festivalId: string;
  arrangorId: string;
  arrangementId: string;
  fra: string;
  til: string;
};

export type DashboardPoint = {
  tidspunkt: string;
  etikett: string;
  malerstand: number;
  solgt: number;
  literPerTime: number;
};

export type DashboardMetrics = {
  totaltSolgt: number;
  startmaling: number;
  sluttmaling: number;
  antallAvlesninger: number;
  gjennomsnittPerTime: number;
  hoyestePerTime: number;
  forsteAvlesning: string;
  sisteAvlesning: string;
};

export type DashboardStatus = {
  sisteRegistrering: string;
  tidSiden: string;
  overEnTime: boolean;
};

export type DashboardData = {
  metrics: DashboardMetrics;
  malerstandSerie: DashboardPoint[];
  intervallSerie: DashboardPoint[];
  kumulativSerie: DashboardPoint[];
  sisteAvlesninger: DocumentationReading[];
  status: DashboardStatus;
};

export type DashboardActionResult =
  | { success: true; data: DashboardData | null }
  | { success: false; message: string };
