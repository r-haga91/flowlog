"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { saveReading } from "@/app/actions/reading-actions";
import { ActiveAssignmentCard } from "@/components/registration/active-assignment-card";
import { LatestReadingCard } from "@/components/registration/latest-reading-card";
import { QuickComments } from "@/components/registration/quick-comments";
import { ReadingsList } from "@/components/registration/readings-list";
import { RolloverConfirmationDialog } from "@/components/registration/rollover-confirmation-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldError, Input, Label, Select, Textarea } from "@/components/ui/form-controls";
import { Notice } from "@/components/ui/notice";
import { useFavoriteOptions, favoriteLabel } from "@/hooks/use-favorite-options";
import { useToast } from "@/components/providers/toast-provider";
import { readingSchema, type LatestReading, type ManagedReading, type ReadingInput } from "@/types/reading";
import type { SelectOption } from "@/types/common";
import { clearRegistrationPreferences, loadRegistrationPreferences, saveRegistrationPreferences } from "@/utils/registration-preferences";

type Props = {
  festivaler: SelectOption[];
  arrangorer: SelectOption[];
  arrangementer: Array<SelectOption & { festivalId: number }>;
  latest: LatestReading | null;
  readings: ManagedReading[];
};

function nowValues() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return { dato: local.toISOString().slice(0, 10), klokkeslett: local.toISOString().slice(11, 16) };
}

export function RegistrationForm({ festivaler, arrangorer, arrangementer, latest: initialLatest, readings }: Props) {
  const [status, setStatus] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);
  const [latest, setLatest] = useState(initialLatest);
  const [pendingRollover, setPendingRollover] = useState<{ values: ReadingInput; previous: number } | null>(null);
  const [confirmingRollover, setConfirmingRollover] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const favoriteOptions = useFavoriteOptions(festivaler, arrangementer);
  const { register, handleSubmit, watch, reset, setFocus, setValue, getValues, formState: { errors, isSubmitting } } = useForm<ReadingInput>({
    resolver: zodResolver(readingSchema),
    defaultValues: { festivalId: 0, arrangorId: 0, arrangementId: 0, ...nowValues(), malerstand: undefined, kommentar: "" },
  });
  const festivalId = Number(watch("festivalId"));
  const arrangorId = Number(watch("arrangorId"));
  const arrangementId = Number(watch("arrangementId"));
  const availableArrangements = useMemo(() => favoriteOptions.arrangementer.filter((item) => item.festivalId === festivalId), [favoriteOptions.arrangementer, festivalId]);

  useEffect(() => {
    if (arrangementId && !availableArrangements.some((item) => item.id === arrangementId)) setValue("arrangementId", 0);
  }, [arrangementId, availableArrangements, setValue]);

  useEffect(() => setLatest(initialLatest), [initialLatest]);

  useEffect(() => {
    const saved = loadRegistrationPreferences();
    const valid = saved
      && festivaler.some((item) => item.id === saved.festivalId)
      && arrangorer.some((item) => item.id === saved.arrangorId)
      && arrangementer.some((item) => item.id === saved.arrangementId && item.festivalId === saved.festivalId);
    if (saved && valid) {
      reset({ festivalId: saved.festivalId, arrangorId: saved.arrangorId, arrangementId: saved.arrangementId, ...nowValues(), malerstand: undefined, kommentar: "" });
    } else if (saved) {
      clearRegistrationPreferences();
    }
    const focusTimer = window.setTimeout(() => setFocus("malerstand"), 100);
    return () => window.clearTimeout(focusTimer);
  }, [festivaler, arrangorer, arrangementer, reset, setFocus]);

  const activeAssignment = festivalId && arrangorId && arrangementId ? {
    festival: festivaler.find((item) => item.id === festivalId)?.navn ?? "",
    arrangor: arrangorer.find((item) => item.id === arrangorId)?.navn ?? "",
    arrangement: arrangementer.find((item) => item.id === arrangementId)?.navn ?? "",
  } : null;

  if (!festivaler.length) return <MissingSetup message="Du må først opprette en festival under Innstillinger." />;
  if (!arrangorer.length) return <MissingSetup message="Du må først opprette en arrangør under Innstillinger." />;
  if (!arrangementer.length) return <MissingSetup message="Du må først opprette et arrangement under Innstillinger." />;

  async function submit(values: ReadingInput) {
    setStatus(null);
    const result = await saveReading(values);
    if (result.requiresForce && result.previousMalerstand !== undefined) {
      setPendingRollover({ values, previous: result.previousMalerstand });
      return;
    }
    if (!result.success) return setStatus({ type: "error", message: result.message });
    completeSave(values, result.message);
  }

  function completeSave(values: ReadingInput, message: string) {
    const festival = festivaler.find((item) => item.id === Number(values.festivalId));
    const arrangement = arrangementer.find((item) => item.id === Number(values.arrangementId));
    setLatest({
      dato: values.dato,
      klokkeslett: values.klokkeslett,
      festival: festival?.navn ?? "",
      arrangement: arrangement?.navn ?? "",
      malerstand: Number(values.malerstand),
      kommentar: values.kommentar || null,
    });
    const preferences = { festivalId: Number(values.festivalId), arrangorId: Number(values.arrangorId), arrangementId: Number(values.arrangementId) };
    saveRegistrationPreferences(preferences);
    reset({ ...preferences, ...nowValues(), malerstand: undefined, kommentar: "" });
    toast(message);
    router.refresh();
    requestAnimationFrame(() => setFocus("malerstand", { shouldSelect: true }));
  }

  async function confirmRollover() {
    if (!pendingRollover) return;
    setConfirmingRollover(true);
    const result = await saveReading(pendingRollover.values, true);
    setConfirmingRollover(false);
    if (!result.success) return setStatus({ type: "error", message: result.message });
    const values = pendingRollover.values;
    setPendingRollover(null);
    completeSave(values, result.message);
  }

  function appendComment(comment: string) {
    const current = getValues("kommentar")?.trim();
    setValue("kommentar", current ? `${current}, ${comment}` : comment, { shouldDirty: true });
  }

  return (
    <div className="space-y-5">
      <ActiveAssignmentCard assignment={activeAssignment} />
      <RolloverConfirmationDialog
        open={pendingRollover !== null}
        previous={pendingRollover?.previous ?? 0}
        current={Number(pendingRollover?.values.malerstand ?? 0)}
        loading={confirmingRollover}
        onCancel={() => setPendingRollover(null)}
        onConfirm={() => void confirmRollover()}
      />
      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSubmit(submit)} className="space-y-6" noValidate>
          {status && <Notice variant={status.type}>{status.message}</Notice>}
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Festival" error={errors.festivalId?.message}><Select {...register("festivalId", { onChange: () => setValue("arrangementId", 0) })}><option value={0}>Velg festival</option>{favoriteOptions.festivaler.map((item) => <option key={item.id} value={item.id}>{favoriteLabel(item.navn, favoriteOptions.favorites.festivaler.includes(item.id))}</option>)}</Select></Field>
            <Field label="Arrangør" error={errors.arrangorId?.message}><Select {...register("arrangorId")}><option value={0}>Velg arrangør</option>{arrangorer.map((item) => <option key={item.id} value={item.id}>{item.navn}</option>)}</Select></Field>
            <Field label="Arrangement" error={errors.arrangementId?.message}><Select {...register("arrangementId")} disabled={!festivalId || !availableArrangements.length}><option value={0}>{!festivalId ? "Velg festival først" : availableArrangements.length ? "Velg arrangement" : "Ingen arrangementer funnet for valgt festival"}</option>{availableArrangements.map((item) => <option key={item.id} value={item.id}>{favoriteLabel(item.navn, favoriteOptions.favorites.arrangementer.includes(item.id))}</option>)}</Select>{festivalId > 0 && !availableArrangements.length && <p className="mt-2 text-sm text-muted-foreground">Ingen arrangementer funnet for valgt festival</p>}</Field>
            <div className="grid grid-cols-2 gap-3"><Field label="Dato" error={errors.dato?.message}><Input type="date" {...register("dato")} /></Field><Field label="Tid" error={errors.klokkeslett?.message}><Input type="time" {...register("klokkeslett")} /></Field></div>
          </div>
          <Field label="Målerstand" error={errors.malerstand?.message}><Input type="number" inputMode="numeric" step="any" min="0" placeholder="0" autoFocus className="h-16 text-2xl font-semibold" {...register("malerstand")} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); void handleSubmit(submit)(); } }} /></Field>
          <Field label="Kommentar (valgfritt)" error={errors.kommentar?.message}><Textarea placeholder="Legg til en kort kommentar" {...register("kommentar")} /><QuickComments onSelect={appendComment} /></Field>
          <Button type="submit" size="lg" className="w-full text-lg" disabled={isSubmitting}>{isSubmitting ? "Lagrer …" : "Lagre avlesning"}</Button>
        </form>
      </Card>
      <LatestReadingCard reading={latest} />
      <ReadingsList readings={readings} festivaler={festivaler} arrangorer={arrangorer} arrangementer={arrangementer} />
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <div><Label>{label}</Label>{children}<FieldError message={error} /></div>;
}

function MissingSetup({ message }: { message: string }) {
  return <Card className="p-6 sm:p-8"><Notice>{message}</Notice><Button asChild size="lg" className="mt-5 w-full sm:w-auto"><Link href="/innstillinger">Gå til Innstillinger</Link></Button></Card>;
}
