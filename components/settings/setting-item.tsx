import { Star } from "lucide-react";
import { DeleteSettingDialog } from "@/components/settings/delete-setting-dialog";
import { EditSettingDialog } from "@/components/settings/edit-setting-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SelectOption, SettingKind } from "@/types/common";

type Props = { id: number; navn: string; kind: SettingKind; detail?: string; festivalId?: number; festivaler?: SelectOption[]; favorite?: boolean; onFavorite?: () => void; onChanged: (message: string) => void };

export function SettingItem({ id, navn, kind, detail, festivalId, festivaler, favorite, onFavorite, onChanged }: Props) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-white/[0.025] py-2 pl-4 pr-2 text-sm">
      <div className="min-w-0"><p className="truncate font-medium">{navn}</p>{detail && <p className="mt-0.5 truncate text-xs text-muted-foreground">{detail}</p>}</div>
      <div className="flex shrink-0">
        {onFavorite && <Button type="button" variant="ghost" size="icon" onClick={onFavorite} aria-label={favorite ? `Fjern ${navn} fra favoritter` : `Merk ${navn} som favoritt`}><Star className={cn("size-4", favorite && "fill-current text-amber-400")} /></Button>}
        <EditSettingDialog id={id} navn={navn} kind={kind} festivalId={festivalId} festivaler={festivaler} onSaved={onChanged} /><DeleteSettingDialog id={id} navn={navn} kind={kind} onDeleted={onChanged} />
      </div>
    </div>
  );
}
