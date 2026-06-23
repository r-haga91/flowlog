import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { userRoleSchema, type UserRole } from "@/types/user";

export async function requireUser() {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Ikke autorisert.");
  const profile = await getOrBootstrapProfile(user.id, user.email ?? "", user.user_metadata?.name);
  if (!profile?.isActive) throw new Error("Brukeren er deaktivert. Kontakt administrator.");
  return user;
}

export async function requireProfile() {
  const user = await requireUser();
  const profile = await prisma.profile.findUnique({ where: { authUserId: user.id } });
  if (!profile) throw new Error("Brukeren har ikke tilgang. Kontakt administrator.");
  const role = userRoleSchema.safeParse(profile.role);
  if (!role.success) throw new Error("Brukeren har en ugyldig rolle.");
  return { user, profile: { ...profile, role: role.data } };
}

export async function requireRole(allowed: UserRole[]) {
  const session = await requireProfile();
  if (!allowed.includes(session.profile.role)) throw new Error("Du har ikke tilgang til denne handlingen.");
  return session;
}

export const requireAdministrator = () => requireRole(["ADMINISTRATOR"]);
export const requireEditor = () => requireRole(["ADMINISTRATOR", "TEKNIKER"]);

async function getOrBootstrapProfile(authUserId: string, email: string, suppliedName?: unknown) {
  const existing = await prisma.profile.findUnique({ where: { authUserId } });
  if (existing) return existing;
  if (await prisma.profile.count()) return null;

  const name = typeof suppliedName === "string" && suppliedName.trim() ? suppliedName.trim() : email.split("@")[0] || "Administrator";
  const profile = await prisma.profile.create({ data: { authUserId, email, name, role: "ADMINISTRATOR" } });
  try {
    await createSupabaseAdminClient().auth.admin.updateUserById(authUserId, {
      app_metadata: { role: "ADMINISTRATOR", isActive: true },
      user_metadata: { name },
    });
  } catch {
    // Profilen beskytter serversiden selv om Auth-metadata ikke kan synkroniseres ennå.
  }
  return profile;
}
