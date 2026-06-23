import { cn } from "@/lib/utils";

export function FlowMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={cn("size-6", className)}>
      <path d="M14 36V12h20M14 23h15" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 36c7-6 12-6 17-1 3 3 6 2 9-2" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="40" cy="33" r="2.5" fill="currentColor" />
    </svg>
  );
}
