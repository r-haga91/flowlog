import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { NavigationItem } from "@/types/navigation";

export function ActionCard({ item, featured = false, index }: { item: NavigationItem; featured?: boolean; index: number }) {
  const Icon = item.icon;
  return (
    <Link href={item.href} className={featured ? "md:col-span-2" : ""} style={{ animationDelay: `${90 + index * 55}ms` }}>
      <Card className="group flex h-full min-h-56 animate-fade-up flex-col justify-between overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-white/[0.055] sm:p-8">
        <div className="flex items-start justify-between">
          <span className="rounded-2xl border border-border bg-white/[0.04] p-3.5 text-primary transition-colors group-hover:bg-primary/10"><Icon className="size-6" /></span>
          <ArrowUpRight className="size-5 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
        </div>
        <div className="mt-10">
          <h2 className="text-xl font-semibold tracking-[-0.025em] sm:text-2xl">{item.label}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
        </div>
      </Card>
    </Link>
  );
}
