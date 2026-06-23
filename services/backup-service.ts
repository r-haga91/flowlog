import { backupSchema, type BackupFile } from "@/types/backup";
import { prisma } from "@/lib/prisma";

export const backupService = {
  validate(input: unknown) {
    return backupSchema.safeParse(input);
  },
  parse(text: string): BackupFile {
    return backupSchema.parse(JSON.parse(text));
  },
  async getStatus() {
    const [festivaler, arrangorer, arrangementer, avlesninger] = await Promise.all([
      prisma.festival.count(), prisma.arrangor.count(), prisma.arrangement.count(), prisma.avlesning.count(),
    ]);
    return { festivaler, arrangorer, arrangementer, avlesninger };
  },
};
