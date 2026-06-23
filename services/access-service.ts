import type { UserRole } from "@/types/user";

const editorOnly = new Set(["/registrering", "/live-festival"]);
const administratorOnly = new Set(["/innstillinger"]);

export function canAccessPath(role: UserRole | null, pathname: string) {
  if (!role) return false;
  if (administratorOnly.has(pathname)) return role === "ADMINISTRATOR";
  if (editorOnly.has(pathname)) return role === "ADMINISTRATOR" || role === "TEKNIKER";
  return true;
}

export function isEditor(role: UserRole | null) {
  return role === "ADMINISTRATOR" || role === "TEKNIKER";
}
