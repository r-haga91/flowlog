import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { FlowMark } from "@/components/brand/flow-mark";

export const metadata: Metadata = { title: "Logg inn" };

type SearchParams = Promise<{ grunn?: string }>;

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const reason = (await searchParams).grunn;
  return (
    <main className="relative flex min-h-screen items-center justify-center px-5 py-12">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(60,110,160,0.2),transparent_55%)]" />
      <section className="relative w-full max-w-md rounded-3xl border border-border bg-card/95 p-7 shadow-2xl backdrop-blur-xl sm:p-10">
        <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl border border-primary/25 bg-primary/10 text-primary"><FlowMark className="size-7" /></span><div><p className="text-xl font-semibold">FlowLog</p><p className="text-sm text-muted-foreground">Sikker tilgang</p></div></div>
        <h1 className="mt-9 text-3xl font-semibold tracking-tight">Logg inn</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Bruk kontoen du har fått av administrator.</p>
        <LoginForm initialError={reason === "deaktivert" ? "Brukeren er deaktivert. Kontakt administrator." : ""} />
      </section>
    </main>
  );
}
