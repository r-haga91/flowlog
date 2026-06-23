import { z } from "zod";

export const readingSchema = z.object({
  festivalId: z.coerce.number().int().positive("Velg festival"),
  arrangorId: z.coerce.number().int().positive("Velg arrangør"),
  arrangementId: z.coerce.number().int().positive("Velg arrangement"),
  dato: z.string().min(1, "Velg dato"),
  klokkeslett: z.string().min(1, "Velg tid"),
  malerstand: z.preprocess(
    (value) => value === "" || value === undefined ? undefined : Number(value),
    z.number({ required_error: "Skriv inn målerstand", invalid_type_error: "Skriv inn målerstand" }).positive("Målerstand må være større enn 0"),
  ),
  kommentar: z.string().trim().max(500, "Kommentaren kan ikke være lengre enn 500 tegn.").optional(),
});

export type ReadingInput = z.infer<typeof readingSchema>;

export const quickReadingSchema = readingSchema.pick({ malerstand: true, kommentar: true });
export type QuickReadingInput = z.infer<typeof quickReadingSchema>;

export type LatestReading = {
  dato: string;
  klokkeslett: string;
  festival: string;
  arrangement: string;
  malerstand: number;
  kommentar: string | null;
};

export type ManagedReading = ReadingInput & {
  id: number;
  festival: string;
  arrangor: string;
  arrangement: string;
  rollover: boolean;
};
