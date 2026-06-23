import type { SelectOption } from "@/types/common";
import type { BackupSettings, RestoredLocalSettings } from "@/types/backup";
import { loadLiveAssignment, saveLiveAssignment } from "@/utils/live-assignment";
import { loadRegistrationPreferences, saveRegistrationPreferences } from "@/utils/registration-preferences";
import { favoritesEvent, favoritesKey, readFavorites } from "@/utils/favorites";
import { readMigratedStorage, storageKeys } from "@/utils/storage-keys";

export type BackupOptions = { festivaler: SelectOption[]; arrangorer: SelectOption[]; arrangementer: Array<SelectOption & { festivalId: number }> };

export function collectBackupSettings(options: BackupOptions): BackupSettings {
  const registration = loadRegistrationPreferences();
  const live = loadLiveAssignment();
  const registrationNames = registration ? namesFor(registration, options) : null;
  const liveNames = live ? namesFor(live, options) : null;
  const favorites = readFavorites();
  const theme = readMigratedStorage(storageKeys.tema);
  return {
    registreringsvalg: registrationNames && isComplete(registrationNames) ? registrationNames : null,
    liveOppdrag: liveNames && isComplete(liveNames) ? { ...liveNames, dato: live!.dato, paused: live!.paused } : null,
    tema: theme === "dark" || theme === "light" || theme === "system" ? theme : "system",
    favoritter: {
      festivaler: options.festivaler.filter((item) => favorites.festivaler.includes(item.id)).map((item) => item.navn),
      arrangementer: options.arrangementer.filter((item) => favorites.arrangementer.includes(item.id)).map((item) => ({ festival: options.festivaler.find((festival) => festival.id === item.festivalId)?.navn ?? "", arrangement: item.navn })).filter((item) => item.festival),
    },
  };
}

export function restoreLocalSettings(settings: RestoredLocalSettings) {
  if (settings.registreringsvalg) saveRegistrationPreferences(settings.registreringsvalg);
  if (settings.liveOppdrag) saveLiveAssignment(settings.liveOppdrag);
  if (settings.tema) localStorage.setItem(storageKeys.tema, settings.tema);
  if (settings.favoritter) localStorage.setItem(favoritesKey, JSON.stringify(settings.favoritter));
  window.dispatchEvent(new Event(favoritesEvent));
  if (settings.tema) window.location.reload();
}

function namesFor(value: { festivalId: number; arrangorId: number; arrangementId: number }, options: BackupOptions) {
  return {
    festival: options.festivaler.find((item) => item.id === value.festivalId)?.navn ?? "",
    arrangor: options.arrangorer.find((item) => item.id === value.arrangorId)?.navn ?? "",
    arrangement: options.arrangementer.find((item) => item.id === value.arrangementId && item.festivalId === value.festivalId)?.navn ?? "",
  };
}
function isComplete(value: { festival: string; arrangor: string; arrangement: string }) { return Boolean(value.festival && value.arrangor && value.arrangement); }
