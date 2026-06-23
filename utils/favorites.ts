import type { Favorites } from "@/types/favorites";
import { readMigratedStorage, storageKeys } from "@/utils/storage-keys";

export const favoritesKey = storageKeys.favoritter;
export const favoritesEvent = "flowlog:favoritter";
export const emptyFavorites: Favorites = { festivaler: [], arrangementer: [] };

export function readFavorites(): Favorites {
  if (typeof window === "undefined") return emptyFavorites;
  try {
    const value = JSON.parse(readMigratedStorage(favoritesKey) ?? "null") as Partial<Favorites> | null;
    return {
      festivaler: numberList(value?.festivaler),
      arrangementer: numberList(value?.arrangementer),
    };
  } catch {
    return emptyFavorites;
  }
}

export function sortFavoritesFirst<T extends { id: number }>(items: T[], favorites: number[]) {
  const favoriteIds = new Set(favorites);
  return [...items].sort((a, b) => Number(favoriteIds.has(b.id)) - Number(favoriteIds.has(a.id)));
}

function numberList(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is number => Number.isInteger(item) && item > 0) : [];
}
