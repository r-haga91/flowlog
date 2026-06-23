import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { BackupFile, ImportSummary, RestoredLocalSettings } from "@/types/backup";

export const importService = {
  async import(backup: BackupFile): Promise<ImportSummary> {
    return prisma.$transaction(async (tx) => {
      const festivals = new Map((await tx.festival.findMany()).map((item) => [item.navn, item.id]));
      const arrangors = new Map((await tx.arrangor.findMany()).map((item) => [item.navn, item.id]));
      const arrangements = new Map<string, number>();
      const counts = { festivaler: 0, arrangorer: 0, arrangementer: 0, avlesninger: 0, hoppetOver: 0 };

      for (const item of backup.festivaler) if (!festivals.has(item.navn)) {
        const created = await tx.festival.create({ data: { navn: item.navn } });
        festivals.set(item.navn, created.id); counts.festivaler++;
      }
      for (const item of backup.arrangorer) if (!arrangors.has(item.navn)) {
        const created = await tx.arrangor.create({ data: { navn: item.navn } });
        arrangors.set(item.navn, created.id); counts.arrangorer++;
      }

      const existingArrangements = await tx.arrangement.findMany({ include: { festival: true } });
      for (const item of existingArrangements) arrangements.set(key(item.festival.navn, item.navn), item.id);
      for (const item of backup.arrangementer) {
        const arrangementKey = key(item.festival, item.navn);
        if (arrangements.has(arrangementKey)) continue;
        const festivalId = festivals.get(item.festival)!;
        const created = await tx.arrangement.create({ data: { navn: item.navn, festivalId } });
        arrangements.set(arrangementKey, created.id); counts.arrangementer++;
      }

      const existingReadings = await tx.avlesning.findMany();
      const signatures = new Set(existingReadings.map((item) => signature({
        festivalId: item.festivalId, arrangorId: item.arrangorId, arrangementId: item.arrangementId,
        dato: item.dato.toLocaleDateString("sv-SE", { timeZone: "Europe/Oslo" }), klokkeslett: item.klokkeslett,
        malerstand: item.malerstand, kommentar: item.kommentar,
      })));
      const readings: Prisma.AvlesningCreateManyInput[] = [];
      for (const item of backup.avlesninger) {
        const data = {
          festivalId: festivals.get(item.festival)!, arrangorId: arrangors.get(item.arrangor)!,
          arrangementId: arrangements.get(key(item.festival, item.arrangement))!,
          dato: new Date(`${item.dato}T00:00:00`), klokkeslett: item.klokkeslett,
          malerstand: item.malerstand, kommentar: item.kommentar?.trim() || null, opprettetDato: new Date(item.opprettetDato),
        };
        const readingSignature = signature({ ...data, dato: item.dato });
        if (signatures.has(readingSignature)) { counts.hoppetOver++; continue; }
        signatures.add(readingSignature); readings.push(data);
      }
      if (readings.length) await tx.avlesning.createMany({ data: readings });
      counts.avlesninger = readings.length;
      return { ...counts, lokaleInnstillinger: restoreSettings(backup, festivals, arrangors, arrangements) };
    });
  },
};

type SignatureInput = { festivalId: number; arrangorId: number; arrangementId: number; dato: string; klokkeslett: string; malerstand: number; kommentar: string | null };
function key(festival: string, arrangement: string) { return `${festival}\u0000${arrangement}`; }
function signature(item: SignatureInput) { return JSON.stringify([item.festivalId, item.arrangorId, item.arrangementId, item.dato, item.klokkeslett, item.malerstand, item.kommentar?.trim() || null]); }

function restoreSettings(backup: BackupFile, festivals: Map<string, number>, arrangors: Map<string, number>, arrangements: Map<string, number>): RestoredLocalSettings {
  const restored: RestoredLocalSettings = {};
  const registration = backup.innstillinger.registreringsvalg;
  if (registration) {
    const festivalId = festivals.get(registration.festival); const arrangorId = arrangors.get(registration.arrangor); const arrangementId = arrangements.get(key(registration.festival, registration.arrangement));
    if (festivalId && arrangorId && arrangementId) restored.registreringsvalg = { festivalId, arrangorId, arrangementId };
  }
  const live = backup.innstillinger.liveOppdrag;
  if (live) {
    const festivalId = festivals.get(live.festival); const arrangorId = arrangors.get(live.arrangor); const arrangementId = arrangements.get(key(live.festival, live.arrangement));
    if (festivalId && arrangorId && arrangementId) restored.liveOppdrag = { festivalId, arrangorId, arrangementId, dato: live.dato, paused: live.paused };
  }
  restored.tema = backup.innstillinger.tema;
  const favoriteSettings = backup.innstillinger.favoritter;
  if (favoriteSettings) restored.favoritter = {
    festivaler: favoriteSettings.festivaler.map((name) => festivals.get(name)).filter((id): id is number => Boolean(id)),
    arrangementer: favoriteSettings.arrangementer.map((item) => arrangements.get(key(item.festival, item.arrangement))).filter((id): id is number => Boolean(id)),
  };
  return restored;
}
