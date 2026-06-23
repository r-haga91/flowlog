"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { editUser } from "@/app/actions/user-actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FieldError, Input, Label, Select } from "@/components/ui/form-controls";
import { Notice } from "@/components/ui/notice";
import { updateUserSchema, userLabels, userRoles, type ManagedUser, type UpdateUserInput } from "@/types/user";

export function EditUserDialog({ user, currentUserId, onSaved }: { user: ManagedUser; currentUserId: string; onSaved: (message: string) => void }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(false);
  const form = useForm<UpdateUserInput>({ resolver: zodResolver(updateUserSchema), defaultValues: {
    authUserId: user.authUserId, name: user.name, role: user.role, isActive: user.isActive, confirmSelfDemotion: false,
  } });

  async function submit(values: UpdateUserInput, confirmed = false) {
    setError("");
    const result = await editUser({ ...values, confirmSelfDemotion: confirmed });
    if (result.requiresConfirmation) return setConfirming(true);
    if (!result.success) return setError(result.message);
    setOpen(false);
    setConfirming(false);
    onSaved(result.message);
  }

  return (
    <Dialog open={open} onOpenChange={(next) => { setOpen(next); if (!next) { setError(""); setConfirming(false); } }}>
      <DialogTrigger asChild><Button variant="ghost" size="icon" aria-label={`Rediger ${user.name}`}><Pencil className="size-4" /></Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Rediger bruker</DialogTitle><DialogDescription>Oppdater navn, rolle eller tilgangsstatus.</DialogDescription></DialogHeader>
        {confirming ? <SelfDemotion onCancel={() => setConfirming(false)} onConfirm={() => submit(form.getValues(), true)} loading={form.formState.isSubmitting} /> : (
          <form onSubmit={form.handleSubmit((values) => submit(values))} className="space-y-5">
            {error && <Notice variant="error">{error}</Notice>}
            <div><Label>Navn</Label><Input {...form.register("name")} /><FieldError message={form.formState.errors.name?.message} /></div>
            <div><Label>E-post</Label><Input value={user.email} disabled /></div>
            <div><Label>Rolle</Label><Select {...form.register("role")}>{userRoles.map((role) => <option key={role} value={role}>{userLabels[role]}</option>)}</Select></div>
            <label className="flex min-h-14 items-center gap-3 rounded-xl border border-border bg-white/[0.04] px-4"><input type="checkbox" className="size-5 accent-primary" {...form.register("isActive")} /><span className="font-medium">Aktiv bruker</span></label>
            {user.authUserId === currentUserId && <p className="text-sm text-muted-foreground">Endring av din egen administratorrolle krever ekstra bekreftelse.</p>}
            <div className="grid grid-cols-2 gap-3"><DialogClose asChild><Button type="button" variant="secondary" size="lg">Avbryt</Button></DialogClose><Button type="submit" size="lg" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? "Lagrer …" : "Lagre"}</Button></div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function SelfDemotion({ onCancel, onConfirm, loading }: { onCancel: () => void; onConfirm: () => void; loading: boolean }) {
  return <div className="space-y-5"><Notice variant="error">Du er i ferd med å fjerne din egen administratorrolle. Du kan miste tilgang til brukeradministrasjonen.</Notice><div className="grid grid-cols-2 gap-3"><Button variant="secondary" size="lg" onClick={onCancel}>Avbryt</Button><Button size="lg" onClick={onConfirm} disabled={loading}>Bekreft endring</Button></div></div>;
}
