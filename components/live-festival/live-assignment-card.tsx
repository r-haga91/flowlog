import { CalendarDays, CirclePause, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/services/documentation-service";

type Props = { assignment: { festival: string; arrangor: string; arrangement: string; dato: string; paused: boolean } | null; onChoose: () => void };

export function LiveAssignmentCard({ assignment, onChoose }: Props) {
  return (
    <Card className="relative overflow-hidden p-6 sm:p-8">
      <div className={`absolute inset-y-0 left-0 w-1 ${assignment?.paused ? "bg-amber-400" : "bg-success"}`} />
      <div className="flex items-center gap-3"><span className="rounded-xl bg-success/10 p-2.5 text-success">{assignment?.paused ? <CirclePause className="size-5 text-amber-300" /> : <Radio className="size-5" />}</span><div><p className="text-sm text-muted-foreground">Aktivt oppdrag</p><h2 className="text-xl font-semibold">{assignment ? assignment.paused ? "Oppdrag pauset" : "Oppdrag aktivt" : "Ingen aktive oppdrag"}</h2></div></div>
      {!assignment ? <Button size="lg" className="mt-6 w-full" onClick={onChoose}>Velg oppdrag</Button> : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Info label="Festival" value={assignment.festival} />
          <Info label="Arrangør" value={assignment.arrangor} />
          <Info label="Arrangement" value={assignment.arrangement} />
          <div><p className="text-xs text-muted-foreground">Dato</p><p className="mt-1 flex items-center gap-2 font-semibold"><CalendarDays className="size-4 text-primary" />{formatDate(assignment.dato)}</p></div>
        </div>
      )}
    </Card>
  );
}

function Info({ label, value }: { label: string; value: string }) { return <div><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 font-semibold">{value}</p></div>; }
