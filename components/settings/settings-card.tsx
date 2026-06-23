import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

type Props = { title: string; description: string; icon: LucideIcon; items: ReactNode; hasItems: boolean; action: ReactNode; emptyText: string };

export function SettingsCard({ title, description, icon: Icon, items, hasItems, action, emptyText }: Props) {
  return (
    <Card className="flex flex-col p-6 sm:p-8">
      <div className="flex items-start gap-4"><span className="rounded-2xl bg-primary/10 p-3 text-primary"><Icon className="size-6" /></span><div><h2 className="text-xl font-semibold">{title}</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p></div></div>
      <div className="my-6 flex-1 space-y-2">
        {hasItems ? items : <p className="py-3 text-sm text-muted-foreground">{emptyText}</p>}
      </div>
      {action}
    </Card>
  );
}
