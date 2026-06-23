"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label, Select } from "@/components/ui/form-controls";
import type { DocumentationFilter } from "@/types/documentation";
import type { SelectOption } from "@/types/common";
import { favoriteLabel, useFavoriteOptions } from "@/hooks/use-favorite-options";

type Props = {
  festivaler: SelectOption[];
  arrangorer: SelectOption[];
  arrangementer: Array<SelectOption & { festivalId: number }>;
  filter: DocumentationFilter;
};

export function DocumentationFilter({ festivaler, arrangorer, arrangementer, filter }: Props) {
  const [festivalId, setFestivalId] = useState(filter.festivalId?.toString() ?? "alle");
  const [arrangementId, setArrangementId] = useState(filter.arrangementId?.toString() ?? "alle");
  const favoriteOptions = useFavoriteOptions(festivaler, arrangementer);
  const available = useMemo(() => festivalId === "alle" ? favoriteOptions.arrangementer : favoriteOptions.arrangementer.filter((item) => item.festivalId === Number(festivalId)), [favoriteOptions.arrangementer, festivalId]);
  return (
    <Card className="no-print p-6 sm:p-8">
      <form method="get" className="space-y-5">
        <div className="grid gap-5 md:grid-cols-3">
          <div><Label htmlFor="festivalId">Festival</Label><Select id="festivalId" name="festivalId" value={festivalId} onChange={(event) => { setFestivalId(event.target.value); setArrangementId("alle"); }}><option value="alle">Alle festivaler</option>{favoriteOptions.festivaler.map((item) => <option key={item.id} value={item.id}>{favoriteLabel(item.navn, favoriteOptions.favorites.festivaler.includes(item.id))}</option>)}</Select></div>
          <div><Label htmlFor="arrangorId">Arrangør</Label><Select id="arrangorId" name="arrangorId" defaultValue={filter.arrangorId?.toString() ?? "alle"}><option value="alle">Alle arrangører</option>{arrangorer.map((item) => <option key={item.id} value={item.id}>{item.navn}</option>)}</Select></div>
          <div><Label htmlFor="arrangementId">Arrangement</Label><Select id="arrangementId" name="arrangementId" value={arrangementId} onChange={(event) => setArrangementId(event.target.value)}><option value="alle">Alle arrangementer</option>{available.map((item) => <option key={item.id} value={item.id}>{favoriteLabel(item.navn, favoriteOptions.favorites.arrangementer.includes(item.id))}</option>)}</Select></div>
        </div>
        <div className="grid gap-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <div><Label htmlFor="fra">Fra dato</Label><Input id="fra" name="fra" type="date" defaultValue={filter.fra} required /></div>
          <div><Label htmlFor="til">Til dato</Label><Input id="til" name="til" type="date" defaultValue={filter.til} required /></div>
          <Button type="submit" size="lg" className="w-full sm:w-auto"><Search className="size-5" />Vis dokumentasjon</Button>
        </div>
      </form>
    </Card>
  );
}
