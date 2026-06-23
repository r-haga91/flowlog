"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createArrangor, createArrangement, createFestival, deleteSetting, updateArrangor, updateArrangement, updateFestival } from "@/repositories/settings-repository";
import { arrangementSchema, nameSchema } from "@/types/settings";
import type { ActionResult } from "@/types/common";
import type { SettingKind } from "@/types/common";
import { requireAdministrator } from "@/lib/auth";

function validationError(error: { flatten: () => { fieldErrors: Record<string, string[]> } }): ActionResult {
  return { success: false, message: "Kontroller feltene og prøv igjen.", fieldErrors: error.flatten().fieldErrors };
}

function databaseError(error: unknown): ActionResult {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    return { success: false, message: "Denne oppføringen finnes allerede." };
  }
  return { success: false, message: "Kunne ikke lagre. Prøv igjen." };
}

function refresh() {
  revalidatePath("/innstillinger");
  revalidatePath("/registrering");
}

export async function addFestival(input: unknown): Promise<ActionResult> {
  await requireAdministrator();
  const parsed = nameSchema.safeParse(input);
  if (!parsed.success) return validationError(parsed.error);
  try {
    await createFestival(parsed.data.navn);
    refresh();
    return { success: true, message: "Festival opprettet." };
  } catch (error) { return databaseError(error); }
}

export async function addArrangor(input: unknown): Promise<ActionResult> {
  await requireAdministrator();
  const parsed = nameSchema.safeParse(input);
  if (!parsed.success) return validationError(parsed.error);
  try {
    await createArrangor(parsed.data.navn);
    refresh();
    return { success: true, message: "Arrangør opprettet." };
  } catch (error) { return databaseError(error); }
}

export async function addArrangement(input: unknown): Promise<ActionResult> {
  await requireAdministrator();
  const parsed = arrangementSchema.safeParse(input);
  if (!parsed.success) return validationError(parsed.error);
  try {
    await createArrangement(parsed.data.navn, parsed.data.festivalId);
    refresh();
    return { success: true, message: "Arrangement opprettet." };
  } catch (error) { return databaseError(error); }
}

const idSchema = z.coerce.number().int().positive();
const kindSchema = z.enum(["festival", "arrangor", "arrangement"]);

export async function editNameSetting(kind: SettingKind, id: unknown, input: unknown): Promise<ActionResult> {
  await requireAdministrator();
  const parsedKind = kindSchema.safeParse(kind);
  const parsedId = idSchema.safeParse(id);
  const parsed = nameSchema.safeParse(input);
  if (!parsedKind.success || !parsedId.success || !parsed.success) return { success: false, message: "Kontroller feltene og prøv igjen." };
  try {
    if (kind === "festival") await updateFestival(parsedId.data, parsed.data.navn);
    else if (kind === "arrangor") await updateArrangor(parsedId.data, parsed.data.navn);
    else return { success: false, message: "Ugyldig oppføring." };
    refresh();
    return { success: true, message: "Oppføringen er oppdatert." };
  } catch (error) { return databaseError(error); }
}

export async function editArrangementSetting(id: unknown, input: unknown): Promise<ActionResult> {
  await requireAdministrator();
  const parsedId = idSchema.safeParse(id);
  const parsed = arrangementSchema.safeParse(input);
  if (!parsedId.success || !parsed.success) return { success: false, message: "Kontroller feltene og prøv igjen." };
  try {
    await updateArrangement(parsedId.data, parsed.data.navn, parsed.data.festivalId);
    refresh();
    return { success: true, message: "Arrangementet er oppdatert." };
  } catch (error) { return databaseError(error); }
}

export async function removeSetting(kind: SettingKind, id: unknown, force = false): Promise<ActionResult> {
  await requireAdministrator();
  const parsedKind = kindSchema.safeParse(kind);
  const parsedId = idSchema.safeParse(id);
  if (!parsedKind.success || !parsedId.success) return { success: false, message: "Ugyldig oppføring." };
  try {
    const deleted = await deleteSetting(parsedKind.data, parsedId.data, force);
    if (!deleted) return { success: false, requiresForce: true, message: "Denne brukes av eksisterende avlesninger." };
    refresh();
    return { success: true, message: "Oppføringen er slettet." };
  } catch {
    return { success: false, message: "Kunne ikke slette oppføringen." };
  }
}
