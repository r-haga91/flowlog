import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return <div aria-label="Laster innhold" aria-busy="true"><Skeleton className="h-4 w-24" /><Skeleton className="mt-5 h-12 max-w-xl" /><Skeleton className="mt-4 h-6 max-w-2xl" /><div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{[1, 2, 3].map((item) => <Card key={item} className="p-7"><Skeleton className="size-11" /><Skeleton className="mt-12 h-7 w-2/3" /><Skeleton className="mt-3 h-4 w-full" /></Card>)}</div><span className="sr-only">Laster …</span></div>;
}
