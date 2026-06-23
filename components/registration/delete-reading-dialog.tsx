"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { removeReadingAction } from "@/app/actions/reading-actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Notice } from "@/components/ui/notice";

export function DeleteReadingDialog({ id, onDeleted }: { id: number; onDeleted: (message: string) => void }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  async function remove() {
    setDeleting(true);
    setError("");
    const result = await removeReadingAction(id);
    setDeleting(false);
    if (!result.success) return setError(result.message);
    setOpen(false);
    onDeleted(result.message);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button variant="ghost" size="sm" className="text-red-300 hover:text-red-200"><Trash2 className="size-4" />Slett</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Slett avlesning</DialogTitle><DialogDescription>Er du sikker på at du vil slette denne avlesningen?</DialogDescription></DialogHeader>
        {error && <Notice variant="error">{error}</Notice>}
        <div className="mt-6 grid grid-cols-2 gap-3"><DialogClose asChild><Button variant="secondary" size="lg">Avbryt</Button></DialogClose><Button variant="destructive" size="lg" onClick={remove} disabled={deleting}>{deleting ? "Sletter …" : "Slett"}</Button></div>
      </DialogContent>
    </Dialog>
  );
}
