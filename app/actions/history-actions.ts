"use server";

import { getHistoryReadings } from "@/repositories/history-repository";
import { buildHistoryData } from "@/services/history-service";
import { historyFilterSchema, type HistoryActionResult } from "@/types/history";
import { requireUser } from "@/lib/auth";

export async function loadHistory(input: unknown): Promise<HistoryActionResult> {
  await requireUser();
  const parsed = historyFilterSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message ?? "Kontroller filtrene." };
  try {
    const readings = await getHistoryReadings(parsed.data);
    return { success: true, data: buildHistoryData(readings) };
  } catch {
    return { success: false, message: "Kunne ikke hente historikken." };
  }
}
