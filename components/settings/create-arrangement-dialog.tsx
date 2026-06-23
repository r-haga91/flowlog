"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { addArrangement } from "@/app/actions/settings-actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FieldError, Input, Label, Select } from "@/components/ui/form-controls";
import { Notice } from "@/components/ui/notice";
import { arrangementSchema, type ArrangementInput } from "@/types/settings";
import type { SelectOption } from "@/types/common";

export function CreateArrangementDialog({ festivaler, onCreated }: { festivaler: SelectOption[]; onCreated: (message: string) => void }) {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState("");
  const router = useRouter();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ArrangementInput>({ resolver: zodResolver(arrangementSchema), defaultValues: { navn: "", festivalId: 0 } });

  async function submit(values: ArrangementInput) {
    setServerError("");
    const result = await addArrangement(values);
    if (!result.success) return setServerError(result.message);
    reset();
    setOpen(false);
    onCreated(result.message);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button size="lg" className="w-full sm:w-auto" disabled={!festivaler.length}><Plus className="size-5" />Opprett arrangement</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Opprett arrangement</DialogTitle><DialogDescription>Koble arrangementet til festivalen det tilhører.</DialogDescription></DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-5">
          {serverError && <Notice variant="error">{serverError}</Notice>}
          <div><Label htmlFor="arrangement-festival">Festival</Label><Select id="arrangement-festival" {...register("festivalId")}><option value={0}>Velg festival</option>{festivaler.map((item) => <option key={item.id} value={item.id}>{item.navn}</option>)}</Select><FieldError message={errors.festivalId?.message} /></div>
          <div><Label htmlFor="arrangement-navn">Navn</Label><Input id="arrangement-navn" autoComplete="off" {...register("navn")} /><FieldError message={errors.navn?.message} /></div>
          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>{isSubmitting ? "Lagrer …" : "Lagre"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
