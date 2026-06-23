"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({ className, children, ...props }: DialogPrimitive.DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="dialog-overlay fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
      <DialogPrimitive.Content className={cn("dialog-content fixed inset-x-4 top-1/2 z-50 mx-auto max-h-[90vh] max-w-lg -translate-y-1/2 overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl outline-none sm:p-8", className)} {...props}>
        {children}
        <DialogPrimitive.Close aria-label="Lukk" className="absolute right-5 top-5 rounded-xl p-2 text-muted-foreground transition hover:bg-white/[0.06] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <X className="size-5" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-6 pr-10", className)} {...props} />;
}

export function DialogTitle({ className, ...props }: DialogPrimitive.DialogTitleProps) {
  return <DialogPrimitive.Title className={cn("text-2xl font-semibold tracking-tight", className)} {...props} />;
}

export function DialogDescription({ className, ...props }: DialogPrimitive.DialogDescriptionProps) {
  return <DialogPrimitive.Description className={cn("mt-2 text-sm leading-6 text-muted-foreground", className)} {...props} />;
}
