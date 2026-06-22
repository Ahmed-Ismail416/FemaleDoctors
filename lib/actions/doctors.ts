"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleVerifiedAction(id: number, verified: boolean) {
  await prisma.doctor.update({ where: { id }, data: { verified } });
  revalidatePath("/admin/doctors");
}

export async function toggleFeaturedAction(id: number, featured: boolean) {
  await prisma.doctor.update({ where: { id }, data: { featured } });
  revalidatePath("/admin/doctors");
  revalidatePath("/admin/featured");
}

export async function deleteDoctorAction(id: number) {
  await prisma.doctor.delete({ where: { id } });
  revalidatePath("/admin/doctors");
}
