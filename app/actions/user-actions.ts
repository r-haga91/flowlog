"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdministrator } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createManagedUser, setManagedUserActive, updateManagedUser } from "@/services/user-service";
import { createUserSchema, updateUserSchema, type UserActionResult } from "@/types/user";

export async function addUser(input: unknown): Promise<UserActionResult> {
  await requireAdministrator();
  const parsed = createUserSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  try {
    await createManagedUser(parsed.data);
    revalidatePath("/innstillinger");
    return { success: true, message: "Bruker opprettet." };
  } catch (error) {
    return { success: false, message: safeMessage(error, "Kunne ikke opprette brukeren.") };
  }
}

export async function editUser(input: unknown): Promise<UserActionResult> {
  const session = await requireAdministrator();
  const parsed = updateUserSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  const selfDemotion = parsed.data.authUserId === session.user.id && parsed.data.role !== "ADMINISTRATOR";
  if (selfDemotion && !parsed.data.confirmSelfDemotion) return {
    success: false,
    requiresConfirmation: true,
    message: "Du er i ferd med å fjerne din egen administratorrolle. Bekreft for å fortsette.",
  };
  if (parsed.data.authUserId === session.user.id && !parsed.data.isActive) return { success: false, message: "Du kan ikke deaktivere din egen bruker." };
  try {
    await updateManagedUser(parsed.data.authUserId, parsed.data);
    revalidatePath("/innstillinger");
    return { success: true, message: "Brukeren er oppdatert." };
  } catch (error) {
    return { success: false, message: safeMessage(error, "Kunne ikke oppdatere brukeren.") };
  }
}

export async function deactivateUser(authUserId: unknown): Promise<UserActionResult> {
  const session = await requireAdministrator();
  const parsed = z.string().uuid().safeParse(authUserId);
  if (!parsed.success) return { success: false, message: "Ugyldig bruker." };
  if (parsed.data === session.user.id) return { success: false, message: "Du kan ikke deaktivere din egen bruker." };
  try {
    await setManagedUserActive(parsed.data, false);
    revalidatePath("/innstillinger");
    return { success: true, message: "Brukeren er deaktivert." };
  } catch (error) {
    return { success: false, message: safeMessage(error, "Kunne ikke deaktivere brukeren.") };
  }
}

export async function sendPasswordReset(email: unknown): Promise<UserActionResult> {
  await requireAdministrator();
  const parsed = z.string().email().safeParse(email);
  if (!parsed.success) return { success: false, message: "Ugyldig e-postadresse." };
  try {
    const headerStore = await headers();
    const origin = headerStore.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
      redirectTo: `${origin}/auth/bekreft?next=/oppdater-passord`,
    });
    if (error) throw error;
    return { success: true, message: "Lenke for passordendring er sendt." };
  } catch {
    return { success: false, message: "Kunne ikke sende lenke for passordendring." };
  }
}

function invalid(error: z.ZodError): UserActionResult {
  const entries = Object.entries(error.flatten().fieldErrors).filter((entry): entry is [string, string[]] => Array.isArray(entry[1]));
  return { success: false, message: "Kontroller feltene og prøv igjen.", fieldErrors: Object.fromEntries(entries) };
}

function safeMessage(error: unknown, fallback: string) {
  return error instanceof Error && !error.message.includes("Prisma") ? error.message : fallback;
}
