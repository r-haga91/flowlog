import { prisma } from "@/lib/prisma";
import type { DocumentationFilter } from "@/types/documentation";

export async function getDocumentationOptions() {
  const [festivaler, arrangorer, arrangementer] = await Promise.all([
    prisma.festival.findMany({ select: { id: true, navn: true }, orderBy: { navn: "asc" } }),
    prisma.arrangor.findMany({ select: { id: true, navn: true }, orderBy: { navn: "asc" } }),
    prisma.arrangement.findMany({ select: { id: true, navn: true, festivalId: true }, orderBy: { navn: "asc" } }),
  ]);
  return { festivaler, arrangorer, arrangementer };
}

export async function getDocumentationReadings(filter: DocumentationFilter) {
  const readings = await prisma.avlesning.findMany({
    where: {
      festivalId: filter.festivalId ?? undefined,
      arrangorId: filter.arrangorId ?? undefined,
      arrangementId: filter.arrangementId ?? undefined,
      dato: { gte: new Date(`${filter.fra}T00:00:00`), lte: new Date(`${filter.til}T23:59:59.999`) },
    },
    include: { festival: true, arrangor: true, arrangement: true },
    orderBy: [{ dato: "asc" }, { klokkeslett: "asc" }, { opprettetDato: "asc" }],
  });

  return readings.map((reading) => ({
    id: reading.id,
    dato: reading.dato.toLocaleDateString("sv-SE", { timeZone: "Europe/Oslo" }),
    klokkeslett: reading.klokkeslett,
    festival: reading.festival.navn,
    arrangor: reading.arrangor.navn,
    arrangement: reading.arrangement.navn,
    arrangementId: reading.arrangementId,
    opprettetDato: reading.opprettetDato.toISOString(),
    malerstand: reading.malerstand,
    kommentar: reading.kommentar,
  }));
}
