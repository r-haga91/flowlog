"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/form-controls";

export function LoginForm({ initialError = "" }: { initialError?: string }) {
  const [state, action, pending] = useActionState(login, { error: initialError } satisfies LoginState);
  return (
    <form action={action} className="mt-8 space-y-5">
      {state.error && <div role="alert" className="rounded-2xl border border-destructive/25 bg-destructive/10 p-4 text-sm text-red-300">{state.error}</div>}
      <div><Label htmlFor="email">E-post</Label><Input id="email" name="email" type="email" autoComplete="email" inputMode="email" required /></div>
      <div><Label htmlFor="password">Passord</Label><Input id="password" name="password" type="password" autoComplete="current-password" required /><FieldError /></div>
      <Button type="submit" size="lg" className="w-full text-base" disabled={pending}>{pending ? "Logger inn …" : "Logg inn"}</Button>
    </form>
  );
}
