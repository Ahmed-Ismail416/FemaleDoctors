import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search");
  const governorate = searchParams.get("governorate");
  const city = searchParams.get("city");
  const specialty = searchParams.get("specialty");
  const featured = searchParams.get("featured");
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "12");

  const where: Prisma.DoctorWhereInput = { verified: true };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { specialty: { contains: search, mode: "insensitive" } },
      { address: { contains: search, mode: "insensitive" } },
    ];
  }
  if (governorate) where.governorate_id = parseInt(governorate);
  if (city) where.city_id = parseInt(city);
  if (specialty) where.specialty = specialty;
  if (featured === "true") where.featured = true;

  const [data, count] = await Promise.all([
    prisma.doctor.findMany({
      where,
      include: {
        governorate: { select: { id: true, name_ar: true, name_en: true, slug: true } },
        city: { select: { id: true, name_ar: true, name_en: true, slug: true } },
      },
      orderBy: [{ featured: "desc" }, { created_at: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.doctor.count({ where }),
  ]);

  return NextResponse.json({
    data,
    count,
    page,
    pageSize,
    totalPages: Math.ceil(count / pageSize),
  });
}

export async function POST(request: Request) {
  const body = await request.json();

  const doctor = await prisma.doctor.create({
    data: {
      name: body.name,
      phone: body.phone,
      whatsapp: body.whatsapp || null,
      email: body.email || null,
      governorate_id: Number(body.governorate_id),
      city_id: body.city_id ? Number(body.city_id) : null,
      address: body.address,
      specialty: body.specialty,
      bio: body.bio || null,
      map_url: body.map_url || null,
      image_url: body.image_url || null,
      verified: body.verified ?? false,
      featured: body.featured ?? false,
    },
  });

  return NextResponse.json({ data: doctor }, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, ...updates } = body;

  const doctor = await prisma.doctor.update({
    where: { id: Number(id) },
    data: updates,
  });

  return NextResponse.json({ data: doctor });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID مطلوب" }, { status: 400 });
  }

  await prisma.doctor.delete({ where: { id: parseInt(id) } });

  return NextResponse.json({ success: true });
}
