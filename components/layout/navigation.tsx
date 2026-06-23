"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMobileNavigation } from "@/hooks/use-mobile-navigation";
import { cn } from "@/lib/utils";
import { navigationItems } from "@/services/navigation-service";
import { canAccessPath } from "@/services/access-service";
import type { UserRole } from "@/types/user";

export function Navigation({ role }: { role: UserRole | null }) {
  const { isOpen, setIsOpen, pathname } = useMobileNavigation();
  const items = navigationItems.filter((item) => canAccessPath(role, item.href));

  return (
    <>
      <nav aria-label="Hovedmeny" className="hidden items-center gap-1 lg:flex">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className={cn("rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/[0.05] hover:text-foreground", pathname === item.href && "bg-white/[0.06] text-foreground")}>
            {item.label.replace(" avlesning", "")}
          </Link>
        ))}
      </nav>
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen} aria-controls="mobilmeny" aria-label={isOpen ? "Lukk meny" : "Åpne meny"}>
        {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </Button>
      {isOpen && (
        <div id="mobilmeny" className="absolute inset-x-4 top-[4.75rem] z-50 rounded-2xl border border-border bg-card/95 p-2 shadow-2xl backdrop-blur-xl lg:hidden">
          {items.map((item) => {
            const Icon = item.icon;
            return <Link key={item.href} href={item.href} className={cn("flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-white/[0.06] hover:text-foreground", pathname === item.href && "bg-white/[0.06] text-foreground")}><Icon className="size-4" />{item.label}</Link>;
          })}
        </div>
      )}
    </>
  );
}
