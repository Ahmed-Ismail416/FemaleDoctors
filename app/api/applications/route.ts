import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "all";

  let query = supabase
    .from("applications")
    .select(`
      *,
      governorate:governorates(id, name_ar, name_en, slug),
      city:cities(id, name_ar, name_en, slug)
    `, { count: "exact" })
    .order("created_at", { ascending: false });

  if (status !== "all") {
    query = query.eq("status", status);
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, count });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("applications")
    .insert([{ ...body, status: "pending" }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  const body = await request.json();
  const { id, status, notes } = body;

  // Update application status
  const { data: application, error: appError } = await supabase
    .from("applications")
    .update({ status, notes })
    .eq("id", id)
    .select()
    .single();

  if (appError) {
    return NextResponse.json({ error: appError.message }, { status: 500 });
  }

  // If approved, create doctor entry
  if (status === "approved" && application) {
    const { error: doctorError } = await supabase.from("doctors").insert([{
      name: application.doctor_name,
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
      verified: true,
      featured: false,
    }]);

    if (doctorError) {
      return NextResponse.json({ error: doctorError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ data: application });
}
