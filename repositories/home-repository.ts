import { prisma } from "@/lib/prisma";

export async function getHomeData() {
  const [antallAvlesninger, siste, festivaler, arrangorer, arrangementer] = await Promise.all([
    prisma.avlesning.count(),
    prisma.avlesning.findFirst({
      orderBy: [{ dato: "desc" }, { klokkeslett: "desc" }, { id: "desc" }],
      include: { festival: true, arrangor: true, arrangement: true },
    }),
    prisma.festival.findMany({ select: { id: true, navn: true }, orderBy: { navn: "asc" } }),
    prisma.arrangor.findMany({ select: { id: true, navn: true }, orderBy: { navn: "asc" } }),
    prisma.arrangement.findMany({ select: { id: true, navn: true, festivalId: true }, orderBy: { navn: "asc" } }),
  ]);
  return { antallAvlesninger, siste, options: { festivaler, arrangorer, arrangementer } };
}
