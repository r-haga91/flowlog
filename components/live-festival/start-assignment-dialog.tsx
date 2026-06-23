"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input, Label, Select } from "@/components/ui/form-controls";
import { Notice } from "@/components/ui/notice";
import type { SelectOption } from "@/types/common";
import type { LiveAssignment } from "@/types/live-festival";
import { favoriteLabel, useFavoriteOptions } from "@/hooks/use-favorite-options";

type Options = { festivaler: SelectOption[]; arrangorer: SelectOption[]; arrangementer: Array<SelectOption & { festivalId: number }> };
type Props = { open: boolean; onOpenChange: (open: boolean) => void; options: Options; onStart: (assignment: LiveAssignment) => void };

export function StartAssignmentDialog({ open, onOpenChange, options, onStart }: Props) {
  const [festivalId, setFestivalId] = useState(0);
  const [arrangorId, setArrangorId] = useState(0);
  const [arrangementId, setArrangementId] = useState(0);
  const [dato, setDato] = useState(today());
  const [error, setError] = useState("");
  const favoriteOptions = useFavoriteOptions(options.festivaler, options.arrangementer);
  const arrangements = useMemo(() => favoriteOptions.arrangementer.filter((item) => item.festivalId === festivalId), [festivalId, favoriteOptions.arrangementer]);

  function start() {
    if (!festivalId || !arrangorId || !arrangementId || !dato) return setError("Velg festival, arrangør, arrangement og dato.");
    setError("");
    onStart({ festivalId, arrangorId, arrangementId, dato, paused: false });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Start oppdrag</DialogTitle><DialogDescription>Velg hvor dagens avlesninger skal registreres.</DialogDescription></DialogHeader>
        <div className="space-y-5">
          {error && <Notice variant="error">{error}</Notice>}
          <Field id="live-festival" label="Festival"><Select id="live-festival" value={festivalId} onChange={(event) => { setFestivalId(Number(event.target.value)); setArrangementId(0); }}><option value={0}>Velg festival</option>{favoriteOptions.festivaler.map((item) => <option key={item.id} value={item.id}>{favoriteLabel(item.navn, favoriteOptions.favorites.festivaler.includes(item.id))}</option>)}</Select></Field>
          <Field id="live-arrangor" label="Arrangør"><Select id="live-arrangor" value={arrangorId} onChange={(event) => setArrangorId(Number(event.target.value))}><option value={0}>Velg arrangør</option>{options.arrangorer.map((item) => <option key={item.id} value={item.id}>{item.navn}</option>)}</Select></Field>
          <Field id="live-arrangement" label="Arrangement"><Select id="live-arrangement" value={arrangementId} disabled={!festivalId} onChange={(event) => setArrangementId(Number(event.target.value))}><option value={0}>{festivalId ? "Velg arrangement" : "Velg festival først"}</option>{arrangements.map((item) => <option key={item.id} value={item.id}>{favoriteLabel(item.navn, favoriteOptions.favorites.arrangementer.includes(item.id))}</option>)}</Select></Field>
          <Field id="live-dato" label="Dato"><Input id="live-dato" type="date" value={dato} onChange={(event) => setDato(event.target.value)} /></Field>
          <Button size="lg" className="w-full" onClick={start}>Start oppdrag</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) { return <div><Label htmlFor={id}>{label}</Label>{children}</div>; }
function today() { const now = new Date(); return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10); }
