export const DEFAULT_METER_MAX = 99_999;

export type ConsumptionReading = {
  id?: number;
  dato: string;
  klokkeslett: string;
  malerstand: number;
  opprettetDato?: string;
};

export type ConsumptionInterval<T> = {
  previous: T;
  current: T;
  consumed: number;
  rollover: boolean;
};

export type ConsumptionResult<T> = {
  readings: T[];
  intervals: Array<ConsumptionInterval<T>>;
  total: number;
  rolloverDetected: boolean;
  invalidData: boolean;
};

export function calculateConsumption<T extends ConsumptionReading>(
  readings: T[],
  options: { meterMax?: number | null } = {},
): ConsumptionResult<T> {
  const ordered = sortReadings(readings);
  const meterMax = options.meterMax ?? DEFAULT_METER_MAX;
  let invalidData = false;

  const intervals = ordered.slice(1).map((current, index) => {
    const previous = ordered[index];
    const rollover = current.malerstand < previous.malerstand;
    let consumed = current.malerstand - previous.malerstand;

    if (rollover) {
      if (Number.isFinite(meterMax) && meterMax > 0 && previous.malerstand <= meterMax) {
        consumed = meterMax - previous.malerstand + current.malerstand;
      } else {
        consumed = 0;
        invalidData = true;
      }
    }

    if (!Number.isFinite(consumed) || consumed < 0) {
      consumed = 0;
      invalidData = true;
    }
    return { previous, current, consumed, rollover };
  });

  return {
    readings: ordered,
    intervals,
    total: intervals.reduce((sum, interval) => sum + interval.consumed, 0),
    rolloverDetected: intervals.some((interval) => interval.rollover),
    invalidData,
  };
}

export function sortReadings<T extends ConsumptionReading>(readings: T[]) {
  return [...readings].sort((a, b) => readingTimestamp(a) - readingTimestamp(b)
    || String(a.opprettetDato ?? "").localeCompare(String(b.opprettetDato ?? ""))
    || (a.id ?? 0) - (b.id ?? 0));
}

export function readingTimestamp(reading: Pick<ConsumptionReading, "dato" | "klokkeslett">) {
  const timestamp = new Date(`${reading.dato}T${reading.klokkeslett}:00`).getTime();
  return Number.isFinite(timestamp) ? timestamp : Number.MAX_SAFE_INTEGER;
}
