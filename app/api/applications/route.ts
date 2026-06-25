import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripDoctorTitle } from "@/lib/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "all";

  const where =
    status !== "all"
      ? { status: status as "pending" | "approved" | "rejected" }
      : {};

  const [data, count] = await Promise.all([
    prisma.application.findMany({
      where,
      include: {
        governorate: { select: { id: true, name_ar: true, name_en: true, slug: true } },
        city: { select: { id: true, name_ar: true, name_en: true, slug: true } },
      },
      orderBy: { created_at: "desc" },
    }),
    prisma.application.count({ where }),
  ]);

  return NextResponse.json({ data, count });
}

export async function POST(request: Request) {
  const body = await request.json();

  const application = await prisma.application.create({
    data: {
      doctor_name: stripDoctorTitle(body.doctor_name),
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
      license_url: body.license_url || null,
      working_hours: body.working_hours || null,
      status: "pending",
    },
  });

  return NextResponse.json({ data: application }, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, status, notes } = body;

  const application = await prisma.application.update({
    where: { id: Number(id) },
    data: { status, notes: notes || null },
  });

  // If approved, create doctor entry
  if (status === "approved" && application) {
    await prisma.doctor.create({
      data: {
        name: stripDoctorTitle(application.doctor_name),
        phone: application.phone,
        whatsapp: application.whatsapp,
        email: application.email,
        governorate_id: application.governorate_id,
        city_id: application.city_id,
        address: application.address,
        specialty: application.specialty,
        bio: application.bio,
        map_url: application.map_url,
        image_url: application.image_url,
        working_hours: application.working_hours !== null ? (application.working_hours as any) : undefined,
        verified: true,
        featured: false,
      },
    });
  }

  return NextResponse.json({ data: application });
}
