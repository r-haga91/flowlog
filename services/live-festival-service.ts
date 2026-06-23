import { calculateConsumption } from "@/services/consumption-service";
import type { LiveSnapshot } from "@/types/live-festival";
import type { DocumentationReading } from "@/types/documentation";

export function buildLiveSnapshot(readings: DocumentationReading[]): LiveSnapshot {
  const result = calculateConsumption(readings);
  const latest = result.readings.at(-1);
  const latestInterval = result.intervals.at(-1);
  return {
    sisteMalerstand: latest?.malerstand ?? null,
    sisteTidspunkt: latest ? `${latest.dato}T${latest.klokkeslett}:00` : null,
    sisteTid: latest?.klokkeslett ?? null,
    antall: result.readings.length,
    totaltSolgt: result.total,
    endring: latestInterval?.consumed ?? null,
    rollover: latestInterval?.rollover ?? false,
    readings: result.readings.slice(-5).reverse().map(({ id, klokkeslett, malerstand, kommentar }) => ({
      id,
      klokkeslett,
      malerstand,
      kommentar,
      rollover: result.intervals.some((interval) => interval.current.id === id && interval.rollover),
    })),
  };
}

export function formatTimeSince(timestamp: string | null, now = new Date()) {
  if (!timestamp) return "Ingen registreringer ennå";
  const minutes = Math.max(0, Math.floor((now.getTime() - new Date(timestamp).getTime()) / 60_000));
  if (minutes < 1) return "Nå nettopp";
  if (minutes < 60) return `${minutes} min siden`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} t ${rest} min siden` : `${hours} t siden`;
}
