"use server";

import { saveReading } from "@/app/actions/reading-actions";
import { getDocumentationReadings } from "@/repositories/documentation-repository";
import { buildLiveSnapshot } from "@/services/live-festival-service";
import { liveAssignmentSchema, type LiveActionResult } from "@/types/live-festival";
import { quickReadingSchema } from "@/types/reading";
import { requireEditor } from "@/lib/auth";

export async function loadLiveSnapshot(input: unknown): Promise<LiveActionResult> {
  await requireEditor();
  const assignment = liveAssignmentSchema.safeParse(input);
  if (!assignment.success) return { success: false, message: "Aktivt oppdrag er ugyldig." };
  try {
    const readings = await getDocumentationReadings({
      festivalId: assignment.data.festivalId,
      arrangorId: assignment.data.arrangorId,
      arrangementId: assignment.data.arrangementId,
      fra: assignment.data.dato,
      til: assignment.data.dato,
    });
    return { success: true, message: "", snapshot: buildLiveSnapshot(readings) };
  } catch {
    return { success: false, message: "Kunne ikke hente oppdraget." };
  }
}

export async function saveLiveReading(input: unknown, confirmRollover = false): Promise<LiveActionResult> {
  await requireEditor();
  const value = input as { assignment?: unknown; reading?: unknown };
  const assignment = liveAssignmentSchema.safeParse(value?.assignment);
  const reading = quickReadingSchema.safeParse(value?.reading);
  if (!assignment.success || !reading.success) return {
    success: false,
    message: "Kontroller målerstanden og prøv igjen.",
    fieldErrors: reading.success ? undefined : reading.error.flatten().fieldErrors,
  };

  const result = await saveReading({
    ...reading.data,
    festivalId: assignment.data.festivalId,
    arrangorId: assignment.data.arrangorId,
    arrangementId: assignment.data.arrangementId,
    dato: assignment.data.dato,
    klokkeslett: currentTime(),
  }, confirmRollover);
  if (!result.success) return {
    success: false,
    message: result.message,
    fieldErrors: result.fieldErrors,
    requiresForce: result.requiresForce,
    previousMalerstand: result.previousMalerstand,
  };
  const snapshot = await loadLiveSnapshot(assignment.data);
  return snapshot.success ? { ...snapshot, message: result.message } : snapshot;
}

function currentTime() {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Oslo", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date());
}
