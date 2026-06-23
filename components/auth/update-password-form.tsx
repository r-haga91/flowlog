"use client";

import { useActionState } from "react";
import { updatePassword, type PasswordState } from "@/app/oppdater-passord/actions";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/form-controls";

export function UpdatePasswordForm() {
  const [state, action, pending] = useActionState(updatePassword, { error: "" } satisfies PasswordState);
  return <form action={action} className="mt-6 space-y-5">{state.error && <div role="alert" className="rounded-2xl border border-destructive/25 bg-destructive/10 p-4 text-sm text-red-300">{state.error}</div>}<div><Label htmlFor="new-password">Nytt passord</Label><Input id="new-password" name="password" type="password" minLength={8} autoComplete="new-password" required /></div><Button type="submit" size="lg" className="w-full" disabled={pending}>{pending ? "Endrer …" : "Endre passord"}</Button></form>;
}
