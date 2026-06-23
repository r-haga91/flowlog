"use server";

import { getDocumentationReadings } from "@/repositories/documentation-repository";
import { buildDashboardData } from "@/services/dashboard-service";
import type { DashboardActionResult } from "@/types/dashboard";
import { documentationFilterSchema } from "@/types/documentation";
import { requireUser } from "@/lib/auth";

export async function loadDashboard(input: unknown): Promise<DashboardActionResult> {
  await requireUser();
  const parsed = documentationFilterSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Kontroller filtrene og prøv igjen." };
  if (!parsed.data.arrangementId) return { success: true, data: null };

  try {
    const readings = await getDocumentationReadings(parsed.data);
    return { success: true, data: buildDashboardData(readings) };
  } catch {
    return { success: false, message: "Kunne ikke hente statistikken." };
  }
}
