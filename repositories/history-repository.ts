import { prisma } from "@/lib/prisma";
import { getDocumentationOptions } from "@/repositories/documentation-repository";
import type { HistoryFilter } from "@/types/history";

export async function getHistoryOptions() {
  const [options, dates] = await Promise.all([
    getDocumentationOptions(),
    prisma.avlesning.findMany({ select: { dato: true }, orderBy: { dato: "desc" } }),
  ]);
  const years = Array.from(new Set(dates.map((item) => item.dato.getFullYear()))).sort((a, b) => b - a);
  return { ...options, years };
}

export async function getHistoryReadings(filter: HistoryFilter) {
  const dateFilters = buildDateFilters(filter);
  const readings = await prisma.avlesning.findMany({
    where: {
      festivalId: filter.festivalId ?? undefined,
      arrangorId: filter.arrangorId ?? undefined,
      arrangementId: filter.arrangementId ?? undefined,
      AND: dateFilters,
    },
    include: { festival: true, arrangor: true, arrangement: true },
    orderBy: [{ dato: "asc" }, { klokkeslett: "asc" }, { opprettetDato: "asc" }],
  });
  return readings.map((reading) => ({
    id: reading.id,
    festivalId: reading.festivalId,
    arrangorId: reading.arrangorId,
    arrangementId: reading.arrangementId,
    festival: reading.festival.navn,
    arrangor: reading.arrangor.navn,
    arrangement: reading.arrangement.navn,
    dato: reading.dato.toLocaleDateString("sv-SE", { timeZone: "Europe/Oslo" }),
    klokkeslett: reading.klokkeslett,
    malerstand: reading.malerstand,
    opprettetDato: reading.opprettetDato.toISOString(),
  }));
}

function buildDateFilters(filter: HistoryFilter) {
  const filters: Array<{ dato: { gte?: Date; lte?: Date } }> = [];
  if (filter.year) filters.push({ dato: { gte: new Date(`${filter.year}-01-01T00:00:00`), lte: new Date(`${filter.year}-12-31T23:59:59.999`) } });
  if (filter.fra) filters.push({ dato: { gte: new Date(`${filter.fra}T00:00:00`) } });
  if (filter.til) filters.push({ dato: { lte: new Date(`${filter.til}T23:59:59.999`) } });
  return filters;
}
