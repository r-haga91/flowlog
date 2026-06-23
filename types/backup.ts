import { z } from "zod";
import type { LiveAssignment } from "@/types/live-festival";
import type { RegistrationPreferences } from "@/utils/registration-preferences";
import type { Favorites } from "@/types/favorites";
import type { ThemeMode } from "@/components/providers/theme-provider";

const name = z.string().trim().min(1).max(100);
const legacyAppName = ["Festival", "Log"].join("");
const appName = z.string().refine((value) => value === "FlowLog" || value === legacyAppName);
const namedAssignment = z.object({ festival: name, arrangor: name, arrangement: name });
const reading = namedAssignment.extend({
  dato: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  klokkeslett: z.string().regex(/^\d{2}:\d{2}$/),
  malerstand: z.number().finite().positive(),
  kommentar: z.string().max(500).nullable(),
  opprettetDato: z.string().datetime(),
});

export const backupSettingsSchema = z.object({
  registreringsvalg: namedAssignment.nullable().optional(),
  liveOppdrag: namedAssignment.extend({ dato: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), paused: z.boolean() }).nullable().optional(),
  tema: z.enum(["dark", "light", "system"]).optional(),
  favoritter: z.object({ festivaler: z.array(name), arrangementer: z.array(z.object({ festival: name, arrangement: name })) }).optional(),
});

export const backupSchema = z.object({
  metadata: z.object({ appNavn: appName, versjon: z.string().min(1), eksportertDato: z.string().datetime(), antallAvlesninger: z.number().int().nonnegative() }),
  festivaler: z.array(z.object({ navn: name })),
  arrangorer: z.array(z.object({ navn: name })),
  arrangementer: z.array(z.object({ navn: name, festival: name })),
  avlesninger: z.array(reading),
  innstillinger: backupSettingsSchema,
}).superRefine((backup, context) => {
  if (backup.metadata.antallAvlesninger !== backup.avlesninger.length) context.addIssue({ code: "custom", path: ["metadata", "antallAvlesninger"], message: "Antall avlesninger stemmer ikke med innholdet." });
  const festivals = new Set(backup.festivaler.map((item) => item.navn));
  const arrangors = new Set(backup.arrangorer.map((item) => item.navn));
  const arrangements = new Set(backup.arrangementer.map((item) => `${item.festival}\u0000${item.navn}`));
  for (const item of backup.arrangementer) if (!festivals.has(item.festival)) context.addIssue({ code: "custom", path: ["arrangementer"], message: "Et arrangement mangler tilhørende festival." });
  for (const item of backup.avlesninger) if (!festivals.has(item.festival) || !arrangors.has(item.arrangor) || !arrangements.has(`${item.festival}\u0000${item.arrangement}`)) context.addIssue({ code: "custom", path: ["avlesninger"], message: "En avlesning har ugyldige koblinger." });
});

export type BackupFile = z.infer<typeof backupSchema>;
export type BackupSettings = z.infer<typeof backupSettingsSchema>;
export type BackupStatus = { festivaler: number; arrangorer: number; arrangementer: number; avlesninger: number };
export type ExportPayload = { backup: BackupFile; filnavn: string };
export type RestoredLocalSettings = { registreringsvalg?: RegistrationPreferences; liveOppdrag?: LiveAssignment; tema?: ThemeMode; favoritter?: Favorites };
export type ImportSummary = { festivaler: number; arrangorer: number; arrangementer: number; avlesninger: number; hoppetOver: number; lokaleInnstillinger: RestoredLocalSettings };
export type BackupActionResult<T> = { success: true; data: T; message: string } | { success: false; message: string };
