"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input, Label, Select } from "@/components/ui/form-controls";
import type { SelectOption } from "@/types/common";
import type { HistoryFilterInput } from "@/types/history";
import { favoriteLabel, useFavoriteOptions } from "@/hooks/use-favorite-options";

type Options = { festivaler: SelectOption[]; arrangorer: SelectOption[]; arrangementer: Array<SelectOption & { festivalId: number }>; years: number[] };
type Props = { options: Options; filter: HistoryFilterInput; onChange: (filter: HistoryFilterInput) => void };

export function HistoryFilter({ options, filter, onChange }: Props) {
  const favoriteOptions = useFavoriteOptions(options.festivaler, options.arrangementer);
  const arrangements = useMemo(() => filter.festivalId === "alle" ? favoriteOptions.arrangementer : favoriteOptions.arrangementer.filter((item) => item.festivalId === Number(filter.festivalId)), [filter.festivalId, favoriteOptions.arrangementer]);
  const set = (key: keyof HistoryFilterInput, value: string) => onChange({ ...filter, [key]: value });
  return (
    <Card className="p-6 sm:p-8" aria-label="Historikkfiltre">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Field id="history-festival" label="Festival"><Select id="history-festival" value={filter.festivalId} onChange={(event) => onChange({ ...filter, festivalId: event.target.value, arrangementId: "alle" })}><option value="alle">Alle festivaler</option>{favoriteOptions.festivaler.map((item) => <option key={item.id} value={item.id}>{favoriteLabel(item.navn, favoriteOptions.favorites.festivaler.includes(item.id))}</option>)}</Select></Field>
        <Field id="history-arrangor" label="Arrangør"><Select id="history-arrangor" value={filter.arrangorId} onChange={(event) => set("arrangorId", event.target.value)}><option value="alle">Alle arrangører</option>{options.arrangorer.map((item) => <option key={item.id} value={item.id}>{item.navn}</option>)}</Select></Field>
        <Field id="history-arrangement" label="Arrangement"><Select id="history-arrangement" value={filter.arrangementId} onChange={(event) => set("arrangementId", event.target.value)}><option value="alle">Alle arrangementer</option>{arrangements.map((item) => <option key={item.id} value={item.id}>{favoriteLabel(item.navn, favoriteOptions.favorites.arrangementer.includes(item.id))}</option>)}</Select></Field>
        <Field id="history-year" label="År"><Select id="history-year" value={filter.year} onChange={(event) => set("year", event.target.value)}><option value="alle">Alle år</option>{options.years.map((year) => <option key={year} value={year}>{year}</option>)}</Select></Field>
      </div>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Field id="history-fra" label="Fra dato"><Input id="history-fra" type="date" value={filter.fra} onChange={(event) => set("fra", event.target.value)} /></Field>
        <Field id="history-til" label="Til dato"><Input id="history-til" type="date" value={filter.til} onChange={(event) => set("til", event.target.value)} /></Field>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">Tomme datofelt betyr alle datoer.</p>
    </Card>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) { return <div><Label htmlFor={id}>{label}</Label>{children}</div>; }
