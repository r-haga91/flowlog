import { liveAssignmentSchema, type LiveAssignment } from "@/types/live-festival";
import { readMigratedStorage, storageKeys } from "@/utils/storage-keys";

const storageKey = storageKeys.liveOppdrag;

export function loadLiveAssignment(): LiveAssignment | null {
  try {
    const value = readMigratedStorage(storageKey);
    if (!value) return null;
    const parsed = liveAssignmentSchema.safeParse(JSON.parse(value));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function saveLiveAssignment(assignment: LiveAssignment) {
  localStorage.setItem(storageKey, JSON.stringify(assignment));
}

export function clearLiveAssignment() {
  localStorage.removeItem(storageKey);
}
