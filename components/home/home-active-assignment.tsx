"use client";

import { Radio } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import type { SelectOption } from "@/types/common";
import { loadLiveAssignment } from "@/utils/live-assignment";

type Options = {
  festivaler: SelectOption[];
  arrangorer: SelectOption[];
  arrangementer: Array<SelectOption & { festivalId: number }>;
};

export function HomeActiveAssignment({ options }: { options: Options }) {
  const [label, setLabel] = useState<{ festival: string; arrangement: string; paused: boolean } | null>(null);
  useEffect(() => {
    const assignment = loadLiveAssignment();
    if (!assignment) return;
    const festival = options.festivaler.find((item) => item.id === assignment.festivalId)?.navn;
    const arrangement = options.arrangementer.find((item) => item.id === assignment.arrangementId && item.festivalId === assignment.festivalId)?.navn;
    if (festival && arrangement && options.arrangorer.some((item) => item.id === assignment.arrangorId)) setLabel({ festival, arrangement, paused: assignment.paused });
  }, [options]);
  return (
    <Link href="/live-festival" className="group">
      <Card className="h-full animate-fade-up p-6 hover:-translate-y-0.5 hover:border-primary/25 sm:p-7">
        <div className="mb-7 flex items-center gap-3 text-sm font-medium text-muted-foreground"><span className="rounded-xl bg-success/10 p-2 text-success"><Radio className="size-4" /></span>Aktivt oppdrag</div>
        {label ? <><p className="text-xl font-semibold">{label.festival}</p><p className="mt-1 text-sm text-muted-foreground">{label.arrangement}{label.paused ? " · pauset" : " · aktivt"}</p></> : <><p className="font-semibold">Ingen aktivt oppdrag</p><p className="mt-1 text-sm text-muted-foreground group-hover:text-foreground">Åpne Live Festival</p></>}
      </Card>
    </Link>
  );
}
