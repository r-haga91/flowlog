"use client";

import { CheckCircle2, CircleAlert, X } from "lucide-react";
import { createContext, useCallback, useContext, useState } from "react";
import { cn } from "@/lib/utils";

type Toast = { id: number; message: string; variant: "success" | "error" | "info" };
const ToastContext = createContext<{ toast: (message: string, variant?: Toast["variant"]) => void }>({ toast: () => undefined });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const dismiss = useCallback((id: number) => setToasts((items) => items.filter((item) => item.id !== id)), []);
  const toast = useCallback((message: string, variant: Toast["variant"] = "success") => {
    const id = Date.now() + Math.random();
    setToasts((items) => [...items.slice(-2), { id, message, variant }]);
    window.setTimeout(() => dismiss(id), 4_000);
  }, [dismiss]);
  return <ToastContext.Provider value={{ toast }}>{children}<div className="fixed inset-x-4 top-24 z-[80] flex flex-col items-end gap-3 sm:left-auto sm:w-96" aria-live="polite">{toasts.map((item) => { const Icon = item.variant === "success" ? CheckCircle2 : CircleAlert; return <div key={item.id} role={item.variant === "error" ? "alert" : "status"} className={cn("flex w-full animate-toast-in items-center gap-3 rounded-2xl border bg-card/95 p-4 shadow-2xl backdrop-blur-xl", item.variant === "success" && "border-success/25", item.variant === "error" && "border-destructive/30")}><Icon className={cn("size-5 shrink-0", item.variant === "success" ? "text-success" : item.variant === "error" ? "text-destructive" : "text-primary")} /><p className="flex-1 text-sm font-medium">{item.message}</p><button onClick={() => dismiss(item.id)} aria-label="Lukk varsel" className="rounded-lg p-1 text-muted-foreground hover:bg-muted"><X className="size-4" /></button></div>; })}</div></ToastContext.Provider>;
}

export function useToast() { return useContext(ToastContext); }
