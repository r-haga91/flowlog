import Link from "next/link";
import { FlowMark } from "@/components/brand/flow-mark";

export function Logo() {
  return (
    <Link href="/" className="group inline-flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
      <span className="grid size-10 place-items-center rounded-xl border border-primary/25 bg-primary/10 text-primary transition-transform duration-300 group-hover:-translate-y-0.5">
        <FlowMark className="size-6" />
      </span>
      <span className="text-lg font-semibold tracking-[-0.04em]">FlowLog</span>
    </Link>
  );
}
