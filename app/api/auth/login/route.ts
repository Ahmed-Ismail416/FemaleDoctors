import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/auth/session";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (email !== adminEmail || password !== adminPassword) {
    return NextResponse.json(
      { error: "بيانات الدخول غير صحيحة" },
      { status: 401 }
    );
  }

  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
  session.isAdmin = true;
  await session.save();

  return NextResponse.json({ success: true });
}
