import "server-only";
import { prisma } from "@/lib/prisma";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { userRoleSchema, type CreateUserInput, type ManagedUser, type UserRole } from "@/types/user";

export async function listManagedUsers(): Promise<ManagedUser[]> {
  const profiles = await prisma.profile.findMany({ orderBy: [{ isActive: "desc" }, { name: "asc" }] });
  return profiles.flatMap((profile) => {
    const role = userRoleSchema.safeParse(profile.role);
    return role.success ? [{
      authUserId: profile.authUserId,
      email: profile.email,
      name: profile.name,
      role: role.data,
      isActive: profile.isActive,
      createdAt: profile.createdAt.toISOString(),
    }] : [];
  });
}

export async function createManagedUser(input: CreateUserInput) {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
    user_metadata: { name: input.name },
    app_metadata: { role: input.role, isActive: true },
  });
  if (error || !data.user) throw new Error(mapAuthError(error?.message));

  try {
    await prisma.profile.create({ data: {
      authUserId: data.user.id,
      email: input.email.toLowerCase(),
      name: input.name,
      role: input.role,
      isActive: true,
    } });
  } catch (error) {
    await admin.auth.admin.deleteUser(data.user.id);
    throw error;
  }
}

export async function updateManagedUser(authUserId: string, values: { name: string; role: UserRole; isActive: boolean }) {
  const current = await prisma.profile.findUniqueOrThrow({ where: { authUserId } });
  if (current.role === "ADMINISTRATOR" && current.isActive && (values.role !== "ADMINISTRATOR" || !values.isActive)) {
    const activeAdmins = await prisma.profile.count({ where: { role: "ADMINISTRATOR", isActive: true } });
    if (activeAdmins <= 1) throw new Error("Minst én aktiv administrator må finnes.");
  }

  const admin = createSupabaseAdminClient();
  const { error } = await admin.auth.admin.updateUserById(authUserId, {
    user_metadata: { name: values.name },
    app_metadata: { role: values.role, isActive: values.isActive },
  });
  if (error) throw new Error("Kunne ikke oppdatere tilgangen i Supabase.");
  await prisma.profile.update({ where: { authUserId }, data: values });
}

export async function setManagedUserActive(authUserId: string, isActive: boolean) {
  const profile = await prisma.profile.findUniqueOrThrow({ where: { authUserId } });
  await updateManagedUser(authUserId, { name: profile.name, role: userRoleSchema.parse(profile.role), isActive });
}

function mapAuthError(message?: string) {
  if (message?.toLowerCase().includes("already")) return "En bruker med denne e-postadressen finnes allerede.";
  if (message?.toLowerCase().includes("password")) return "Det midlertidige passordet oppfyller ikke sikkerhetskravene.";
  return "Kunne ikke opprette brukeren i Supabase.";
}
