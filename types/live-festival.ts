import { z } from "zod";

export const liveAssignmentSchema = z.object({
  festivalId: z.coerce.number().int().positive(),
  arrangorId: z.coerce.number().int().positive(),
  arrangementId: z.coerce.number().int().positive(),
  dato: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  paused: z.boolean().default(false),
});

export type LiveAssignment = z.infer<typeof liveAssignmentSchema>;

export type LiveReading = {
  id: number;
  klokkeslett: string;
  malerstand: number;
  kommentar: string | null;
  rollover: boolean;
};

export type LiveSnapshot = {
  sisteMalerstand: number | null;
  sisteTidspunkt: string | null;
  sisteTid: string | null;
  antall: number;
  totaltSolgt: number;
  endring: number | null;
  rollover: boolean;
  readings: LiveReading[];
};

export type LiveActionResult =
  | { success: true; message: string; snapshot: LiveSnapshot }
  | { success: false; message: string; fieldErrors?: Record<string, string[]>; requiresForce?: boolean; previousMalerstand?: number };
