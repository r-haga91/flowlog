import type { AwaitedReturn } from "@/types/utility";
import type { getSearchData } from "@/repositories/search-repository";
import type { SearchResult } from "@/types/search";

type SearchData = AwaitedReturn<typeof getSearchData>;

export function searchFlowLog(data: SearchData, input: string): SearchResult[] {
  const query = normalize(input);
  if (!query) return [];
  const results: SearchResult[] = [];
  for (const item of data.festivaler) if (matches(query, item.navn)) results.push({ id: `festival-${item.id}`, type: "Festival", title: item.navn, subtitle: "Festival", href: "/innstillinger" });
  for (const item of data.arrangorer) if (matches(query, item.navn)) results.push({ id: `arrangor-${item.id}`, type: "Arrangør", title: item.navn, subtitle: "Arrangør", href: "/innstillinger" });
  for (const item of data.arrangementer) if (matches(query, item.navn, item.festival.navn)) results.push({ id: `arrangement-${item.id}`, type: "Arrangement", title: item.navn, subtitle: item.festival.navn, href: "/innstillinger" });
  for (const item of data.avlesninger) {
    const date = item.dato.toLocaleDateString("nb-NO", { timeZone: "Europe/Oslo" });
    const isoDate = item.dato.toLocaleDateString("sv-SE", { timeZone: "Europe/Oslo" });
    if (matches(query, item.festival.navn, item.arrangor.navn, item.arrangement.navn, item.kommentar ?? "", date, isoDate, item.klokkeslett, String(item.malerstand))) results.push({ id: `reading-${item.id}`, type: "Avlesning", title: `${item.malerstand.toLocaleString("nb-NO")} L · ${item.arrangement.navn}`, subtitle: `${date} kl. ${item.klokkeslett}${item.kommentar ? ` · ${item.kommentar}` : ""}`, href: "/registrering" });
    if (results.length >= 20) break;
  }
  return results.slice(0, 20);
}

function matches(query: string, ...values: string[]) { return values.some((value) => normalize(value).includes(query)); }
function normalize(value: string) { return value.toLocaleLowerCase("nb-NO").trim(); }
