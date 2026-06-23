"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { editReading } from "@/app/actions/reading-actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FieldError, Input, Label, Select, Textarea } from "@/components/ui/form-controls";
import { Notice } from "@/components/ui/notice";
import { readingSchema, type ManagedReading, type ReadingInput } from "@/types/reading";
import type { SelectOption } from "@/types/common";
import { favoriteLabel, useFavoriteOptions } from "@/hooks/use-favorite-options";

type Props = {
  reading: ManagedReading;
  festivaler: SelectOption[];
  arrangorer: SelectOption[];
  arrangementer: Array<SelectOption & { festivalId: number }>;
  onSaved: (message: string) => void;
};

export function EditReadingDialog({ reading, festivaler, arrangorer, arrangementer, onSaved }: Props) {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState("");
  const favoriteOptions = useFavoriteOptions(festivaler, arrangementer);
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<ReadingInput>({ resolver: zodResolver(readingSchema), defaultValues: reading });
  const festivalId = Number(watch("festivalId"));
  const available = useMemo(() => favoriteOptions.arrangementer.filter((item) => item.festivalId === festivalId), [favoriteOptions.arrangementer, festivalId]);

  async function submit(values: ReadingInput) {
    setServerError("");
    const result = await editReading({ id: reading.id, ...values });
    if (!result.success) return setServerError(result.message);
    setOpen(false);
    onSaved(result.warning ?? result.message);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button variant="secondary" size="sm"><Pencil className="size-4" />Rediger</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Rediger avlesning</DialogTitle><DialogDescription>Oppdater feltene og lagre endringene.</DialogDescription></DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-4" noValidate>
          {serverError && <Notice variant="error">{serverError}</Notice>}
          <EditField label="Festival" error={errors.festivalId?.message}><Select {...register("festivalId")} onChange={(event) => { register("festivalId").onChange(event); setValue("arrangementId", 0); }}>{favoriteOptions.festivaler.map((item) => <option key={item.id} value={item.id}>{favoriteLabel(item.navn, favoriteOptions.favorites.festivaler.includes(item.id))}</option>)}</Select></EditField>
          <EditField label="Arrangør" error={errors.arrangorId?.message}><Select {...register("arrangorId")}>{arrangorer.map((item) => <option key={item.id} value={item.id}>{item.navn}</option>)}</Select></EditField>
          <EditField label="Arrangement" error={errors.arrangementId?.message}><Select {...register("arrangementId")} disabled={!available.length}><option value={0}>{available.length ? "Velg arrangement" : "Ingen arrangementer funnet for valgt festival"}</option>{available.map((item) => <option key={item.id} value={item.id}>{favoriteLabel(item.navn, favoriteOptions.favorites.arrangementer.includes(item.id))}</option>)}</Select>{!available.length && <p className="mt-2 text-sm text-muted-foreground">Ingen arrangementer funnet for valgt festival</p>}</EditField>
          <div className="grid grid-cols-2 gap-3"><EditField label="Dato" error={errors.dato?.message}><Input type="date" {...register("dato")} /></EditField><EditField label="Tid" error={errors.klokkeslett?.message}><Input type="time" {...register("klokkeslett")} /></EditField></div>
          <EditField label="Målerstand" error={errors.malerstand?.message}><Input type="number" inputMode="decimal" step="any" min="0" {...register("malerstand")} /></EditField>
          <EditField label="Kommentar" error={errors.kommentar?.message}><Textarea {...register("kommentar")} /></EditField>
          <div className="grid grid-cols-2 gap-3 pt-2"><DialogClose asChild><Button type="button" variant="secondary" size="lg">Avbryt</Button></DialogClose><Button type="submit" size="lg" disabled={isSubmitting}>{isSubmitting ? "Lagrer …" : "Lagre"}</Button></div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <div><Label>{label}</Label>{children}<FieldError message={error} /></div>;
}
