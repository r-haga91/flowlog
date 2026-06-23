import type { ArrangementSummary, DocumentationReading, ReadingSummary } from "@/types/documentation";
import { calculateConsumption } from "@/services/consumption-service";

export function summarizeReadings(readings: DocumentationReading[], groupByArrangement = false): ReadingSummary | null {
  if (!readings.length) return null;
  const result = calculateConsumption(readings);
  const first = result.readings[0];
  const last = result.readings[result.readings.length - 1];
  const groups = groupByArrangement ? groupReadings(result.readings) : [result.readings];
  const calculations = groups.map((items) => calculateConsumption(items));
  return {
    startmaling: first.malerstand,
    sluttmaling: last.malerstand,
    totaltSolgt: calculations.reduce((sum, item) => sum + item.total, 0),
    antall: readings.length,
    forsteAvlesning: formatReadingTime(first),
    sisteAvlesning: formatReadingTime(last),
    rollover: calculations.some((item) => item.rolloverDetected),
    mangelfull: calculations.some((item) => item.invalidData),
  };
}

function groupReadings(readings: DocumentationReading[]) {
  const groups = new Map<number, DocumentationReading[]>();
  for (const reading of readings) groups.set(reading.arrangementId, [...(groups.get(reading.arrangementId) ?? []), reading]);
  return Array.from(groups.values());
}

export function summarizeByArrangement(readings: DocumentationReading[]): ArrangementSummary[] {
  const groups = new Map<number, DocumentationReading[]>();
  for (const reading of readings) groups.set(reading.arrangementId, [...(groups.get(reading.arrangementId) ?? []), reading]);
  return Array.from(groups.entries()).map(([arrangementId, items]) => ({
    arrangementId,
    arrangement: items[0].arrangement,
    ...summarizeReadings(items)!,
  }));
}

export function formatReadingTime(reading: Pick<DocumentationReading, "dato" | "klokkeslett">) {
  return `${formatDate(reading.dato)} kl. ${reading.klokkeslett}`;
}

export function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("nb-NO");
}

export function formatLiters(value: number) {
  return `${new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 3 }).format(value)} liter`;
}
