"use client";

import { useMemo } from "react";
import { useFavorites } from "@/hooks/use-favorites";
import type { SelectOption } from "@/types/common";
import { sortFavoritesFirst } from "@/utils/favorites";

export function useFavoriteOptions<T extends SelectOption, U extends SelectOption>(festivaler: T[], arrangementer: U[]) {
  const { favorites } = useFavorites();
  return {
    festivaler: useMemo(() => sortFavoritesFirst(festivaler, favorites.festivaler), [festivaler, favorites.festivaler]),
    arrangementer: useMemo(() => sortFavoritesFirst(arrangementer, favorites.arrangementer), [arrangementer, favorites.arrangementer]),
    favorites,
  };
}

export function favoriteLabel(name: string, favorite: boolean) {
  return favorite ? `★ ${name}` : name;
}
