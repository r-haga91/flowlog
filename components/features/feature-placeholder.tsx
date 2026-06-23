import type { LucideIcon } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";

type FeaturePlaceholderProps = { title: string; description: string; icon: LucideIcon; emptyTitle: string };

export function FeaturePlaceholder({ title, description, icon, emptyTitle }: FeaturePlaceholderProps) {
  return (
    <>
      <PageHeader eyebrow="FlowLog" title={title} description={description} />
      <Section className="animate-fade-up [animation-delay:100ms]">
        <EmptyState icon={icon} title={emptyTitle} description="Området er klargjort og får innhold i en kommende sprint." />
      </Section>
    </>
  );
}
