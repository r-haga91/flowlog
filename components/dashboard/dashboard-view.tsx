"use client";

import { BarChart3, FileSearch, LoaderCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { loadDashboard } from "@/app/actions/dashboard-actions";
import { ActiveDashboardCard } from "@/components/dashboard/active-dashboard-card";
import { DashboardFilter } from "@/components/dashboard/dashboard-filter";
import { DashboardKpis } from "@/components/dashboard/dashboard-kpis";
import { DashboardLatestReadings } from "@/components/dashboard/dashboard-latest-readings";
import { DashboardStatusCard } from "@/components/dashboard/dashboard-status-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Notice } from "@/components/ui/notice";
import type { SelectOption } from "@/types/common";
import type { DashboardData, DashboardFilterInput } from "@/types/dashboard";

type Options = { festivaler: SelectOption[]; arrangorer: SelectOption[]; arrangementer: Array<SelectOption & { festivalId: number }> };
const DashboardCharts = dynamic(() => import("@/components/dashboard/dashboard-charts").then((module) => module.DashboardCharts), { loading: () => <div className="h-80 animate-pulse rounded-3xl bg-muted" aria-label="Laster grafer" /> });

export function DashboardView({ options, initialFilter }: { options: Options; initialFilter: DashboardFilterInput }) {
  const [filter, setFilter] = useState(initialFilter);
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const selected = filter.arrangementId !== "alle";
  const labels = useMemo(() => {
    const arrangement = options.arrangementer.find((item) => String(item.id) === filter.arrangementId);
    const festivalId = filter.festivalId === "alle" ? arrangement?.festivalId : Number(filter.festivalId);
    return {
      festival: options.festivaler.find((item) => item.id === festivalId)?.navn ?? "Alle festivaler",
      arrangement: arrangement?.navn ?? "",
    };
  }, [filter.arrangementId, filter.festivalId, options]);

  const refresh = useCallback(() => {
    if (!selected) return;
    startTransition(async () => {
      const result = await loadDashboard(filter);
      if (result.success) { setData(result.data); setError(""); }
      else setError(result.message);
    });
  }, [filter, selected]);

  useEffect(() => {
    if (!selected) { setData(null); setError(""); return; }
    const timer = window.setTimeout(refresh, 250);
    return () => window.clearTimeout(timer);
  }, [refresh, selected]);

  useEffect(() => {
    if (!selected) return;
    const interval = window.setInterval(refresh, 15_000);
    const onVisibility = () => { if (document.visibilityState === "visible") refresh(); };
    document.addEventListener("visibilitychange", onVisibility);
    return () => { window.clearInterval(interval); document.removeEventListener("visibilitychange", onVisibility); };
  }, [refresh, selected]);

  return (
    <div className="space-y-8">
      <DashboardFilter options={options} filter={filter} onChange={setFilter} />
      <ActiveDashboardCard {...labels} fra={filter.fra} til={filter.til} selected={selected} />
      {error && <Notice variant="error">{error}</Notice>}
      {isPending && selected && !data && <div className="flex items-center justify-center gap-3 py-16 text-sm text-muted-foreground"><LoaderCircle className="size-5 animate-spin" />Henter statistikk …</div>}
      {!selected && <EmptyState icon={BarChart3} title="Velg et arrangement for å vise statistikk." description="Bruk filtrene øverst for å åpne dashboardet for et aktivt oppdrag." />}
      {selected && !isPending && !data && !error && <EmptyState icon={FileSearch} title="Ingen avlesninger funnet for valgt periode." description="Juster perioden eller velg et annet arrangement." />}
      {data && <div className={isPending ? "space-y-8 opacity-70 transition-opacity" : "space-y-8 transition-opacity"}>
        <DashboardKpis metrics={data.metrics} />
        <DashboardStatusCard status={data.status} />
        <DashboardCharts malerstand={data.malerstandSerie} intervaller={data.intervallSerie} kumulativ={data.kumulativSerie} />
        <DashboardLatestReadings readings={data.sisteAvlesninger} />
      </div>}
    </div>
  );
}
