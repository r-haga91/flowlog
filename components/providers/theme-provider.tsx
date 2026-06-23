"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { readMigratedStorage, storageKeys } from "@/utils/storage-keys";

export type ThemeMode = "dark" | "light" | "system";
const storageKey = storageKeys.tema;
const ThemeContext = createContext<{ theme: ThemeMode; setTheme: (theme: ThemeMode) => void }>({ theme: "system", setTheme: () => undefined });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("system");
  useEffect(() => {
    const saved = readMigratedStorage(storageKey);
    const initial = saved === "dark" || saved === "light" || saved === "system" ? saved : "system";
    setThemeState(initial); applyTheme(initial);
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => { if ((localStorage.getItem(storageKey) ?? "system") === "system") applyTheme("system"); };
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  function setTheme(next: ThemeMode) { localStorage.setItem(storageKey, next); setThemeState(next); applyTheme(next); }
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() { return useContext(ThemeContext); }
function applyTheme(theme: ThemeMode) { const dark = theme === "dark" || theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches; document.documentElement.classList.toggle("dark", dark); document.documentElement.dataset.theme = dark ? "dark" : "light"; }
