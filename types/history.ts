import { z } from "zod";

const optionalId = z.union([z.literal("alle"), z.coerce.number().int().positive()]).transform((value) => value === "alle" ? null : value);
const optionalDate = z.string().transform((value) => value || null).refine((value) => value === null || /^\d{4}-\d{2}-\d{2}$/.test(value), "Ugyldig dato");

export const historyFilterSchema = z.object({
  festivalId: optionalId,
  arrangorId: optionalId,
  arrangementId: optionalId,
  year: z.union([z.literal("alle"), z.coerce.number().int().min(2000).max(2100)]).transform((value) => value === "alle" ? null : value),
  fra: optionalDate,
  til: optionalDate,
}).refine((value) => !value.fra || !value.til || value.fra <= value.til, { message: "Fra dato må være før til dato", path: ["til"] });

export type HistoryFilter = z.infer<typeof historyFilterSchema>;
export type HistoryFilterInput = { festivalId: string; arrangorId: string; arrangementId: string; year: string; fra: string; til: string };

export type HistoryReading = {
  id: number; festivalId: number; arrangorId: number; arrangementId: number;
  festival: string; arrangor: string; arrangement: string;
  dato: string; klokkeslett: string; malerstand: number; opprettetDato?: string;
};

export type HistorySummary = { id: string; label: string; totaltSolgt: number; antall: number };
export type HistoryDevelopmentPoint = { dato: string; etikett: string; totaltSolgt: number };
export type HistoryPeriod = { id: string; label: string; detail: string; verdi: number };

export type HistoryData = {
  metrics: {
    totaltSolgt: number; antallFestivaler: number; antallArrangementer: number; antallAvlesninger: number;
    besteFestival: string; besteArrangement: string; besteAr: string;
  };
  festivaler: HistorySummary[];
  arrangementer: HistorySummary[];
  ar: HistorySummary[];
  toppFestivaler: HistorySummary[];
  toppArrangementer: HistorySummary[];
  utvikling: HistoryDevelopmentPoint[];
  toppDager: HistoryPeriod[];
  toppPerioder: HistoryPeriod[];
};

export type HistoryComparison = { a: HistorySummary; b: HistorySummary; liter: number; prosent: number | null };
export type HistoryActionResult = { success: true; data: HistoryData | null } | { success: false; message: string };
