"use client";

import { CirclePause, CirclePlay, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type Props = { paused: boolean; onPauseChange: () => void; onEnd: () => void };

export function LiveControls({ paused, onPauseChange, onEnd }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Button variant="secondary" size="lg" className="w-full" onClick={onPauseChange}>{paused ? <CirclePlay className="size-5" /> : <CirclePause className="size-5" />}{paused ? "Gjenoppta oppdrag" : "Pause oppdrag"}</Button>
      <Dialog>
        <DialogTrigger asChild><Button variant="destructive" size="lg" className="w-full"><Square className="size-5" />Avslutt oppdrag</Button></DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>Avslutt oppdrag</DialogTitle><DialogDescription>Er du sikker på at oppdraget skal avsluttes?</DialogDescription></DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2"><DialogClose asChild><Button variant="secondary" size="lg">Avbryt</Button></DialogClose><DialogClose asChild><Button variant="destructive" size="lg" onClick={onEnd}>Avslutt oppdrag</Button></DialogClose></div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
