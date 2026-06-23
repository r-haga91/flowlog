import { readMigratedStorage, storageKeys } from "@/utils/storage-keys";

export type RegistrationPreferences = {
  festivalId: number;
  arrangorId: number;
  arrangementId: number;
};

const storageKey = storageKeys.aktivtOppdrag;

export function loadRegistrationPreferences(): RegistrationPreferences | null {
  try {
    const value = readMigratedStorage(storageKey);
    if (!value) return null;
    const parsed = JSON.parse(value) as Partial<RegistrationPreferences>;
    if (![parsed.festivalId, parsed.arrangorId, parsed.arrangementId].every(Number.isInteger)) return null;
    return parsed as RegistrationPreferences;
  } catch {
    return null;
  }
}

export function saveRegistrationPreferences(preferences: RegistrationPreferences) {
  localStorage.setItem(storageKey, JSON.stringify(preferences));
}

export function clearRegistrationPreferences() {
  localStorage.removeItem(storageKey);
}
