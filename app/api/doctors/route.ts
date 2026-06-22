import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search");
  const governorate = searchParams.get("governorate");
  const city = searchParams.get("city");
  const specialty = searchParams.get("specialty");
  const featured = searchParams.get("featured");
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "12");

  let query = supabase
    .from("doctors")
    .select(`
      *,
      governorate:governorates(id, name_ar, name_en, slug),
      city:cities(id, name_ar, name_en, slug)
    `, { count: "exact" })
    .eq("verified", true)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (search) {
    query = query.or(`name.ilike.%${search}%,specialty.ilike.%${search}%,address.ilike.%${search}%`);
  }
  if (governorate) {
    query = query.eq("governorate_id", parseInt(governorate));
  }
  if (city) {
    query = query.eq("city_id", parseInt(city));
  }
  if (specialty) {
    query = query.eq("specialty", specialty);
  }
  if (featured === "true") {
    query = query.eq("featured", true);
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data,
    count,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("doctors")
    .insert([body])
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
  const { id, ...updates } = body;

  const { data, error } = await supabase
    .from("doctors")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID مطلوب" }, { status: 400 });
  }

  const { error } = await supabase.from("doctors").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
