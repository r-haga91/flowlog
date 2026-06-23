"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useTheme, type ThemeMode } from "@/components/providers/theme-provider";
import { useToast } from "@/components/providers/toast-provider";
import { cn } from "@/lib/utils";

const choices: Array<{ value: ThemeMode; label: string; icon: typeof Moon }> = [
  { value: "dark", label: "Mørkt", icon: Moon },
  { value: "light", label: "Lyst", icon: Sun },
  { value: "system", label: "System", icon: Monitor },
];

export function ThemeSettings() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  function select(value: ThemeMode) {
    setTheme(value);
    toast("Tema oppdatert.");
  }
  return (
    <Card className="p-6 sm:p-8">
      <h2 className="text-xl font-semibold">Utseende</h2>
      <p className="mt-1 text-sm text-muted-foreground">Velg tema. Innstillingen huskes på denne enheten.</p>
      <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl bg-muted/60 p-1.5" role="radiogroup" aria-label="Tema">
        {choices.map(({ value, label, icon: Icon }) => (
          <button key={value} type="button" role="radio" aria-checked={theme === value} onClick={() => select(value)} className={cn("flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 text-sm font-medium transition", theme === value ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
            <Icon className="size-4" />{label}
          </button>
        ))}
      </div>
    </Card>
  );
}
