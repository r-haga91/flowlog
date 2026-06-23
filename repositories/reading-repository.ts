import { prisma } from "@/lib/prisma";
import { calculateConsumption } from "@/services/consumption-service";
import type { ReadingInput } from "@/types/reading";

export async function getRegistrationData() {
  const [festivaler, arrangorer, arrangementer, readings, calculationReadings] = await Promise.all([
    prisma.festival.findMany({ select: { id: true, navn: true }, orderBy: { navn: "asc" } }),
    prisma.arrangor.findMany({ select: { id: true, navn: true }, orderBy: { navn: "asc" } }),
    prisma.arrangement.findMany({ select: { id: true, navn: true, festivalId: true }, orderBy: { navn: "asc" } }),
    prisma.avlesning.findMany({
      take: 20,
      include: { festival: true, arrangor: true, arrangement: true },
      orderBy: { opprettetDato: "desc" },
    }),
    prisma.avlesning.findMany({
      select: { id: true, festivalId: true, arrangementId: true, dato: true, klokkeslett: true, malerstand: true, opprettetDato: true },
      orderBy: [{ dato: "asc" }, { klokkeslett: "asc" }, { opprettetDato: "asc" }],
    }),
  ]);

  const rolloverIds = findRolloverIds(calculationReadings.map((reading) => ({
    ...reading,
    dato: reading.dato.toLocaleDateString("sv-SE", { timeZone: "Europe/Oslo" }),
    opprettetDato: reading.opprettetDato.toISOString(),
  })));

  const serializedReadings = readings.map((reading) => ({
    id: reading.id,
    festivalId: reading.festivalId,
    arrangorId: reading.arrangorId,
    arrangementId: reading.arrangementId,
    dato: reading.dato.toLocaleDateString("sv-SE", { timeZone: "Europe/Oslo" }),
    klokkeslett: reading.klokkeslett,
    malerstand: reading.malerstand,
    kommentar: reading.kommentar ?? "",
    festival: reading.festival.navn,
    arrangor: reading.arrangor.navn,
    arrangement: reading.arrangement.navn,
    rollover: rolloverIds.has(reading.id),
  }));
  const latest = serializedReadings[0];

  return {
    festivaler,
    arrangorer,
    arrangementer,
    latest: latest ? {
      dato: latest.dato,
      klokkeslett: latest.klokkeslett,
      festival: latest.festival,
      arrangement: latest.arrangement,
      malerstand: latest.malerstand,
      kommentar: latest.kommentar || null,
    } : null,
    readings: serializedReadings,
  };
}

function findRolloverIds(readings: Array<{ id: number; festivalId: number; arrangementId: number; dato: string; klokkeslett: string; malerstand: number; opprettetDato: string }>) {
  const groups = new Map<string, typeof readings>();
  for (const reading of readings) {
    const key = `${reading.festivalId}:${reading.arrangementId}`;
    groups.set(key, [...(groups.get(key) ?? []), reading]);
  }
  const ids = new Set<number>();
  for (const items of groups.values()) {
    for (const interval of calculateConsumption(items).intervals) if (interval.rollover) ids.add(interval.current.id);
  }
  return ids;
}

export async function updateReading(id: number, input: ReadingInput) {
  const arrangement = await prisma.arrangement.findFirst({ where: { id: input.arrangementId, festivalId: input.festivalId } });
  if (!arrangement) throw new Error("Arrangementet tilhører ikke valgt festival.");
  return prisma.avlesning.update({
    where: { id },
    data: {
      festivalId: input.festivalId,
      arrangorId: input.arrangorId,
      arrangementId: input.arrangementId,
      dato: new Date(`${input.dato}T00:00:00`),
      klokkeslett: input.klokkeslett,
      malerstand: input.malerstand,
      kommentar: input.kommentar || null,
    },
  });
}

export function deleteReading(id: number) {
  return prisma.avlesning.delete({ where: { id } });
}

export async function createReading(input: ReadingInput) {
  const arrangement = await prisma.arrangement.findFirst({
    where: { id: input.arrangementId, festivalId: input.festivalId },
    select: { id: true },
  });

  if (!arrangement) throw new Error("Arrangementet tilhører ikke valgt festival.");

  return prisma.avlesning.create({
    data: {
      festivalId: input.festivalId,
      arrangorId: input.arrangorId,
      arrangementId: input.arrangementId,
      dato: new Date(`${input.dato}T00:00:00`),
      klokkeslett: input.klokkeslett,
      malerstand: input.malerstand,
      kommentar: input.kommentar || null,
    },
  });
}

export async function getPreviousReading(input: ReadingInput, excludeId?: number) {
  return prisma.avlesning.findFirst({
    where: {
      festivalId: input.festivalId,
      arrangementId: input.arrangementId,
      id: excludeId ? { not: excludeId } : undefined,
      OR: [
        { dato: { lt: new Date(`${input.dato}T00:00:00`) } },
        { dato: new Date(`${input.dato}T00:00:00`), klokkeslett: { lte: input.klokkeslett } },
      ],
    },
    select: { malerstand: true },
    orderBy: [{ dato: "desc" }, { klokkeslett: "desc" }, { opprettetDato: "desc" }],
  });
}

export function getLatestReading(festivalId: number, arrangementId: number) {
  return prisma.avlesning.findFirst({
    where: { festivalId, arrangementId },
    select: { malerstand: true },
    orderBy: [{ dato: "desc" }, { klokkeslett: "desc" }, { opprettetDato: "desc" }],
  });
}
