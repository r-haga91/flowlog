"use client";

import { History, LoaderCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState, useTransition } from "react";
import { loadHistory } from "@/app/actions/history-actions";
import { HistoryComparison } from "@/components/history/history-comparison";
import { HistoryFilter } from "@/components/history/history-filter";
import { HistoryKpis } from "@/components/history/history-kpis";
import { HistoryLeaderboards } from "@/components/history/history-leaderboards";
import { HistoryOverview } from "@/components/history/history-overview";
import { EmptyState } from "@/components/ui/empty-state";
import { Notice } from "@/components/ui/notice";
import type { SelectOption } from "@/types/common";
import type { HistoryData, HistoryFilterInput } from "@/types/history";

type Options = { festivaler: SelectOption[]; arrangorer: SelectOption[]; arrangementer: Array<SelectOption & { festivalId: number }>; years: number[] };
const HistoryCharts = dynamic(() => import("@/components/history/history-charts").then((module) => module.HistoryCharts), { loading: () => <div className="h-80 animate-pulse rounded-3xl bg-muted" aria-label="Laster grafer" /> });

export function HistoryView({ options }: { options: Options }) {
  const [filter, setFilter] = useState<HistoryFilterInput>({ festivalId: "alle", arrangorId: "alle", arrangementId: "alle", year: "alle", fra: "", til: "" });
  const [data, setData] = useState<HistoryData | null>(null);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const refresh = useCallback(() => startTransition(async () => {
    const result = await loadHistory(filter);
    if (result.success) { setData(result.data); setError(""); }
    else setError(result.message);
  }), [filter]);

  useEffect(() => { const timer = window.setTimeout(refresh, 250); return () => window.clearTimeout(timer); }, [refresh]);

  return <div className="space-y-8">
    <HistoryFilter options={options} filter={filter} onChange={setFilter} />
    {error && <Notice variant="error">{error}</Notice>}
    {pending && !data && <div className="flex items-center justify-center gap-3 py-16 text-sm text-muted-foreground"><LoaderCircle className="size-5 animate-spin" />Henter historikk …</div>}
    {!pending && !data && !error && <EmptyState icon={History} title="Ingen historikk funnet." description="Registrer avlesninger for å bygge historikk over festivaler og arrangementer." />}
    {data && <div className={`space-y-10 transition-opacity ${pending ? "opacity-70" : "opacity-100"}`}>
      <HistoryKpis metrics={data.metrics} />
      <HistoryCharts festivaler={data.festivaler} arrangementer={data.arrangementer} ar={data.ar} utvikling={data.utvikling} />
      <HistoryComparison festivaler={data.festivaler} arrangementer={data.arrangementer} />
      <HistoryLeaderboards toppFestivaler={data.toppFestivaler} toppArrangementer={data.toppArrangementer} toppDager={data.toppDager} toppPerioder={data.toppPerioder} />
      <HistoryOverview festivaler={data.festivaler} arrangementer={data.arrangementer} />
    </div>}
  </div>;
}
