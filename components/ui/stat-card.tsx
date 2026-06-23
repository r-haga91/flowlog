import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

type StatCardProps = { label: string; value: string; icon: LucideIcon };

export function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <Card className="flex items-center justify-between p-6">
      <div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-3xl font-semibold">{value}</p></div>
      <span className="rounded-2xl bg-primary/10 p-3 text-primary"><Icon className="size-5" /></span>
    </Card>
  );
}
