"use server";

import { revalidatePath } from "next/cache";
import { backupService } from "@/services/backup-service";
import { exportService } from "@/services/export-service";
import { importService } from "@/services/import-service";
import type { BackupActionResult, ExportPayload, ImportSummary } from "@/types/backup";
import { requireAdministrator } from "@/lib/auth";

export async function createBackup(settings: unknown): Promise<BackupActionResult<ExportPayload>> {
  await requireAdministrator();
  try {
    const backup = await exportService.create(settings);
    return { success: true, data: { backup, filnavn: exportService.filename() }, message: "Backup eksportert." };
  } catch {
    return { success: false, message: "Kunne ikke eksportere backup." };
  }
}

export async function importBackup(input: unknown): Promise<BackupActionResult<ImportSummary>> {
  await requireAdministrator();
  const parsed = backupService.validate(input);
  if (!parsed.success) return { success: false, message: "Filen er ikke en gyldig FlowLog-backup." };
  try {
    const summary = await importService.import(parsed.data);
    for (const path of ["/innstillinger", "/registrering", "/live-festival", "/dokumentasjon", "/analyse", "/historikk"]) revalidatePath(path);
    return { success: true, data: summary, message: "Backup importert uten å overskrive eksisterende data." };
  } catch {
    return { success: false, message: "Kunne ikke importere backupen." };
  }
}
