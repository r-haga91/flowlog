"use server";

import { getSearchData } from "@/repositories/search-repository";
import { searchFlowLog } from "@/services/search-service";
import type { SearchResult } from "@/types/search";
import { requireUser } from "@/lib/auth";

export async function globalSearch(term: string): Promise<SearchResult[]> {
  await requireUser();
  const query = typeof term === "string" ? term.trim().slice(0, 100) : "";
  if (!query) return [];
  return searchFlowLog(await getSearchData(), query);
}
