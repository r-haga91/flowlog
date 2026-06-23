import { Button } from "@/components/ui/button";

const comments = ["Startmåling", "Sluttmåling", "Kjørt frem øl", "Fatbytte", "Kontrollmåling", "Avvik"];

export function QuickComments({ onSelect }: { onSelect: (comment: string) => void }) {
  return (
    <div className="mt-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Hurtigkommentarer</p>
      <div className="flex flex-wrap gap-2">
        {comments.map((comment) => <Button key={comment} type="button" variant="secondary" size="sm" onClick={() => onSelect(comment)}>{comment}</Button>)}
      </div>
    </div>
  );
}
