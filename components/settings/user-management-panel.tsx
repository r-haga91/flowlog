"use client";

import { KeyRound, ShieldCheck, UserX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deactivateUser, sendPasswordReset } from "@/app/actions/user-actions";
import { CreateUserDialog } from "@/components/settings/create-user-dialog";
import { EditUserDialog } from "@/components/settings/edit-user-dialog";
import { useToast } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Notice } from "@/components/ui/notice";
import { userLabels, type ManagedUser } from "@/types/user";

export function UserManagementPanel({ users, currentUserId }: { users: ManagedUser[]; currentUserId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  function changed(message: string) { toast(message); router.refresh(); }
  return (
    <section className="space-y-5 pt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="text-xl font-semibold">Brukere</h2><p className="mt-1 text-sm text-muted-foreground">Administrer roller og tilgang til FlowLog.</p></div><CreateUserDialog onSaved={changed} /></div>
      <div className="grid gap-4 lg:grid-cols-2">
        {users.map((user) => <UserCard key={user.authUserId} user={user} currentUserId={currentUserId} onChanged={changed} />)}
      </div>
      {!users.length && <Notice>Ingen brukere er opprettet.</Notice>}
    </section>
  );
}

function UserCard({ user, currentUserId, onChanged }: { user: ManagedUser; currentUserId: string; onChanged: (message: string) => void }) {
  const { toast } = useToast();
  const [resetting, setResetting] = useState(false);
  async function resetPassword() {
    setResetting(true);
    const result = await sendPasswordReset(user.email);
    setResetting(false);
    toast(result.message, result.success ? "success" : "error");
  }
  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4"><div className="min-w-0"><div className="flex items-center gap-2"><p className="truncate font-semibold">{user.name}</p>{user.authUserId === currentUserId && <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">Deg</span>}</div><p className="mt-1 truncate text-sm text-muted-foreground">{user.email}</p></div><span className={`rounded-full px-3 py-1 text-xs font-semibold ${user.isActive ? "bg-success/10 text-success" : "bg-destructive/10 text-red-300"}`}>{user.isActive ? "Aktiv" : "Inaktiv"}</span></div>
      <dl className="mt-5 grid grid-cols-2 gap-3 text-sm"><div><dt className="text-muted-foreground">Rolle</dt><dd className="mt-1 font-medium">{userLabels[user.role]}</dd></div><div><dt className="text-muted-foreground">Opprettet</dt><dd className="mt-1 font-medium">{new Date(user.createdAt).toLocaleDateString("nb-NO")}</dd></div></dl>
      <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4"><EditUserDialog user={user} currentUserId={currentUserId} onSaved={onChanged} /><Button variant="ghost" size="sm" onClick={resetPassword} disabled={resetting}><KeyRound className="size-4" />{resetting ? "Sender …" : "Passordreset"}</Button>{user.isActive && user.authUserId !== currentUserId && <DeactivateDialog user={user} onChanged={onChanged} />}{!user.isActive && <span className="inline-flex items-center gap-2 px-3 text-xs text-muted-foreground"><UserX className="size-4" />Tilgang deaktivert</span>}</div>
    </Card>
  );
}

function DeactivateDialog({ user, onChanged }: { user: ManagedUser; onChanged: (message: string) => void }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function deactivate() {
    setLoading(true);
    const result = await deactivateUser(user.authUserId);
    setLoading(false);
    if (!result.success) return setError(result.message);
    setOpen(false); onChanged(result.message);
  }
  return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button variant="ghost" size="sm" className="text-red-300"><UserX className="size-4" />Deaktiver</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Deaktiver {user.name}</DialogTitle><DialogDescription>Brukeren mister tilgang til FlowLog, men slettes ikke fra Supabase Auth.</DialogDescription></DialogHeader>{error && <Notice variant="error">{error}</Notice>}<div className="mt-6 grid grid-cols-2 gap-3"><DialogClose asChild><Button variant="secondary" size="lg">Avbryt</Button></DialogClose><Button variant="destructive" size="lg" onClick={deactivate} disabled={loading}><ShieldCheck className="size-4" />{loading ? "Deaktiverer …" : "Deaktiver"}</Button></div></DialogContent></Dialog>;
}
