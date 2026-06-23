import { Card } from "@/components/ui/card";
import { formatDashboardNumber } from "@/services/dashboard-service";
import type { HistorySummary } from "@/types/history";

export function HistoryOverview({ festivaler, arrangementer }: { festivaler: HistorySummary[]; arrangementer: HistorySummary[] }) {
  return <section><div className="mb-5"><h2 className="text-xl font-semibold">Historikkoversikt</h2><p className="mt-1 text-sm text-muted-foreground">Alle festivaler og arrangementer i valgt filter.</p></div><div className="grid gap-5 xl:grid-cols-2"><Overview title="Festivaler" items={festivaler} /><Overview title="Arrangementer" items={arrangementer} /></div></section>;
}

function Overview({ title, items }: { title: string; items: HistorySummary[] }) {
  return <Card className="overflow-hidden"><div className="p-6"><h3 className="font-semibold">{title}</h3></div><div className="space-y-3 px-5 pb-5 md:hidden">{items.map((item) => <article key={item.id} className="rounded-2xl bg-white/[0.025] p-4"><div className="flex items-start justify-between gap-4"><div><p className="font-medium">{item.label}</p><p className="mt-1 text-xs text-muted-foreground">{item.antall} avlesninger</p></div><p className="shrink-0 font-semibold">{formatDashboardNumber(item.totaltSolgt)} L</p></div></article>)}</div><div className="hidden md:block"><table className="w-full text-left text-sm"><thead className="bg-white/[0.03] text-xs text-muted-foreground"><tr><th className="px-6 py-4 font-medium">Navn</th><th className="px-6 py-4 font-medium">Avlesninger</th><th className="px-6 py-4 text-right font-medium">Totalt solgt</th></tr></thead><tbody className="divide-y divide-border">{items.map((item) => <tr key={item.id}><td className="px-6 py-4 font-medium">{item.label}</td><td className="px-6 py-4 text-muted-foreground">{item.antall}</td><td className="px-6 py-4 text-right font-semibold">{formatDashboardNumber(item.totaltSolgt)} L</td></tr>)}</tbody></table></div></Card>;
}
