import { cn } from "@/lib/utils";

type PageHeaderProps = { eyebrow?: string; title: string; description: string; className?: string };

export function PageHeader({ eyebrow, title, description, className }: PageHeaderProps) {
  return (
    <header className={cn("max-w-3xl animate-fade-up", className)}>
      {eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>}
      <h1 className="text-balance text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl">{title}</h1>
      <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
    </header>
  );
}
