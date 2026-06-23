import { prisma } from "@/lib/prisma";

export async function getSearchData() {
  const [festivaler, arrangorer, arrangementer, avlesninger] = await Promise.all([
    prisma.festival.findMany({ select: { id: true, navn: true } }),
    prisma.arrangor.findMany({ select: { id: true, navn: true } }),
    prisma.arrangement.findMany({ include: { festival: true } }),
    prisma.avlesning.findMany({ take: 500, include: { festival: true, arrangor: true, arrangement: true }, orderBy: { opprettetDato: "desc" } }),
  ]);
  return { festivaler, arrangorer, arrangementer, avlesninger };
}
