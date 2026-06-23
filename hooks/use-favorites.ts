"use client";

import { useCallback, useEffect, useState } from "react";
import type { Favorites } from "@/types/favorites";
import { emptyFavorites, favoritesEvent, favoritesKey, readFavorites } from "@/utils/favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorites>(emptyFavorites);

  useEffect(() => {
    const sync = () => setFavorites(readFavorites());
    sync();
    window.addEventListener(favoritesEvent, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(favoritesEvent, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggle = useCallback((kind: keyof Favorites, id: number) => {
    const current = readFavorites();
    const values = current[kind].includes(id) ? current[kind].filter((item) => item !== id) : [...current[kind], id];
    localStorage.setItem(favoritesKey, JSON.stringify({ ...current, [kind]: values }));
    window.dispatchEvent(new Event(favoritesEvent));
  }, []);

  return { favorites, toggle };
}
