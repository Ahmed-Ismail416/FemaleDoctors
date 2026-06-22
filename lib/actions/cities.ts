"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addCityAction(data: {
  name: string;
  governorate_id: number;
}) {
  const city = await prisma.city.create({
    data: {
      name_ar: data.name,
      name_en: data.name,
      slug: data.name.replace(/\s+/g, "-"),
      governorate_id: data.governorate_id,
    },
  });
  revalidatePath("/admin/cities");
  return city;
}

export async function deleteCityAction(id: number) {
  await prisma.city.delete({ where: { id } });
  revalidatePath("/admin/cities");
}
