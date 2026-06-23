"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { editArrangementSetting, editNameSetting } from "@/app/actions/settings-actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FieldError, Input, Label, Select } from "@/components/ui/form-controls";
import { Notice } from "@/components/ui/notice";
import { arrangementSchema, nameSchema, type ArrangementInput, type NameInput } from "@/types/settings";
import type { SelectOption, SettingKind } from "@/types/common";

type Props = { id: number; navn: string; kind: SettingKind; festivalId?: number; festivaler?: SelectOption[]; onSaved: (message: string) => void };

export function EditSettingDialog(props: Props) {
  return props.kind === "arrangement" ? <ArrangementEdit {...props} festivalId={props.festivalId!} festivaler={props.festivaler ?? []} /> : <NameEdit {...props} />;
}

function NameEdit({ id, navn, kind, onSaved }: Props) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const form = useForm<NameInput>({ resolver: zodResolver(nameSchema), defaultValues: { navn } });
  async function submit(values: NameInput) {
    const result = await editNameSetting(kind, id, values);
    if (!result.success) return setError(result.message);
    setOpen(false); onSaved(result.message);
  }
  return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button variant="ghost" size="icon" aria-label={`Rediger ${navn}`}><Pencil className="size-4" /></Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Rediger oppføring</DialogTitle><DialogDescription>Oppdater navnet og lagre endringen.</DialogDescription></DialogHeader><form onSubmit={form.handleSubmit(submit)} className="space-y-5">{error && <Notice variant="error">{error}</Notice>}<div><Label htmlFor={`edit-${kind}-${id}`}>Navn</Label><Input id={`edit-${kind}-${id}`} {...form.register("navn")} /><FieldError message={form.formState.errors.navn?.message} /></div><Actions loading={form.formState.isSubmitting} /></form></DialogContent></Dialog>;
}

function ArrangementEdit({ id, navn, festivalId, festivaler, onSaved }: Props & { festivalId: number; festivaler: SelectOption[] }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const form = useForm<ArrangementInput>({ resolver: zodResolver(arrangementSchema), defaultValues: { navn, festivalId } });
  async function submit(values: ArrangementInput) {
    const result = await editArrangementSetting(id, values);
    if (!result.success) return setError(result.message);
    setOpen(false); onSaved(result.message);
  }
  return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button variant="ghost" size="icon" aria-label={`Rediger ${navn}`}><Pencil className="size-4" /></Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Rediger arrangement</DialogTitle><DialogDescription>Oppdater navn eller tilknyttet festival.</DialogDescription></DialogHeader><form onSubmit={form.handleSubmit(submit)} className="space-y-5">{error && <Notice variant="error">{error}</Notice>}<div><Label>Festival</Label><Select {...form.register("festivalId")}>{festivaler.map((item) => <option key={item.id} value={item.id}>{item.navn}</option>)}</Select><FieldError message={form.formState.errors.festivalId?.message} /></div><div><Label>Navn</Label><Input {...form.register("navn")} /><FieldError message={form.formState.errors.navn?.message} /></div><Actions loading={form.formState.isSubmitting} /></form></DialogContent></Dialog>;
}

function Actions({ loading }: { loading: boolean }) {
  return <div className="grid grid-cols-2 gap-3"><DialogClose asChild><Button type="button" variant="secondary" size="lg">Avbryt</Button></DialogClose><Button type="submit" size="lg" disabled={loading}>{loading ? "Lagrer …" : "Lagre"}</Button></div>;
}
