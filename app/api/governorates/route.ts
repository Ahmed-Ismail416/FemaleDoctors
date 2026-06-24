import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const governorates = await prisma.governorate.findMany({
    orderBy: { name_ar: "asc" },
  });
  return NextResponse.json(governorates);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name_ar, name_en, slug } = body;

  const governorate = await prisma.governorate.create({
    data: { name_ar, name_en: name_en || name_ar, slug: slug || name_ar.replace(/\s+/g, "-") },
  });

  return NextResponse.json(governorate, { status: 201 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID مطلوب" }, { status: 400 });

  await prisma.governorate.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, name_ar, name_en, slug } = body;
  if (!id) return NextResponse.json({ error: "ID مطلوب" }, { status: 400 });

  const governorate = await prisma.governorate.update({
    where: { id: parseInt(id) },
    data: {
      name_ar,
      name_en: name_en || undefined,
      slug: slug || undefined,
    },
  });

  return NextResponse.json(governorate);
}

