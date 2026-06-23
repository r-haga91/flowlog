"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { addUser } from "@/app/actions/user-actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FieldError, Input, Label, Select } from "@/components/ui/form-controls";
import { Notice } from "@/components/ui/notice";
import { createUserSchema, userLabels, userRoles, type CreateUserInput } from "@/types/user";

export function CreateUserDialog({ onSaved }: { onSaved: (message: string) => void }) {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState("");
  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { name: "", email: "", role: "TEKNIKER", password: "" },
  });

  async function submit(values: CreateUserInput) {
    setServerError("");
    const result = await addUser(values);
    if (!result.success) {
      if (result.fieldErrors) for (const [key, messages] of Object.entries(result.fieldErrors)) form.setError(key as keyof CreateUserInput, { message: messages[0] });
      return setServerError(result.message);
    }
    form.reset();
    setOpen(false);
    onSaved(result.message);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button size="lg" className="w-full sm:w-auto"><Plus className="size-5" />Opprett bruker</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Opprett bruker</DialogTitle><DialogDescription>Brukeren opprettes sikkert i Supabase Auth og får tilgang med valgt rolle.</DialogDescription></DialogHeader>
        <form onSubmit={form.handleSubmit(submit)} className="space-y-5">
          {serverError && <Notice variant="error">{serverError}</Notice>}
          <Field label="Navn" error={form.formState.errors.name?.message}><Input autoFocus autoComplete="name" {...form.register("name")} /></Field>
          <Field label="E-post" error={form.formState.errors.email?.message}><Input type="email" autoComplete="email" {...form.register("email")} /></Field>
          <Field label="Rolle" error={form.formState.errors.role?.message}><Select {...form.register("role")}>{userRoles.map((role) => <option key={role} value={role}>{userLabels[role]}</option>)}</Select></Field>
          <Field label="Midlertidig passord" error={form.formState.errors.password?.message}><Input type="password" autoComplete="new-password" {...form.register("password")} /></Field>
          <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? "Oppretter …" : "Opprett bruker"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <div><Label>{label}</Label>{children}<FieldError message={error} /></div>;
}
