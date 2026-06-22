"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addGovernorateAction(name: string) {
  const governorate = await prisma.governorate.create({
    data: {
      name_ar: name,
      name_en: name,
      slug: name.replace(/\s+/g, "-"),
    },
  });
  revalidatePath("/admin/governorates");
  return governorate;
}

export async function deleteGovernorateAction(id: number) {
  await prisma.governorate.delete({ where: { id } });
  revalidatePath("/admin/governorates");
}
