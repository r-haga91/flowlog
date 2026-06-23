import type { HistoryComparison, HistoryData, HistoryDevelopmentPoint, HistoryPeriod, HistoryReading, HistorySummary } from "@/types/history";
import { calculateConsumption, readingTimestamp } from "@/services/consumption-service";

export function buildHistoryData(readings: HistoryReading[]): HistoryData | null {
  if (!readings.length) return null;
  const ordered = calculateConsumption(readings).readings;
  const festivals = summarizeGroups(ordered, (item) => String(item.festivalId), (item) => item.festival);
  const arrangements = summarizeGroups(ordered, (item) => String(item.arrangementId), (item) => item.arrangement);
  const years = summarizeGroups(ordered, (item) => item.dato.slice(0, 4), (item) => item.dato.slice(0, 4));
  return {
    metrics: {
      totaltSolgt: sumArrangementTotals(ordered),
      antallFestivaler: festivals.length,
      antallArrangementer: arrangements.length,
      antallAvlesninger: ordered.length,
      besteFestival: bestLabel(festivals),
      besteArrangement: bestLabel(arrangements),
      besteAr: bestLabel(years),
    },
    festivaler: festivals,
    arrangementer: arrangements,
    ar: years,
    toppFestivaler: festivals.slice(0, 5),
    toppArrangementer: arrangements.slice(0, 5),
    utvikling: buildDevelopment(ordered),
    toppDager: buildTopDays(ordered),
    toppPerioder: buildTopPeriods(ordered),
  };
}

export function compareHistoryGroups(groups: HistorySummary[], aId: string, bId: string): HistoryComparison | null {
  const a = groups.find((item) => item.id === aId);
  const b = groups.find((item) => item.id === bId);
  if (!a || !b || a.id === b.id) return null;
  const liter = b.totaltSolgt - a.totaltSolgt;
  return { a, b, liter, prosent: a.totaltSolgt === 0 ? null : liter / Math.abs(a.totaltSolgt) * 100 };
}

function summarizeGroups(readings: HistoryReading[], key: (item: HistoryReading) => string, label: (item: HistoryReading) => string) {
  const groups = groupBy(readings, key);
  return Array.from(groups.entries()).map(([id, items]) => ({ id, label: label(items[0]), totaltSolgt: sumArrangementTotals(items), antall: items.length })).sort((a, b) => b.totaltSolgt - a.totaltSolgt);
}

function sumArrangementTotals(readings: HistoryReading[]) {
  return Array.from(groupBy(readings, calculationKey).values())
    .reduce((total, items) => total + calculateConsumption(items).total, 0);
}

function buildDevelopment(readings: HistoryReading[]): HistoryDevelopmentPoint[] {
  const byDate = new Map<string, number>(readings.map((reading) => [reading.dato, 0]));
  for (const items of groupBy(readings, calculationKey).values()) {
    for (const interval of calculateConsumption(items).intervals) {
      byDate.set(interval.current.dato, (byDate.get(interval.current.dato) ?? 0) + interval.consumed);
    }
  }
  let cumulative = 0;
  return Array.from(byDate.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([dato, consumed]) => {
    cumulative += consumed;
    return { dato, etikett: formatShortDate(dato), totaltSolgt: cumulative };
  });
}

function buildTopDays(readings: HistoryReading[]): HistoryPeriod[] {
  return Array.from(groupBy(readings, (item) => item.dato).entries()).map(([dato, items]) => ({ id: dato, label: formatDate(dato), detail: `${items.length} avlesninger`, verdi: sumArrangementTotals(items) })).filter((item) => item.verdi > 0).sort((a, b) => b.verdi - a.verdi).slice(0, 5);
}

function buildTopPeriods(readings: HistoryReading[]): HistoryPeriod[] {
  const periods: HistoryPeriod[] = [];
  for (const items of groupBy(readings, calculationKey).values()) {
    for (const { previous, current, consumed } of calculateConsumption(items).intervals) {
      const hours = (readingTimestamp(current) - readingTimestamp(previous)) / 3_600_000;
      const rate = hours > 0 ? consumed / hours : 0;
      if (rate > 0) periods.push({ id: `${previous.id}-${current.id}`, label: current.arrangement, detail: `${formatShortDate(previous.dato)} ${previous.klokkeslett} – ${formatShortDate(current.dato)} ${current.klokkeslett}`, verdi: rate });
    }
  }
  return periods.sort((a, b) => b.verdi - a.verdi).slice(0, 5);
}

function groupBy<T>(items: T[], key: (item: T) => string) {
  const groups = new Map<string, T[]>();
  for (const item of items) groups.set(key(item), [...(groups.get(key(item)) ?? []), item]);
  return groups;
}

function bestLabel(items: HistorySummary[]) { return items[0]?.label ?? "–"; }
function calculationKey(item: HistoryReading) { return `${item.festivalId}:${item.arrangementId}:${item.dato.slice(0, 4)}`; }
function formatShortDate(value: string) { return new Date(`${value}T00:00:00`).toLocaleDateString("nb-NO", { day: "2-digit", month: "2-digit", year: "2-digit" }); }
function formatDate(value: string) { return new Date(`${value}T00:00:00`).toLocaleDateString("nb-NO"); }
