"use client";

import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToastProvider } from "@/components/providers/toast-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <QueryProvider><ThemeProvider><ToastProvider>{children}</ToastProvider></ThemeProvider></QueryProvider>;
}
