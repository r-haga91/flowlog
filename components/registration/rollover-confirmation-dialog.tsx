"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Props = {
  open: boolean;
  previous: number;
  current: number;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const format = new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 3 });

export function RolloverConfirmationDialog({ open, previous, current, loading, onCancel, onConfirm }: Props) {
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen && !loading) onCancel(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bekreft lavere målerstand</DialogTitle>
          <DialogDescription>Målerstanden er lavere enn forrige avlesning for dette arrangementet. Dette kan skyldes rollover. Vil du lagre likevel?</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 rounded-2xl border border-border bg-white/[0.025] p-5 sm:grid-cols-2">
          <Value label="Forrige målerstand" value={`${format.format(previous)} L`} />
          <Value label="Ny målerstand" value={`${format.format(current)} L`} />
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button type="button" variant="secondary" size="lg" onClick={onCancel} disabled={loading}>Avbryt</Button>
          <Button type="button" size="lg" onClick={onConfirm} disabled={loading}>{loading ? "Lagrer …" : "Lagre likevel"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Value({ label, value }: { label: string; value: string }) {
  return <div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p><p className="mt-1 text-xl font-semibold">{value}</p></div>;
}
