import { CalendarClock, CalendarDays, Database, Flag, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { BackupStatus as Status } from "@/types/backup";

export function BackupStatus({ status, lastExport }: { status: Status; lastExport: string }) {
  const items = [
    { label: "Festivaler", value: status.festivaler, icon: Flag },
    { label: "Arrangører", value: status.arrangorer, icon: Users },
    { label: "Arrangementer", value: status.arrangementer, icon: CalendarDays },
    { label: "Avlesninger", value: status.avlesninger, icon: Database },
  ];
  return <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{items.map(({ label, value, icon: Icon }) => <Card key={label} className="flex items-center gap-4 p-5"><span className="rounded-xl bg-primary/10 p-2.5 text-primary"><Icon className="size-5" /></span><div><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-semibold">{value}</p></div></Card>)}<Card className="flex items-center gap-4 p-5 sm:col-span-2 lg:col-span-4"><span className="rounded-xl bg-white/[0.05] p-2.5 text-muted-foreground"><CalendarClock className="size-5" /></span><div><p className="text-xs text-muted-foreground">Siste eksport</p><p className="mt-1 font-semibold">{lastExport || "Ingen eksport registrert"}</p></div></Card></div>;
}
