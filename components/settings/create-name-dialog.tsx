"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FieldError, Input, Label } from "@/components/ui/form-controls";
import { Notice } from "@/components/ui/notice";
import { nameSchema, type NameInput } from "@/types/settings";
import type { ActionResult } from "@/types/common";

type Props = {
  label: string;
  description: string;
  action: (input: NameInput) => Promise<ActionResult>;
  onCreated: (message: string) => void;
};

export function CreateNameDialog({ label, description, action, onCreated }: Props) {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState("");
  const router = useRouter();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<NameInput>({ resolver: zodResolver(nameSchema), defaultValues: { navn: "" } });

  async function submit(values: NameInput) {
    setServerError("");
    const result = await action(values);
    if (!result.success) return setServerError(result.message);
    reset();
    setOpen(false);
    onCreated(result.message);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button size="lg" className="w-full sm:w-auto"><Plus className="size-5" />Opprett {label.toLowerCase()}</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Opprett {label.toLowerCase()}</DialogTitle><DialogDescription>{description}</DialogDescription></DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-5">
          {serverError && <Notice variant="error">{serverError}</Notice>}
          <div><Label htmlFor={`${label}-navn`}>Navn</Label><Input id={`${label}-navn`} autoFocus autoComplete="off" {...register("navn")} /><FieldError message={errors.navn?.message} /></div>
          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>{isSubmitting ? "Lagrer …" : "Lagre"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
