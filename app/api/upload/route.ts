import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("file") as File | null;
  const bucket = (form.get("bucket") as string) || "uploads";

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  try {
    const blob = await put(`${bucket}/${Date.now()}-${file.name}`, file, {
      access: "public",
    });
    return NextResponse.json({ url: blob.url });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
