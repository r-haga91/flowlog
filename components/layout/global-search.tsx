"use client";

import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Database, Flag, Search, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { globalSearch } from "@/app/actions/search-actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/form-controls";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { SearchResult } from "@/types/search";

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const query = useDebouncedValue(term);
  const results = useQuery({ queryKey: ["global-search", query], queryFn: () => globalSearch(query), enabled: Boolean(query), staleTime: 60_000 });
  useEffect(() => { const keyboard = (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setOpen(true); } }; window.addEventListener("keydown", keyboard); return () => window.removeEventListener("keydown", keyboard); }, []);
  return <><Button variant="secondary" className="hidden min-w-36 justify-between xl:flex" onClick={() => setOpen(true)}><span className="flex items-center gap-2"><Search className="size-4" />Søk</span><kbd className="text-xs text-muted-foreground">⌘K</kbd></Button><Button variant="ghost" size="icon" className="xl:hidden" aria-label="Søk" onClick={() => setOpen(true)}><Search className="size-5" /></Button><Dialog open={open} onOpenChange={setOpen}><DialogContent className="top-[12%] translate-y-0"><DialogHeader><DialogTitle>Søk i FlowLog</DialogTitle><DialogDescription>Søk etter festival, arrangør, arrangement, kommentar, dato eller målerstand.</DialogDescription></DialogHeader><Input autoFocus value={term} onChange={(event) => setTerm(event.target.value)} placeholder="Skriv for å søke …" className="h-14" />
    <div className="mt-4 max-h-[50vh] space-y-2 overflow-y-auto">{results.isFetching && <SearchSkeleton />}{!results.isFetching && query && !results.data?.length && <p className="rounded-2xl border border-border p-5 text-center text-sm text-muted-foreground">Ingen resultater funnet.</p>}{results.data?.map((item) => <Result key={item.id} item={item} onSelect={() => { setOpen(false); setTerm(""); }} />)}{!query && <p className="py-8 text-center text-sm text-muted-foreground">Resultatene vises mens du skriver.</p>}</div>
  </DialogContent></Dialog></>;
}

function Result({ item, onSelect }: { item: SearchResult; onSelect: () => void }) { const Icon = item.type === "Festival" ? Flag : item.type === "Arrangør" ? Users : item.type === "Arrangement" ? CalendarDays : Database; return <Link href={item.href} onClick={onSelect} className="flex items-center gap-4 rounded-2xl border border-border/70 p-4 transition hover:border-primary/30 hover:bg-muted/50"><span className="rounded-xl bg-primary/10 p-2.5 text-primary"><Icon className="size-4" /></span><div className="min-w-0"><p className="truncate font-medium">{item.title}</p><p className="mt-0.5 truncate text-xs text-muted-foreground">{item.type} · {item.subtitle}</p></div></Link>; }
function SearchSkeleton() { return <div className="space-y-2">{[1, 2, 3].map((item) => <div key={item} className="h-16 animate-pulse rounded-2xl bg-muted" />)}</div>; }
