"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/components/providers/toast-provider";
import { DeleteReadingDialog } from "@/components/registration/delete-reading-dialog";
import { EditReadingDialog } from "@/components/registration/edit-reading-dialog";
import { Card } from "@/components/ui/card";
import type { ManagedReading } from "@/types/reading";
import type { SelectOption } from "@/types/common";

type Props = {
  readings: ManagedReading[];
  festivaler: SelectOption[];
  arrangorer: SelectOption[];
  arrangementer: Array<SelectOption & { festivalId: number }>;
};

export function ReadingsList({ readings, festivaler, arrangorer, arrangementer }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  function changed(nextMessage: string) { toast(nextMessage); router.refresh(); }

  return (
    <Card className="p-6 sm:p-8">
      <div className="mb-6"><h2 className="text-xl font-semibold">De 20 siste avlesningene</h2><p className="mt-1 text-sm text-muted-foreground">Rediger eller slett nylige registreringer.</p></div>
      {!readings.length ? <p className="text-sm text-muted-foreground">Ingen avlesninger er registrert ennå.</p> : (
        <div className="space-y-3">
          {readings.map((reading) => (
            <div key={reading.id} className="rounded-2xl border border-border/70 bg-white/[0.025] p-4 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="grid flex-1 grid-cols-2 gap-x-5 gap-y-3 lg:grid-cols-5">
                  <Info label="Dato" value={new Date(`${reading.dato}T00:00:00`).toLocaleDateString("nb-NO")} />
                  <Info label="Tid" value={reading.klokkeslett} />
                  <Info label="Festival" value={reading.festival} />
                  <Info label="Arrangement" value={reading.arrangement} />
                  <div><Info label="Målerstand" value={new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 3 }).format(reading.malerstand)} />{reading.rollover && <RolloverBadge />}</div>
                </div>
                <div className="flex gap-2"><EditReadingDialog reading={reading} festivaler={festivaler} arrangorer={arrangorer} arrangementer={arrangementer} onSaved={changed} /><DeleteReadingDialog id={reading.id} onDeleted={changed} /></div>
              </div>
              <div className="mt-4 border-t border-border/60 pt-3"><Info label="Kommentar" value={reading.kommentar || "Ingen kommentar"} /></div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function RolloverBadge() {
  return <span className="mt-2 inline-flex rounded-full bg-amber-400/10 px-2.5 py-1 text-xs font-semibold text-amber-200">Rollover</span>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p><p className="mt-1 text-sm font-medium">{value}</p></div>;
}
