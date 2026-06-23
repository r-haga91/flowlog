"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { loadLiveSnapshot, saveLiveReading } from "@/app/actions/live-festival-actions";
import { LiveAssignmentCard } from "@/components/live-festival/live-assignment-card";
import { LiveControls } from "@/components/live-festival/live-controls";
import { LiveReadingForm } from "@/components/live-festival/live-reading-form";
import { LiveReadingsList } from "@/components/live-festival/live-readings-list";
import { LiveStatus } from "@/components/live-festival/live-status";
import { StartAssignmentDialog } from "@/components/live-festival/start-assignment-dialog";
import { RolloverConfirmationDialog } from "@/components/registration/rollover-confirmation-dialog";
import { useToast } from "@/components/providers/toast-provider";
import { Notice } from "@/components/ui/notice";
import { formatDashboardNumber } from "@/services/dashboard-service";
import { formatTimeSince } from "@/services/live-festival-service";
import type { SelectOption } from "@/types/common";
import type { LiveAssignment, LiveSnapshot } from "@/types/live-festival";
import type { QuickReadingInput } from "@/types/reading";
import { clearLiveAssignment, loadLiveAssignment, saveLiveAssignment } from "@/utils/live-assignment";

type Options = { festivaler: SelectOption[]; arrangorer: SelectOption[]; arrangementer: Array<SelectOption & { festivalId: number }> };
const emptySnapshot: LiveSnapshot = { sisteMalerstand: null, sisteTidspunkt: null, sisteTid: null, antall: 0, totaltSolgt: 0, endring: null, rollover: false, readings: [] };

export function LiveFestivalView({ options }: { options: Options }) {
  const [assignment, setAssignment] = useState<LiveAssignment | null>(null);
  const [snapshot, setSnapshot] = useState(emptySnapshot);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [lastChange, setLastChange] = useState<number | null>(null);
  const [lastRollover, setLastRollover] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pendingRollover, setPendingRollover] = useState<{ reading: QuickReadingInput; previous: number } | null>(null);
  const [resetSignal, setResetSignal] = useState(0);
  const [clock, setClock] = useState(() => new Date());
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();
  const labels = useMemo(() => assignment ? resolveLabels(assignment, options) : null, [assignment, options]);

  useEffect(() => {
    const stored = loadLiveAssignment();
    if (!stored || !resolveLabels(stored, options)) { if (stored) clearLiveAssignment(); return; }
    setAssignment(stored);
    startTransition(async () => applySnapshot(await loadLiveSnapshot(stored), setSnapshot, setNotice));
  }, [options]);

  useEffect(() => { const timer = window.setInterval(() => setClock(new Date()), 30_000); return () => window.clearInterval(timer); }, []);

  function startAssignment(value: LiveAssignment) {
    saveLiveAssignment(value);
    setAssignment(value);
    setSnapshot(emptySnapshot);
    setLastChange(null);
    setLastRollover(false);
    setNotice(null);
    startTransition(async () => applySnapshot(await loadLiveSnapshot(value), setSnapshot, setNotice));
  }

  async function save(reading: QuickReadingInput) {
    if (!assignment) return false;
    setSaving(true);
    try {
      const result = await saveLiveReading({ assignment, reading });
      if (!result.success) {
        if (result.requiresForce && result.previousMalerstand !== undefined) {
          setPendingRollover({ reading, previous: result.previousMalerstand });
          return false;
        }
        setNotice({ type: "error", message: result.message });
        return false;
      }
      applySaved(result.snapshot, result.message);
      return true;
    } catch {
      setNotice({ type: "error", message: "Kunne ikke lagre avlesningen." });
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function confirmRollover() {
    if (!assignment || !pendingRollover) return;
    setSaving(true);
    try {
      const result = await saveLiveReading({ assignment, reading: pendingRollover.reading }, true);
      if (!result.success) return setNotice({ type: "error", message: result.message });
      setPendingRollover(null);
      applySaved(result.snapshot, result.message);
      setResetSignal((value) => value + 1);
    } catch {
      setNotice({ type: "error", message: "Kunne ikke lagre avlesningen." });
    } finally {
      setSaving(false);
    }
  }

  function applySaved(nextSnapshot: LiveSnapshot, message: string) {
    setSnapshot(nextSnapshot);
    setLastChange(nextSnapshot.endring);
    setLastRollover(nextSnapshot.rollover);
    setClock(new Date());
    setNotice(null);
    toast(message);
  }

  function togglePause() {
    if (!assignment) return;
    const updated = { ...assignment, paused: !assignment.paused };
    saveLiveAssignment(updated);
    setAssignment(updated);
    setNotice(null);
  }

  function endAssignment() { clearLiveAssignment(); setAssignment(null); setSnapshot(emptySnapshot); setLastChange(null); setLastRollover(false); setNotice(null); }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <LiveAssignmentCard assignment={labels ? { ...labels, dato: assignment!.dato, paused: assignment!.paused } : null} onChoose={() => setDialogOpen(true)} />
      <StartAssignmentDialog open={dialogOpen} onOpenChange={setDialogOpen} options={options} onStart={startAssignment} />
      <RolloverConfirmationDialog
        open={pendingRollover !== null}
        previous={pendingRollover?.previous ?? 0}
        current={Number(pendingRollover?.reading.malerstand ?? 0)}
        loading={saving}
        onCancel={() => setPendingRollover(null)}
        onConfirm={() => void confirmRollover()}
      />
      {assignment && labels && <>
        {notice && <Notice variant={notice.type}>{notice.message}</Notice>}
        {snapshot.antall === 1 && lastChange === null && <Notice variant="info">Første avlesning registrert</Notice>}
        {lastChange !== null && <Notice variant="info">{lastChange === 0 ? "Ingen endring" : `+${formatDashboardNumber(lastChange)} liter siden forrige avlesning${lastRollover ? " (rollover)" : ""}`}</Notice>}
        <LiveStatus snapshot={snapshot} timeSince={formatTimeSince(snapshot.sisteTidspunkt, clock)} paused={assignment.paused} />
        <LiveReadingForm paused={assignment.paused} saving={saving || pending} resetSignal={resetSignal} onSave={save} />
        <LiveControls paused={assignment.paused} onPauseChange={togglePause} onEnd={endAssignment} />
        <LiveReadingsList readings={snapshot.readings} />
      </>}
    </div>
  );
}

function resolveLabels(assignment: LiveAssignment, options: Options) {
  const festival = options.festivaler.find((item) => item.id === assignment.festivalId)?.navn;
  const arrangor = options.arrangorer.find((item) => item.id === assignment.arrangorId)?.navn;
  const arrangement = options.arrangementer.find((item) => item.id === assignment.arrangementId && item.festivalId === assignment.festivalId)?.navn;
  return festival && arrangor && arrangement ? { festival, arrangor, arrangement } : null;
}

function applySnapshot(result: Awaited<ReturnType<typeof loadLiveSnapshot>>, setSnapshot: (value: LiveSnapshot) => void, setNotice: (value: { type: "success" | "error"; message: string } | null) => void) {
  if (result.success) setSnapshot(result.snapshot); else setNotice({ type: "error", message: result.message });
}
