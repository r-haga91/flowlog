import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionProps = { children: ReactNode; title?: string; description?: string; className?: string };

export function Section({ children, title, description, className }: SectionProps) {
  return (
    <section className={cn("py-8 sm:py-12", className)}>
      {(title || description) && (
        <div className="mb-6">
          {title && <h2 className="text-xl font-semibold tracking-tight">{title}</h2>}
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
}
