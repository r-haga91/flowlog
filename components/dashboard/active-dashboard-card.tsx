import { CalendarDays, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/services/documentation-service";

type Props = { festival: string; arrangement: string; fra: string; til: string; selected: boolean };

export function ActiveDashboardCard({ festival, arrangement, fra, til, selected }: Props) {
  return (
    <Card className="relative overflow-hidden p-6 sm:p-8">
      <div className="absolute inset-y-0 left-0 w-1 bg-primary" />
      <p className="text-sm font-semibold text-primary">Aktivt oppdrag</p>
      {!selected ? <p className="mt-3 text-xl font-semibold">Velg et arrangement for å vise statistikk.</p> : (
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Info icon={MapPin} label="Festival" value={festival} />
          <Info icon={MapPin} label="Arrangement" value={arrangement} />
          <Info icon={CalendarDays} label="Periode" value={`${formatDate(fra)} – ${formatDate(til)}`} />
        </div>
      )}
    </Card>
  );
}

function Info({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return <div className="flex gap-3"><span className="mt-0.5 rounded-xl bg-white/[0.05] p-2 text-muted-foreground"><Icon className="size-4" /></span><div><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 font-semibold">{value}</p></div></div>;
}
