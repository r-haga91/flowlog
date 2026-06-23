import { z } from "zod";

export const userRoles = ["ADMINISTRATOR", "TEKNIKER", "LESER"] as const;
export const userRoleSchema = z.enum(userRoles);
export type UserRole = z.infer<typeof userRoleSchema>;

export const userLabels: Record<UserRole, string> = {
  ADMINISTRATOR: "Administrator",
  TEKNIKER: "Tekniker",
  LESER: "Leser",
};

export const createUserSchema = z.object({
  name: z.string().trim().min(2, "Skriv inn navn").max(100, "Navnet er for langt"),
  email: z.string().trim().email("Skriv inn gyldig e-post"),
  role: userRoleSchema,
  password: z.string().min(8, "Passordet må ha minst 8 tegn").max(72, "Passordet er for langt"),
});

export const updateUserSchema = z.object({
  authUserId: z.string().uuid("Ugyldig bruker"),
  name: z.string().trim().min(2, "Skriv inn navn").max(100, "Navnet er for langt"),
  role: userRoleSchema,
  isActive: z.boolean(),
  confirmSelfDemotion: z.boolean().optional().default(false),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.input<typeof updateUserSchema>;

export type ManagedUser = {
  authUserId: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
};

export type UserActionResult = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
  requiresConfirmation?: boolean;
};
