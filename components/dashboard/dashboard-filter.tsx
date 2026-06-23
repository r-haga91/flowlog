"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input, Label, Select } from "@/components/ui/form-controls";
import type { DashboardFilterInput } from "@/types/dashboard";
import type { SelectOption } from "@/types/common";
import { favoriteLabel, useFavoriteOptions } from "@/hooks/use-favorite-options";

type Props = {
  options: { festivaler: SelectOption[]; arrangorer: SelectOption[]; arrangementer: Array<SelectOption & { festivalId: number }> };
  filter: DashboardFilterInput;
  onChange: (filter: DashboardFilterInput) => void;
};

export function DashboardFilter({ options, filter, onChange }: Props) {
  const favoriteOptions = useFavoriteOptions(options.festivaler, options.arrangementer);
  const arrangements = useMemo(
    () => filter.festivalId === "alle" ? favoriteOptions.arrangementer : favoriteOptions.arrangementer.filter((item) => item.festivalId === Number(filter.festivalId)),
    [filter.festivalId, favoriteOptions.arrangementer],
  );
  const set = (key: keyof DashboardFilterInput, value: string) => onChange({ ...filter, [key]: value });

  return (
    <Card className="p-6 sm:p-8" aria-label="Dashboardfiltre">
      <div className="grid gap-5 md:grid-cols-3">
        <div><Label htmlFor="dashboard-festival">Festival</Label><Select id="dashboard-festival" value={filter.festivalId} onChange={(event) => onChange({ ...filter, festivalId: event.target.value, arrangementId: "alle" })}><option value="alle">Alle festivaler</option>{favoriteOptions.festivaler.map((item) => <option key={item.id} value={item.id}>{favoriteLabel(item.navn, favoriteOptions.favorites.festivaler.includes(item.id))}</option>)}</Select></div>
        <div><Label htmlFor="dashboard-arrangor">Arrangør</Label><Select id="dashboard-arrangor" value={filter.arrangorId} onChange={(event) => set("arrangorId", event.target.value)}><option value="alle">Alle arrangører</option>{options.arrangorer.map((item) => <option key={item.id} value={item.id}>{item.navn}</option>)}</Select></div>
        <div><Label htmlFor="dashboard-arrangement">Arrangement</Label><Select id="dashboard-arrangement" value={filter.arrangementId} onChange={(event) => set("arrangementId", event.target.value)}><option value="alle">Velg arrangement</option>{arrangements.map((item) => <option key={item.id} value={item.id}>{favoriteLabel(item.navn, favoriteOptions.favorites.arrangementer.includes(item.id))}</option>)}</Select></div>
      </div>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div><Label htmlFor="dashboard-fra">Fra dato</Label><Input id="dashboard-fra" type="date" value={filter.fra} onChange={(event) => set("fra", event.target.value)} required /></div>
        <div><Label htmlFor="dashboard-til">Til dato</Label><Input id="dashboard-til" type="date" value={filter.til} onChange={(event) => set("til", event.target.value)} required /></div>
      </div>
    </Card>
  );
}
