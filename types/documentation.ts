import { z } from "zod";

const optionalId = z.string().optional()
  .transform((value) => value && value !== "alle" ? Number(value) : null)
  .refine((value) => value === null || Number.isInteger(value) && value > 0, "Ugyldig valg");

export const documentationFilterSchema = z.object({
  festivalId: optionalId,
  arrangorId: optionalId,
  arrangementId: optionalId,
  fra: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  til: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
}).refine((filter) => filter.fra <= filter.til, { message: "Fra dato må være før til dato", path: ["til"] });

export type DocumentationFilter = z.infer<typeof documentationFilterSchema>;

export type DocumentationReading = {
  id: number;
  dato: string;
  klokkeslett: string;
  festival: string;
  arrangor: string;
  arrangement: string;
  arrangementId: number;
  opprettetDato?: string;
  malerstand: number;
  kommentar: string | null;
};

export type ReadingSummary = {
  startmaling: number;
  sluttmaling: number;
  totaltSolgt: number;
  antall: number;
  forsteAvlesning: string;
  sisteAvlesning: string;
  rollover: boolean;
  mangelfull: boolean;
};

export type ArrangementSummary = ReadingSummary & { arrangementId: number; arrangement: string };

export type DocumentationLabels = {
  festival: string;
  arrangor: string;
  arrangement: string;
};
