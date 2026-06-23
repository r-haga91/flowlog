"use client";

import { Download, FileJson, ShieldCheck, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBackup, importBackup } from "@/app/actions/backup-actions";
import { BackupStatus } from "@/components/settings/backup-status";
import { useToast } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input, Label } from "@/components/ui/form-controls";
import { Notice } from "@/components/ui/notice";
import { backupSchema, type BackupFile, type BackupStatus as Status } from "@/types/backup";
import { collectBackupSettings, restoreLocalSettings, type BackupOptions } from "@/utils/backup-settings";
import { readMigratedStorage, storageKeys } from "@/utils/storage-keys";

const maxFileSize = 10 * 1024 * 1024;

export function BackupPanel({ status, options }: { status: Status; options: BackupOptions }) {
  const [lastExport, setLastExport] = useState("");
  const [backup, setBackup] = useState<BackupFile | null>(null);
  const [fileName, setFileName] = useState("");
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [working, setWorking] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => { const value = readMigratedStorage(storageKeys.sisteEksport); if (value) setLastExport(formatDateTime(value)); }, []);

  async function exportData() {
    setWorking(true); setNotice(null);
    const result = await createBackup(collectBackupSettings(options));
    setWorking(false);
    if (!result.success) return setNotice({ type: "error", message: result.message });
    downloadJson(result.data.backup, result.data.filnavn);
    localStorage.setItem(storageKeys.sisteEksport, result.data.backup.metadata.eksportertDato);
    setLastExport(formatDateTime(result.data.backup.metadata.eksportertDato));
    setNotice(null); toast(result.message);
  }

  async function selectFile(file?: File) {
    setBackup(null); setFileName(""); setNotice(null);
    if (!file) return;
    if (file.size > maxFileSize) return setNotice({ type: "error", message: "Backupfilen er for stor." });
    try {
      const parsed = backupSchema.safeParse(JSON.parse(await file.text()));
      if (!parsed.success) return setNotice({ type: "error", message: "Filen er ikke en gyldig FlowLog-backup." });
      setBackup(parsed.data); setFileName(file.name);
      setNotice({ type: "success", message: "Backupfilen er validert og klar for import." });
    } catch {
      setNotice({ type: "error", message: "Filen inneholder ikke gyldig JSON." });
    }
  }

  async function confirmImport() {
    if (!backup) return;
    setWorking(true); setNotice(null);
    const result = await importBackup(backup);
    setWorking(false); setDialogOpen(false);
    if (!result.success) return setNotice({ type: "error", message: result.message });
    restoreLocalSettings(result.data.lokaleInnstillinger);
    setBackup(null); setFileName("");
    setNotice(null); toast(`${result.message} ${result.data.avlesninger} avlesninger lagt til, ${result.data.hoppetOver} hoppet over.`);
    router.refresh();
  }

  return <div className="space-y-5">
    <BackupStatus status={status} lastExport={lastExport} />
    {notice && <Notice variant={notice.type}>{notice.message}</Notice>}
    <div className="grid gap-5 lg:grid-cols-2">
      <Card className="flex flex-col p-6 sm:p-8"><span className="w-fit rounded-2xl bg-primary/10 p-3 text-primary"><Download className="size-6" /></span><h3 className="mt-5 text-xl font-semibold">Eksporter data</h3><p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">Lagre festivaler, arrangører, arrangementer, avlesninger og lokale innstillinger i én JSON-fil.</p><Button size="lg" className="mt-6 w-full" onClick={exportData} disabled={working}><FileJson className="size-5" />{working ? "Arbeider …" : "Eksporter backup"}</Button></Card>
      <Card className="flex flex-col p-6 sm:p-8"><span className="w-fit rounded-2xl bg-success/10 p-3 text-success"><Upload className="size-6" /></span><h3 className="mt-5 text-xl font-semibold">Importer data</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Importer additivt fra en FlowLog-backup. Eksisterende data slettes aldri.</p><div className="mt-5"><Label htmlFor="backup-file">Velg JSON-fil</Label><Input id="backup-file" type="file" accept="application/json,.json" onChange={(event) => void selectFile(event.target.files?.[0])} /></div>{fileName && <p className="mt-3 truncate text-sm text-muted-foreground">Valgt fil: {fileName}</p>}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}><DialogTrigger asChild><Button variant="secondary" size="lg" className="mt-6 w-full" disabled={!backup || working}><ShieldCheck className="size-5" />Importer backup</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Bekreft import</DialogTitle><DialogDescription>Importen legger til manglende data og sletter aldri eksisterende data.</DialogDescription></DialogHeader>{backup && <div className="rounded-2xl border border-border bg-white/[0.025] p-4 text-sm"><p><strong>{backup.metadata.antallAvlesninger}</strong> avlesninger i backupen</p><p className="mt-1 text-muted-foreground">Eksportert {formatDateTime(backup.metadata.eksportertDato)}</p></div>}<div className="mt-6 grid gap-3 sm:grid-cols-2"><DialogClose asChild><Button variant="secondary" size="lg">Avbryt</Button></DialogClose><Button size="lg" onClick={confirmImport} disabled={working}>{working ? "Importerer …" : "Bekreft import"}</Button></div></DialogContent></Dialog>
      </Card>
    </div>
  </div>;
}

function downloadJson(backup: BackupFile, filename: string) { const url = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" })); const link = document.createElement("a"); link.href = url; link.download = filename; document.body.appendChild(link); link.click(); link.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 1_000); }
function formatDateTime(value: string) { return new Intl.DateTimeFormat("nb-NO", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); }
