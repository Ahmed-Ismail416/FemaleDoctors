/**
 * GET /api/search/autocomplete?q=...
 *
 * Returns up to 5 doctor suggestions for the given Arabic search query.
 *
 * Rules:
 *  - Minimum 2 characters
 *  - Maximum 50 characters
 *  - Results ordered by: exact/prefix first, then trigram similarity
 *  - Response cached: s-maxage=300, stale-while-revalidate=600
 *    (Doctor names don't change every minute)
 *
 * Payload per suggestion:
 *  { id, name, specialty, image_url, verified, governorate, city }
 *  Includes image_url & verified so the UI can show avatars / badges
 *  without a future API change.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeArabic } from "@/lib/utils";

const MAX_RESULTS = 5;
const MIN_CHARS = 2;
const MAX_CHARS = 50;
const SIMILARITY_THRESHOLD = 0.4;

interface AutocompleteRow {
  id: number;
  name: string;
  specialty: string;
  image_url: string | null;
  verified: boolean;
  gov_name_ar: string;
  city_name_ar: string | null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";

  // ── Validation ────────────────────────────────────────────────────────────
  if (q.length < MIN_CHARS) {
    return NextResponse.json(
      { suggestions: [], reason: "min_chars" },
      { status: 200 }
    );
  }

  if (q.length > MAX_CHARS) {
    return NextResponse.json(
      { suggestions: [], reason: "max_chars" },
      { status: 400 }
    );
  }

  // ── Normalize query ────────────────────────────────────────────────────────
  const normalized = normalizeArabic(q);

  if (!normalized) {
    return NextResponse.json({ suggestions: [] });
  }

  // ── Query via prisma.$queryRawUnsafe ───────────────────────────────────────
  // Uses the normalize_arabic() PG function + pg_trgm similarity
  const query = `
    SELECT
      d.id,
      d.name,
      d.specialty,
      d.image_url,
      d.verified,
      g.name_ar AS gov_name_ar,
      c.name_ar AS city_name_ar
    FROM doctors d
      LEFT JOIN governorates g ON d.governorate_id = g.id
      LEFT JOIN cities       c ON d.city_id = c.id
    WHERE d.verified = true
      AND (
        normalize_arabic(d.name) LIKE ('%' || $1 || '%')
        OR similarity(normalize_arabic(d.name), $1) > $2
      )
    ORDER BY
      CASE
        WHEN normalize_arabic(d.name) = $1                                THEN 1
        WHEN normalize_arabic(d.name) ~ ('^' || $1 || '(\\s|$)')         THEN 2
        WHEN normalize_arabic(d.name) ~ ('(^|\\s)' || $1 || '(\\s|$)')  THEN 3
        WHEN normalize_arabic(d.name) LIKE ($1 || '%')                   THEN 4
        WHEN normalize_arabic(d.name) LIKE ('%' || $1 || '%')            THEN 5
        ELSE 6
      END ASC,
      similarity(normalize_arabic(d.name), $1) DESC,
      d.created_at DESC
    LIMIT $3
  `;

  const rows = await prisma.$queryRawUnsafe<AutocompleteRow[]>(
    query,
    normalized,
    SIMILARITY_THRESHOLD,
    MAX_RESULTS
  );

  // ── Shape response ─────────────────────────────────────────────────────────
  const suggestions = rows.map((row) => ({
    id: row.id,
    name: row.name,
    specialty: row.specialty,
    image_url: row.image_url ?? null,
    verified: row.verified,
    governorate: { name_ar: row.gov_name_ar },
    city: row.city_name_ar ? { name_ar: row.city_name_ar } : null,
  }));

  return NextResponse.json(
    { suggestions },
    {
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
      },
    }
  );
}
