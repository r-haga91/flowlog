"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { removeSetting } from "@/app/actions/settings-actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Notice } from "@/components/ui/notice";
import type { SettingKind } from "@/types/common";

export function DeleteSettingDialog({ id, navn, kind, onDeleted }: { id: number; navn: string; kind: SettingKind; onDeleted: (message: string) => void }) {
  const [open, setOpen] = useState(false);
  const [warning, setWarning] = useState(false);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  async function remove(force: boolean) {
    setDeleting(true); setError("");
    const result = await removeSetting(kind, id, force);
    setDeleting(false);
    if (result.requiresForce) return setWarning(true);
    if (!result.success) return setError(result.message);
    setOpen(false); onDeleted(result.message);
  }

  function changeOpen(next: boolean) { setOpen(next); if (!next) { setWarning(false); setError(""); } }

  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      <DialogTrigger asChild><Button variant="ghost" size="icon" className="text-red-300" aria-label={`Slett ${navn}`}><Trash2 className="size-4" /></Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Slett {navn}</DialogTitle><DialogDescription>{warning ? "Denne brukes av eksisterende avlesninger." : "Er du sikker på at du vil slette denne oppføringen?"}</DialogDescription></DialogHeader>
        {warning && <Notice variant="error">Denne brukes av eksisterende avlesninger.</Notice>}
        {error && <Notice variant="error">{error}</Notice>}
        <div className="mt-6 grid grid-cols-2 gap-3"><DialogClose asChild><Button variant="secondary" size="lg">Avbryt</Button></DialogClose><Button variant="destructive" size="lg" onClick={() => remove(warning)} disabled={deleting}>{deleting ? "Sletter …" : warning ? "Slett likevel" : "Slett"}</Button></div>
      </DialogContent>
    </Dialog>
  );
}
