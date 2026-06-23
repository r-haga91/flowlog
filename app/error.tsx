"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <Card className="mx-auto max-w-2xl p-8 text-center sm:p-12"><span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive"><AlertTriangle className="size-6" /></span><h1 className="mt-6 text-2xl font-semibold">Noe gikk galt</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">Vi klarte ikke å vise siden. Dataene dine er ikke endret.</p><div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><Button size="lg" onClick={reset}>Prøv igjen</Button><Button asChild size="lg" variant="secondary"><Link href="/">Gå til startsiden</Link></Button></div></Card>;
}
