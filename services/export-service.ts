import { prisma } from "@/lib/prisma";
import { backupSettingsSchema, type BackupFile } from "@/types/backup";

const appVersion = "1.0.1";

export const exportService = {
  async create(settingsInput: unknown): Promise<BackupFile> {
    const settings = backupSettingsSchema.parse(settingsInput);
    const [festivaler, arrangorer, arrangementer, avlesninger] = await Promise.all([
      prisma.festival.findMany({ select: { navn: true }, orderBy: { navn: "asc" } }),
      prisma.arrangor.findMany({ select: { navn: true }, orderBy: { navn: "asc" } }),
      prisma.arrangement.findMany({ include: { festival: true }, orderBy: [{ festival: { navn: "asc" } }, { navn: "asc" }] }),
      prisma.avlesning.findMany({ include: { festival: true, arrangor: true, arrangement: true }, orderBy: [{ dato: "asc" }, { klokkeslett: "asc" }, { opprettetDato: "asc" }] }),
    ]);
    return {
      metadata: { appNavn: "FlowLog", versjon: appVersion, eksportertDato: new Date().toISOString(), antallAvlesninger: avlesninger.length },
      festivaler,
      arrangorer,
      arrangementer: arrangementer.map((item) => ({ navn: item.navn, festival: item.festival.navn })),
      avlesninger: avlesninger.map((item) => ({
        festival: item.festival.navn,
        arrangor: item.arrangor.navn,
        arrangement: item.arrangement.navn,
        dato: item.dato.toLocaleDateString("sv-SE", { timeZone: "Europe/Oslo" }),
        klokkeslett: item.klokkeslett,
        malerstand: item.malerstand,
        kommentar: item.kommentar,
        opprettetDato: item.opprettetDato.toISOString(),
      })),
      innstillinger: settings,
    };
  },
  filename(date = new Date()) {
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString();
    return `FlowLog_backup_${local.slice(0, 10)}_${local.slice(11, 16).replace(":", "-")}.json`;
  },
};
