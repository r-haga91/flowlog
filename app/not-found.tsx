import { MapPinOff } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
  return <Card className="mx-auto flex min-h-96 max-w-2xl flex-col items-center justify-center p-8 text-center"><span className="rounded-2xl bg-primary/10 p-4 text-primary"><MapPinOff className="size-7" /></span><h1 className="mt-6 text-3xl font-semibold">Siden finnes ikke</h1><p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">Adressen kan være feil, eller siden kan ha blitt flyttet.</p><Button asChild size="lg" className="mt-7"><Link href="/">Gå til startsiden</Link></Button></Card>;
}
