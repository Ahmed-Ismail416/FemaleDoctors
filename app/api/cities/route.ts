import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const cities = await prisma.city.findMany({
    orderBy: { name_ar: "asc" },
  });
  return NextResponse.json(cities);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name_ar, name_en, slug, governorate_id } = body;

  const city = await prisma.city.create({
    data: {
      name_ar,
      name_en: name_en || name_ar,
      slug: slug || name_ar.replace(/\s+/g, "-"),
      governorate_id: Number(governorate_id),
    },
  });

  return NextResponse.json(city, { status: 201 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID مطلوب" }, { status: 400 });

  await prisma.city.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, name_ar, name_en, slug, governorate_id } = body;
  if (!id) return NextResponse.json({ error: "ID مطلوب" }, { status: 400 });

  const city = await prisma.city.update({
    where: { id: parseInt(id) },
    data: {
      name_ar,
      name_en: name_en || undefined,
      slug: slug || undefined,
      governorate_id: governorate_id ? Number(governorate_id) : undefined,
    },
  });

  return NextResponse.json(city);
}

