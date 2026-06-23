"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, GitCompareArrows } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label, Select } from "@/components/ui/form-controls";
import { formatDashboardNumber } from "@/services/dashboard-service";
import { compareHistoryGroups } from "@/services/history-service";
import type { HistorySummary } from "@/types/history";

type Props = { festivaler: HistorySummary[]; arrangementer: HistorySummary[] };

export function HistoryComparison({ festivaler, arrangementer }: Props) {
  const [mode, setMode] = useState<"festival" | "arrangement">("festival");
  const groups = mode === "festival" ? festivaler : arrangementer;
  const [aId, setAId] = useState(groups[0]?.id ?? "");
  const [bId, setBId] = useState(groups[1]?.id ?? "");
  useEffect(() => { setAId(groups[0]?.id ?? ""); setBId(groups[1]?.id ?? ""); }, [groups]);
  const comparison = useMemo(() => compareHistoryGroups(groups, aId, bId), [aId, bId, groups]);

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex items-center gap-3"><span className="rounded-xl bg-primary/10 p-2.5 text-primary"><GitCompareArrows className="size-5" /></span><div><h2 className="text-xl font-semibold">Sammenlign</h2><p className="mt-1 text-sm text-muted-foreground">Se forskjellen mellom to festivaler eller arrangementer.</p></div></div>
      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        <Field id="compare-type" label="Sammenligning"><Select id="compare-type" value={mode} onChange={(event) => setMode(event.target.value as typeof mode)}><option value="festival">Festivaler</option><option value="arrangement">Arrangementer</option></Select></Field>
        <Field id="compare-a" label={mode === "festival" ? "Festival A" : "Arrangement A"}><Select id="compare-a" value={aId} onChange={(event) => setAId(event.target.value)}>{groups.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</Select></Field>
        <Field id="compare-b" label={mode === "festival" ? "Festival B" : "Arrangement B"}><Select id="compare-b" value={bId} onChange={(event) => setBId(event.target.value)}>{groups.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</Select></Field>
      </div>
      {comparison ? <div className="mt-6 grid gap-4 rounded-2xl border border-border bg-white/[0.025] p-5 sm:grid-cols-[1fr_auto_1fr] sm:items-center"><Result label={comparison.a.label} value={comparison.a.totaltSolgt} /><ArrowUpRight className="hidden size-5 text-muted-foreground sm:block" /><Result label={comparison.b.label} value={comparison.b.totaltSolgt} /><div className="border-t border-border pt-4 sm:col-span-3"><p className="text-xs text-muted-foreground">Forskjell</p><p className={`mt-1 text-2xl font-semibold ${comparison.liter >= 0 ? "text-success" : "text-destructive"}`}>{signed(comparison.liter)} L <span className="ml-2 text-base">{comparison.prosent === null ? "–" : `${signed(comparison.prosent)} %`}</span></p></div></div> : <p className="mt-6 rounded-2xl border border-border p-5 text-sm text-muted-foreground">Velg to forskjellige alternativer for å sammenligne.</p>}
    </Card>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) { return <div><Label htmlFor={id}>{label}</Label>{children}</div>; }
function Result({ label, value }: { label: string; value: number }) { return <div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-1 text-xl font-semibold">{formatDashboardNumber(value)} L</p></div>; }
function signed(value: number) { return `${value > 0 ? "+" : ""}${formatDashboardNumber(value)}`; }
