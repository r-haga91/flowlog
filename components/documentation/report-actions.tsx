"use client";

import { Copy, Printer } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { formatDate } from "@/services/documentation-service";
import type { DocumentationFilter, DocumentationLabels, ReadingSummary } from "@/types/documentation";

export function ReportActions({ filter, labels, summary }: { filter: DocumentationFilter; labels: DocumentationLabels; summary: ReadingSummary }) {
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  async function copy() {
    const text = [
      `Festival: ${labels.festival}`,
      `Arrangement: ${labels.arrangement}`,
      `Periode: ${formatDate(filter.fra)} - ${formatDate(filter.til)}`,
      `Startmåling: ${summary.startmaling} L`,
      `Sluttmåling: ${summary.sluttmaling} L`,
      `Totalt solgt: ${summary.totaltSolgt} L`,
      `Antall avlesninger: ${summary.antall}`,
    ].join("\n");
    try {
      await copyText(text);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }
  return (
    <div className="no-print flex flex-col gap-3 sm:flex-row sm:items-center">
      <Button variant="secondary" size="lg" onClick={copy}><Copy className="size-5" />Kopier sammendrag</Button>
      <Button variant="secondary" size="lg" onClick={() => window.print()}><Printer className="size-5" />Skriv ut</Button>
      {status === "success" && <Notice variant="success">Sammendrag kopiert.</Notice>}
      {status === "error" && <Notice variant="error">Kunne ikke kopiere sammendraget.</Notice>}
    </div>
  );
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return;
  } catch {
    const field = document.createElement("textarea");
    field.value = text;
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    const copied = document.execCommand("copy");
    field.remove();
    if (!copied) throw new Error("Kopiering ble avvist");
  }
}
