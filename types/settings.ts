import { z } from "zod";

export const nameSchema = z.object({
  navn: z.string().trim().min(2, "Navnet må inneholde minst 2 tegn.").max(100, "Navnet kan ikke være lengre enn 100 tegn."),
});

export const arrangementSchema = nameSchema.extend({
  festivalId: z.coerce.number({ invalid_type_error: "Velg en festival." }).int().positive("Velg en festival."),
});

export type NameInput = z.infer<typeof nameSchema>;
export type ArrangementInput = z.infer<typeof arrangementSchema>;
