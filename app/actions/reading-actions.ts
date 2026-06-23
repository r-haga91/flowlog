"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createReading, deleteReading as removeReading, getLatestReading, getPreviousReading, updateReading } from "@/repositories/reading-repository";
import { readingSchema } from "@/types/reading";
import type { ActionResult } from "@/types/common";
import { requireEditor } from "@/lib/auth";

export async function saveReading(input: unknown, confirmRollover = false): Promise<ActionResult> {
  await requireEditor();
  const parsed = readingSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Kontroller feltene og prøv igjen.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    const previous = await getLatestReading(parsed.data.festivalId, parsed.data.arrangementId);
    if (previous && parsed.data.malerstand < previous.malerstand && !confirmRollover) return {
      success: false,
      message: "Bekreft lavere målerstand før lagring.",
      requiresForce: true,
      previousMalerstand: previous.malerstand,
    };
    await createReading(parsed.data);
    revalidateReadingPages();
    const rollover = previous !== null && parsed.data.malerstand < previous.malerstand;
    return { success: true, message: rollover ? "Avlesning lagret med rollover-varsel." : "Avlesning lagret." };
  } catch (error) {
    const message = error instanceof Error && error.message.includes("tilhører") ? error.message : "Kunne ikke lagre avlesningen. Prøv igjen.";
    return { success: false, message };
  }
}

const readingWithIdSchema = readingSchema.extend({ id: z.coerce.number().int().positive() });
const idSchema = z.coerce.number().int().positive();

export async function editReading(input: unknown): Promise<ActionResult> {
  await requireEditor();
  const parsed = readingWithIdSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Kontroller feltene og prøv igjen.", fieldErrors: parsed.error.flatten().fieldErrors };
  const { id, ...reading } = parsed.data;
  try {
    const previous = await getPreviousReading(reading, id);
    await updateReading(id, reading);
    revalidateReadingPages();
    return { success: true, message: "Avlesning oppdatert.", warning: rolloverWarning(previous?.malerstand, reading.malerstand) };
  } catch (error) {
    const message = error instanceof Error && error.message.includes("tilhører") ? error.message : "Kunne ikke oppdatere avlesningen.";
    return { success: false, message };
  }
}

export async function removeReadingAction(input: unknown): Promise<ActionResult> {
  await requireEditor();
  const parsed = idSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Ugyldig avlesning." };
  try {
    await removeReading(parsed.data);
    revalidateReadingPages();
    return { success: true, message: "Avlesning slettet." };
  } catch {
    return { success: false, message: "Kunne ikke slette avlesningen." };
  }
}

function rolloverWarning(previous: number | undefined, current: number) {
  return previous !== undefined && current < previous
    ? "Målerstand er lavere enn forrige avlesning. Dette tolkes som rollover."
    : undefined;
}

function revalidateReadingPages() {
  for (const path of ["/", "/registrering", "/dokumentasjon", "/analyse", "/historikk", "/live-festival"]) revalidatePath(path);
}
