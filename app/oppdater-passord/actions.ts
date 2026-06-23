"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";

export type PasswordState = { error: string };
const schema = z.object({ password: z.string().min(8, "Passordet må ha minst 8 tegn").max(72) });

export async function updatePassword(_: PasswordState, formData: FormData): Promise<PasswordState> {
  await requireUser();
  const parsed = schema.safeParse({ password: formData.get("password") });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Kontroller passordet." };
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { error: "Kunne ikke endre passordet." };
  redirect("/");
}
