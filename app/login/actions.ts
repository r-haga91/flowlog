"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";

export type LoginState = { error: string };

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function login(_: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { error: "Feil e-post eller passord." };

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    if (error) return { error: "Feil e-post eller passord." };
    const session = await requireProfile();
    if (!session.profile.isActive) {
      await supabase.auth.signOut();
      return { error: "Brukeren er deaktivert. Kontakt administrator." };
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("deaktivert")) return { error: "Brukeren er deaktivert. Kontakt administrator." };
    if (message.includes("ikke tilgang")) return { error: "Brukeren har ikke tilgang. Kontakt administrator." };
    return { error: "Innlogging er ikke konfigurert. Kontakt administrator." };
  }
  redirect("/");
}
