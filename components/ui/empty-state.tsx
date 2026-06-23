import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

type EmptyStateProps = { icon: LucideIcon; title: string; description: string };

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <Card className="flex min-h-80 flex-col items-center justify-center p-8 text-center">
      <span className="mb-5 rounded-2xl border border-border bg-white/[0.04] p-4 text-muted-foreground"><Icon className="size-7" /></span>
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
    </Card>
  );
}
