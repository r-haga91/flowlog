import { prisma } from "@/lib/prisma";
import type { SettingKind } from "@/types/common";

export async function getSettingsData() {
  const [festivaler, arrangorer, arrangementer] = await Promise.all([
    prisma.festival.findMany({ orderBy: { navn: "asc" } }),
    prisma.arrangor.findMany({ orderBy: { navn: "asc" } }),
    prisma.arrangement.findMany({ include: { festival: true }, orderBy: [{ festival: { navn: "asc" } }, { navn: "asc" }] }),
  ]);

  return { festivaler, arrangorer, arrangementer };
}

export function createFestival(navn: string) {
  return prisma.festival.create({ data: { navn } });
}

export function createArrangor(navn: string) {
  return prisma.arrangor.create({ data: { navn } });
}

export function createArrangement(navn: string, festivalId: number) {
  return prisma.arrangement.create({ data: { navn, festivalId } });
}

export function updateFestival(id: number, navn: string) {
  return prisma.festival.update({ where: { id }, data: { navn } });
}

export function updateArrangor(id: number, navn: string) {
  return prisma.arrangor.update({ where: { id }, data: { navn } });
}

export function updateArrangement(id: number, navn: string, festivalId: number) {
  return prisma.$transaction([
    prisma.arrangement.update({ where: { id }, data: { navn, festivalId } }),
    prisma.avlesning.updateMany({ where: { arrangementId: id }, data: { festivalId } }),
  ]);
}

export async function deleteSetting(kind: SettingKind, id: number, force: boolean) {
  if (kind === "arrangor") {
    const count = await prisma.avlesning.count({ where: { arrangorId: id } });
    if (count && !force) return false;
    await prisma.$transaction([prisma.avlesning.deleteMany({ where: { arrangorId: id } }), prisma.arrangor.delete({ where: { id } })]);
    return true;
  }
  if (kind === "arrangement") {
    const count = await prisma.avlesning.count({ where: { arrangementId: id } });
    if (count && !force) return false;
    await prisma.$transaction([prisma.avlesning.deleteMany({ where: { arrangementId: id } }), prisma.arrangement.delete({ where: { id } })]);
    return true;
  }
  const count = await prisma.avlesning.count({ where: { festivalId: id } });
  if (count && !force) return false;
  await prisma.$transaction([
    prisma.avlesning.deleteMany({ where: { OR: [{ festivalId: id }, { arrangement: { festivalId: id } }] } }),
    prisma.arrangement.deleteMany({ where: { festivalId: id } }),
    prisma.festival.delete({ where: { id } }),
  ]);
  return true;
}
