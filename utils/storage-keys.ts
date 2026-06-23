const legacyPrefix = ["festival", "log"].join("");

export const storageKeys = {
  tema: "flowlog:tema",
  favoritter: "flowlog:favoritter",
  aktivtOppdrag: "flowlog:aktivt-oppdrag",
  liveOppdrag: "flowlog:live-oppdrag",
  sisteEksport: "flowlog:siste-eksport",
} as const;

export function readMigratedStorage(key: string) {
  const current = localStorage.getItem(key);
  if (current !== null) return current;
  const suffix = key.split(":").slice(1).join(":");
  const legacyKey = `${legacyPrefix}:${suffix}`;
  const legacy = localStorage.getItem(legacyKey);
  if (legacy !== null) {
    localStorage.setItem(key, legacy);
    localStorage.removeItem(legacyKey);
  }
  return legacy;
}
