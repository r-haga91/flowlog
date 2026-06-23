import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";

type Assignment = { festival: string; arrangor: string; arrangement: string } | null;

export function ActiveAssignmentCard({ assignment }: { assignment: Assignment }) {
  return (
    <Card className="border-primary/20 bg-[linear-gradient(135deg,rgba(127,169,201,0.09),rgba(255,255,255,0.02))] p-5 sm:p-6">
      <div className="flex items-center gap-3"><span className="rounded-xl bg-primary/10 p-2.5 text-primary"><MapPin className="size-5" /></span><h2 className="text-lg font-semibold">Aktivt oppdrag</h2></div>
      {!assignment ? <p className="mt-5 text-sm text-muted-foreground">Ingen aktivt oppdrag valgt</p> : (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Info label="Festival" value={assignment.festival} />
          <Info label="Arrangør" value={assignment.arrangor} />
          <Info label="Arrangement" value={assignment.arrangement} />
        </div>
      )}
    </Card>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p><p className="mt-1 text-base font-semibold">{value}</p></div>;
}
