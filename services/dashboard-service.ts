import type { DashboardData, DashboardPoint } from "@/types/dashboard";
import type { DocumentationReading } from "@/types/documentation";
import { formatReadingTime } from "@/services/documentation-service";
import { calculateConsumption, readingTimestamp } from "@/services/consumption-service";

const numberFormat = new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 1 });

export function buildDashboardData(readings: DocumentationReading[], now = new Date()): DashboardData | null {
  if (!readings.length) return null;
  const consumption = calculateConsumption(readings);
  const ordered = consumption.readings;
  const first = ordered[0];
  const last = ordered[ordered.length - 1];
  const total = consumption.total;
  const elapsedHours = hoursBetween(first, last);
  const intervals = buildIntervals(consumption.intervals, first.malerstand);
  const cumulative = buildCumulativeSeries(ordered, consumption.intervals);

  return {
    metrics: {
      totaltSolgt: total,
      startmaling: first.malerstand,
      sluttmaling: last.malerstand,
      antallAvlesninger: ordered.length,
      gjennomsnittPerTime: elapsedHours > 0 ? total / elapsedHours : 0,
      hoyestePerTime: Math.max(0, ...intervals.map((point) => point.literPerTime)),
      forsteAvlesning: formatReadingTime(first),
      sisteAvlesning: formatReadingTime(last),
    },
    malerstandSerie: ordered.map((reading) => pointFromReading(reading, 0)),
    intervallSerie: intervals,
    kumulativSerie: cumulative,
    sisteAvlesninger: [...ordered].reverse().slice(0, 10),
    status: buildStatus(last, now),
  };
}

function buildIntervals(intervals: ReturnType<typeof calculateConsumption<DocumentationReading>>["intervals"], start: number): DashboardPoint[] {
  return intervals.map(({ previous, current: reading, consumed }) => {
    const hours = hoursBetween(previous, reading);
    return {
      ...pointFromReading(reading, start),
      solgt: consumed,
      literPerTime: hours > 0 ? consumed / hours : 0,
    };
  });
}

function buildCumulativeSeries(readings: DocumentationReading[], intervals: ReturnType<typeof calculateConsumption<DocumentationReading>>["intervals"]) {
  let total = 0;
  return readings.map((reading, index) => {
    if (index > 0) total += intervals[index - 1].consumed;
    return { ...pointFromReading(reading, 0), solgt: total };
  });
}

function pointFromReading(reading: DocumentationReading, start: number): DashboardPoint {
  return {
    tidspunkt: `${reading.dato}T${reading.klokkeslett}`,
    etikett: formatChartLabel(reading),
    malerstand: reading.malerstand,
    solgt: reading.malerstand - start,
    literPerTime: 0,
  };
}

function buildStatus(reading: DocumentationReading, now: Date) {
  const elapsedMinutes = Math.max(0, Math.floor((now.getTime() - readingTimestamp(reading)) / 60_000));
  return {
    sisteRegistrering: formatReadingTime(reading),
    tidSiden: formatElapsedTime(elapsedMinutes),
    overEnTime: elapsedMinutes > 60,
  };
}

function formatElapsedTime(minutes: number) {
  if (minutes < 1) return "Nå nettopp";
  if (minutes < 60) return `${minutes} min siden`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} t ${rest} min siden` : `${hours} t siden`;
}

function formatChartLabel(reading: DocumentationReading) {
  const date = new Date(`${reading.dato}T00:00:00`).toLocaleDateString("nb-NO", { day: "2-digit", month: "2-digit" });
  return `${date} ${reading.klokkeslett}`;
}

function hoursBetween(first: DocumentationReading, last: DocumentationReading) {
  return (readingTimestamp(last) - readingTimestamp(first)) / 3_600_000;
}

export function formatDashboardNumber(value: number) {
  return numberFormat.format(value);
}
