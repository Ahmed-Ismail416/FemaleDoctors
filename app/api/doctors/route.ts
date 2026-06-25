import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDoctors } from "@/lib/repositories/doctors";
import { stripDoctorTitle } from "@/lib/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search") || undefined;
  const governorate = searchParams.get("governorate");
  const city = searchParams.get("city");
  const specialty = searchParams.get("specialty") || undefined;
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "12");

  const result = await getDoctors({
    search,
    governorate: governorate ? parseInt(governorate) : undefined,
    city: city ? parseInt(city) : undefined,
    specialty,
    page,
    pageSize,
  });

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const body = await request.json();

  const doctor = await prisma.doctor.create({
    data: {
      name: stripDoctorTitle(body.name),
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
      working_hours: body.working_hours || null,
      verified: body.verified ?? false,
      featured: false,
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
