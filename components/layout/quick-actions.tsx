"use client";

import { FileText, History, Radio, SquarePen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { canAccessPath } from "@/services/access-service";
import type { UserRole } from "@/types/user";

const actions = [
  { label: "Ny avlesning", short: "Ny", href: "/registrering", icon: SquarePen },
  { label: "Dokumentasjon", short: "Dok.", href: "/dokumentasjon", icon: FileText },
  { label: "Live Festival", short: "Live", href: "/live-festival", icon: Radio },
  { label: "Historikk", short: "Historikk", href: "/historikk", icon: History },
];

export function QuickActions({ role }: { role: UserRole | null }) {
  const pathname = usePathname();
  const visible = actions.filter((item) => canAccessPath(role, item.href));
  return <nav aria-label="Hurtighandlinger" className="no-print fixed inset-x-3 bottom-3 z-40 mx-auto flex max-w-xl items-center justify-around rounded-2xl border border-border bg-card/90 p-2 shadow-2xl backdrop-blur-xl sm:bottom-5">{visible.map(({ label, short, href, icon: Icon }) => <Link key={href} href={href} aria-label={label} className={cn("flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground sm:flex-row sm:justify-center sm:gap-2 sm:text-sm", pathname === href && "bg-primary/10 text-primary")}><Icon className="size-4 shrink-0" /><span className="sm:hidden">{short}</span><span className="hidden sm:inline">{label}</span></Link>)}</nav>;
}
