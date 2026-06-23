import { CheckCircle2, CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export function Notice({ children, variant = "info" }: { children: React.ReactNode; variant?: "success" | "error" | "info" }) {
  const Icon = variant === "success" ? CheckCircle2 : CircleAlert;
  return (
    <div role={variant === "error" ? "alert" : "status"} className={cn("flex items-start gap-3 rounded-2xl border p-4 text-sm", variant === "success" && "border-success/25 bg-success/10 text-success", variant === "error" && "border-destructive/25 bg-destructive/10 text-red-300", variant === "info" && "border-primary/20 bg-primary/10 text-foreground")}>
      <Icon className="mt-0.5 size-5 shrink-0" />
      <span className="leading-6">{children}</span>
    </div>
  );
}
