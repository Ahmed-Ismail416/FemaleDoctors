/**
 * DoctorRepository
 *
 * Unified data-access layer for the Doctor model.
 *
 * Strategy:
 *  - No search term  → pure Prisma findMany (zero behaviour change)
 *  - Search term     → smartSearch() using raw SQL with 6-tier ranking
 *
 * Raw SQL is isolated ONLY to this file. Everything else in the codebase
 * continues to use Prisma as the default ORM.
 */

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { normalizeArabic } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DoctorQueryParams {
  search?: string;
  governorate?: number;
  city?: number;
  specialty?: string;
  page?: number;
  pageSize?: number;
}

interface DoctorRow {
  id: number;
  name: string;
  phone: string;
  whatsapp: string | null;
  email: string | null;
  governorate_id: number;
  city_id: number | null;
  address: string;
  specialty: string;
  bio: string | null;
  map_url: string | null;
  image_url: string | null;
  working_hours: unknown;
  verified: boolean;
  featured: boolean;
  created_at: Date;
  // joined fields
  gov_id: number;
  gov_name_ar: string;
  gov_name_en: string;
  gov_slug: string;
  city_name_ar: string | null;
  city_name_en: string | null;
  city_slug: string | null;
}

export interface DoctorResult {
  id: number;
  name: string;
  phone: string;
  whatsapp: string | null;
  email: string | null;
  governorate_id: number;
  city_id: number | null;
  address: string;
  specialty: string;
  bio: string | null;
  map_url: string | null;
  image_url: string | null;
  working_hours: unknown;
  verified: boolean;
  featured: boolean;
  created_at: Date;
  governorate: {
    id: number;
    name_ar: string;
    name_en: string;
    slug: string;
  };
  city: {
    id: number;
    name_ar: string;
    name_en: string;
    slug: string;
  } | null;
}

export interface DoctorQueryResult {
  data: DoctorResult[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ---------------------------------------------------------------------------
// Helper: map a raw SQL row → DoctorResult
// ---------------------------------------------------------------------------

function mapRow(row: DoctorRow): DoctorResult {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    whatsapp: row.whatsapp,
    email: row.email,
    governorate_id: row.governorate_id,
    city_id: row.city_id,
    address: row.address,
    specialty: row.specialty,
    bio: row.bio,
    map_url: row.map_url,
    image_url: row.image_url,
    working_hours: row.working_hours,
    verified: row.verified,
    featured: row.featured,
    created_at: row.created_at,
    governorate: {
      id: row.gov_id,
      name_ar: row.gov_name_ar,
      name_en: row.gov_name_en,
      slug: row.gov_slug,
    },
    city:
      row.city_id && row.city_name_ar
        ? {
            id: row.city_id,
            name_ar: row.city_name_ar,
            name_en: row.city_name_en ?? "",
            slug: row.city_slug ?? "",
          }
        : null,
  };
}

// ---------------------------------------------------------------------------
// Path A: Prisma findMany (no search)
// ---------------------------------------------------------------------------

async function findMany(params: DoctorQueryParams): Promise<DoctorQueryResult> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = params.pageSize ?? 12;
  const skip = (page - 1) * pageSize;

  // Build Prisma where clause (mirrors existing logic exactly)
  const where: Prisma.DoctorWhereInput = { verified: true };
  if (params.governorate) where.governorate_id = params.governorate;
  if (params.city) where.city_id = params.city;
  if (params.specialty) where.specialty = params.specialty;

  const [data, count] = await Promise.all([
    prisma.doctor.findMany({
      where,
      include: {
        governorate: { select: { id: true, name_ar: true, name_en: true, slug: true } },
        city: { select: { id: true, name_ar: true, name_en: true, slug: true } },
      },
      orderBy: { created_at: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.doctor.count({ where }),
  ]);

  return {
    data: data as unknown as DoctorResult[],
    count,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(count / pageSize)),
  };
}

// ---------------------------------------------------------------------------
// Path B: Smart search (raw SQL, 6-tier ranking)
// ---------------------------------------------------------------------------

async function smartSearch(params: DoctorQueryParams): Promise<DoctorQueryResult> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = params.pageSize ?? 12;
  const offset = (page - 1) * pageSize;

  const normalized = normalizeArabic(params.search ?? "");

  // Build dynamic filter fragments
  // $1 = normalized query, then optional filters follow
  const extraFilters: string[] = ["d.verified = true"];
  const extraParams: (string | number)[] = [normalized];
  let paramIdx = 2;

  if (params.governorate) {
    extraFilters.push(`d.governorate_id = $${paramIdx++}`);
    extraParams.push(params.governorate);
  }
  if (params.city) {
    extraFilters.push(`d.city_id = $${paramIdx++}`);
    extraParams.push(params.city);
  }
  if (params.specialty) {
    extraFilters.push(`d.specialty = $${paramIdx++}`);
    extraParams.push(params.specialty);
  }

  const whereClause = extraFilters.join(" AND ");

  // 6-tier ranking:
  //  1. Exact normalized match
  //  2. Normalized name starts with query + space (e.g. "علي " matches "علي محمد")
  //  3. Word-boundary match using regexp: query appears as a whole word
  //  4. Starts with (partial prefix)
  //  5. Contains anywhere
  //  6. Trigram similarity (fuzzy, threshold 0.4)
  const rankExpr = `
    CASE
      WHEN normalize_arabic(d.name) = $1                              THEN 1
      WHEN normalize_arabic(d.name) LIKE ($1 || ' %')                 THEN 2
      WHEN normalize_arabic(d.name) ~ ('(^|\\s)' || $1 || '(\\s|$)') THEN 3
      WHEN normalize_arabic(d.name) LIKE ($1 || '%')                  THEN 4
      WHEN normalize_arabic(d.name) LIKE ('%' || $1 || '%')           THEN 5
      WHEN similarity(normalize_arabic(d.name), $1) > 0.4             THEN 6
      ELSE 7
    END
  `;

  const searchCondition = `
    (
      normalize_arabic(d.name) LIKE ('%' || $1 || '%')
      OR similarity(normalize_arabic(d.name), $1) > 0.4
    )
  `;

  // Main data query
  const dataQuery = `
    SELECT
      d.id, d.name, d.phone, d.whatsapp, d.email,
      d.governorate_id, d.city_id, d.address, d.specialty,
      d.bio, d.map_url, d.image_url, d.working_hours,
      d.verified, d.featured, d.created_at,
      g.id   AS gov_id,
      g.name_ar AS gov_name_ar, g.name_en AS gov_name_en, g.slug AS gov_slug,
      c.name_ar AS city_name_ar, c.name_en AS city_name_en, c.slug AS city_slug,
      (${rankExpr}) AS rank_score
    FROM doctors d
      LEFT JOIN governorates g ON d.governorate_id = g.id
      LEFT JOIN cities       c ON d.city_id = c.id
    WHERE ${whereClause}
      AND ${searchCondition}
    ORDER BY rank_score ASC, d.created_at DESC
    LIMIT ${pageSize} OFFSET ${offset}
  `;

  // Count query (same WHERE, no ORDER/LIMIT)
  const countQuery = `
    SELECT COUNT(*) AS total
    FROM doctors d
    WHERE ${whereClause}
      AND ${searchCondition}
  `;

  const [rows, countRows] = await Promise.all([
    prisma.$queryRawUnsafe<DoctorRow[]>(dataQuery, ...extraParams),
    prisma.$queryRawUnsafe<{ total: string }[]>(countQuery, ...extraParams),
  ]);

  const count = parseInt(countRows[0]?.total ?? "0", 10);

  return {
    data: rows.map(mapRow),
    count,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(count / pageSize)),
  };
}

// ---------------------------------------------------------------------------
// Public API — unified entry point
// ---------------------------------------------------------------------------

/**
 * Fetch doctors with optional filters.
 *
 * - When `search` is absent → uses Prisma (zero behaviour change)
 * - When `search` is present → uses smartSearch() with pg_trgm + 6-tier ranking
 */
export async function getDoctors(params: DoctorQueryParams): Promise<DoctorQueryResult> {
  if (!params.search?.trim()) {
    return findMany(params);
  }
  return smartSearch(params);
}
