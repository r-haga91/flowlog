"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldError, Input, Label, Textarea } from "@/components/ui/form-controls";
import { quickReadingSchema, type QuickReadingInput } from "@/types/reading";

type Props = { paused: boolean; saving: boolean; resetSignal: number; onSave: (reading: QuickReadingInput) => Promise<boolean> };

export function LiveReadingForm({ paused, saving, resetSignal, onSave }: Props) {
  const { register, handleSubmit, reset, setFocus, formState: { errors } } = useForm<QuickReadingInput>({ resolver: zodResolver(quickReadingSchema), defaultValues: { malerstand: undefined, kommentar: "" } });
  useEffect(() => { if (!paused) setFocus("malerstand"); }, [paused, setFocus]);
  useEffect(() => {
    if (!resetSignal) return;
    reset({ malerstand: undefined, kommentar: "" });
    requestAnimationFrame(() => setFocus("malerstand", { shouldSelect: true }));
  }, [resetSignal, reset, setFocus]);

  async function submit(reading: QuickReadingInput) {
    if (await onSave(reading)) {
      reset({ malerstand: undefined, kommentar: "" });
      requestAnimationFrame(() => setFocus("malerstand", { shouldSelect: true }));
    }
  }

  return (
    <Card className="p-6 sm:p-8">
      <form className="space-y-6" onSubmit={handleSubmit(submit)} noValidate>
        <div><Label htmlFor="live-malerstand">Målerstand</Label><Input id="live-malerstand" type="number" inputMode="numeric" step="any" min="0" placeholder="0" autoFocus disabled={paused} className="h-20 text-3xl font-semibold" {...register("malerstand")} /><FieldError message={errors.malerstand?.message} /></div>
        <div><Label htmlFor="live-kommentar">Kommentar (valgfritt)</Label><Textarea id="live-kommentar" placeholder="Kort kommentar" disabled={paused} {...register("kommentar")} /><FieldError message={errors.kommentar?.message} /></div>
        <Button type="submit" size="lg" className="h-16 w-full text-lg" disabled={paused || saving}>{paused ? "Oppdraget er pauset" : saving ? "Lagrer …" : "Lagre"}</Button>
      </form>
    </Card>
  );
}
