import { CalendarDays, Gauge, MapPin, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatDashboardNumber } from "@/services/dashboard-service";
import type { HistoryData, HistoryPeriod, HistorySummary } from "@/types/history";

type Props = Pick<HistoryData, "toppFestivaler" | "toppArrangementer" | "toppDager" | "toppPerioder">;

export function HistoryLeaderboards(props: Props) {
  return <section><div className="mb-5"><h2 className="text-xl font-semibold">Topplister</h2><p className="mt-1 text-sm text-muted-foreground">De sterkeste resultatene i valgt filter.</p></div><div className="grid gap-5 lg:grid-cols-2">
    <RankingCard title="Topp 5 festivaler" icon={MapPin} items={toRows(props.toppFestivaler, "L")} />
    <RankingCard title="Topp 5 arrangementer" icon={Trophy} items={toRows(props.toppArrangementer, "L")} />
    <RankingCard title="Topp 5 dager" icon={CalendarDays} items={periodRows(props.toppDager, "L")} />
    <RankingCard title="Topp 5 perioder med høyest liter/time" icon={Gauge} items={periodRows(props.toppPerioder, "L/t")} />
  </div></section>;
}

function RankingCard({ title, icon: Icon, items }: { title: string; icon: typeof Trophy; items: Array<{ id: string; label: string; detail: string; value: string }> }) {
  return <Card className="p-6"><div className="flex items-center gap-3"><span className="rounded-xl bg-primary/10 p-2.5 text-primary"><Icon className="size-5" /></span><h3 className="font-semibold">{title}</h3></div><ol className="mt-5 space-y-3">{items.map((item, index) => <li key={item.id} className="flex items-center gap-4 rounded-2xl bg-white/[0.025] p-4"><span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/[0.05] text-sm font-semibold">{index + 1}</span><div className="min-w-0 flex-1"><p className="truncate font-medium">{item.label}</p>{item.detail && <p className="mt-0.5 truncate text-xs text-muted-foreground">{item.detail}</p>}</div><p className="shrink-0 font-semibold">{item.value}</p></li>)}{!items.length && <li className="text-sm text-muted-foreground">Ikke nok data.</li>}</ol></Card>;
}
function toRows(items: HistorySummary[], suffix: string) { return items.map((item) => ({ id: item.id, label: item.label, detail: `${item.antall} avlesninger`, value: `${formatDashboardNumber(item.totaltSolgt)} ${suffix}` })); }
function periodRows(items: HistoryPeriod[], suffix: string) { return items.map((item) => ({ id: item.id, label: item.label, detail: item.detail, value: `${formatDashboardNumber(item.verdi)} ${suffix}` })); }
