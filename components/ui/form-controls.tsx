import * as React from "react";
import { cn } from "@/lib/utils";

const controlClass = "min-h-14 w-full rounded-xl border border-border bg-white/[0.04] px-4 text-base text-foreground outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => <input ref={ref} className={cn(controlClass, className)} {...props} />,
);
Input.displayName = "Input";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => <select ref={ref} className={cn(controlClass, "appearance-none", className)} {...props} />,
);
Select.displayName = "Select";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => <textarea ref={ref} className={cn(controlClass, "min-h-28 resize-none py-4", className)} {...props} />,
);
Textarea.displayName = "Textarea";

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("mb-2 block text-sm font-semibold text-foreground", className)} {...props} />;
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p role="alert" className="mt-2 text-sm text-destructive">{message}</p>;
}
