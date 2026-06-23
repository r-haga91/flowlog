"use client";

import type { ReactNode } from "react";
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { Navigation } from "@/components/layout/navigation";
import { GlobalSearch } from "@/components/layout/global-search";
import { QuickActions } from "@/components/layout/quick-actions";
import Link from "next/link";
import type { UserRole } from "@/types/user";

export function AppShell({ children, role }: { children: ReactNode; role: UserRole | null }) {
  const pathname = usePathname();
  if (pathname === "/login") return <div className="min-h-screen bg-background text-foreground">{children}</div>;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div aria-hidden="true" className="app-background pointer-events-none fixed inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_50%_-10%,rgba(60,110,160,0.18),transparent_60%)]" />
      <header className="app-shell-header sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
        <div className="relative mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8"><Logo /><div className="flex items-center gap-2"><GlobalSearch /><Navigation role={role} /><form action={logout}><Button type="submit" variant="ghost" aria-label="Logg ut"><LogOut className="size-5" /><span className="hidden sm:inline">Logg ut</span></Button></form></div></div>
      </header>
      <main className="relative mx-auto max-w-7xl px-5 py-12 pb-32 sm:px-8 sm:py-16 sm:pb-36">{children}</main>
      <footer className="app-shell-footer relative mx-auto flex max-w-7xl flex-col gap-2 border-t border-border/60 px-5 py-8 pb-28 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:pb-28">
        <span>FlowLog · v1.0.1</span><Link href="/om" className="transition hover:text-foreground">Om FlowLog</Link>
      </footer>
      <QuickActions role={role} />
    </div>
  );
}
