/**
 * One-time database setup for Smart Arabic Search.
 *
 * Run with:
 *   npx tsx scripts/setup-search.ts
 *
 * What this does:
 *  1. Enables pg_trgm extension (typo-tolerant similarity search)
 *  2. Creates normalize_arabic() PostgreSQL function (IMMUTABLE, no extra column)
 *  3. Creates a functional GIN trigram index on normalize_arabic(name)
 *
 * Safe to re-run — all statements use IF NOT EXISTS / CREATE OR REPLACE.
 */

import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";

// Load .env.local
config({ path: ".env.local" });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("❌  DATABASE_URL not found in .env.local");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function setup() {
  console.log("🔧  Setting up Smart Arabic Search...\n");

  // ─── Step 1: pg_trgm ─────────────────────────────────────────────────────
  console.log("📦  Enabling pg_trgm extension...");
  await sql`CREATE EXTENSION IF NOT EXISTS pg_trgm`;
  console.log("    ✅  pg_trgm ready\n");

  // ─── Step 2: normalize_arabic() function ──────────────────────────────────
  console.log("🔤  Creating normalize_arabic() function...");
  await sql`
    CREATE OR REPLACE FUNCTION normalize_arabic(t text)
    RETURNS text
    LANGUAGE sql
    IMMUTABLE
    STRICT
    AS $$
      SELECT trim(
        regexp_replace(
          regexp_replace(
            translate(
              lower(t),
              'أإآؤئىة',
              'اااوويه'
            ),
            '[\u064B\u064C\u064D\u064E\u064F\u0650\u0651\u0652]',
            '',
            'g'
          ),
          '\u0640',
          '',
          'g'
        )
      )
    $$
  `;
  console.log("    ✅  normalize_arabic() created\n");

  // ─── Step 3: GIN trigram index ────────────────────────────────────────────
  console.log("⚡  Creating GIN trigram index on normalize_arabic(name)...");
  await sql`
    CREATE INDEX IF NOT EXISTS idx_doctors_name_trgm
      ON doctors
      USING GIN (normalize_arabic(name) gin_trgm_ops)
  `;
  console.log("    ✅  GIN index idx_doctors_name_trgm created\n");

  // ─── Done ─────────────────────────────────────────────────────────────────
  console.log("🎉  Setup complete! Smart Arabic Search is ready.");
  console.log(
    "\nNote: A B-Tree functional index is intentionally omitted at this stage.\n" +
    "      Add one only if prefix-search benchmarks show a measurable benefit."
  );
}

setup().catch((err) => {
  console.error("❌  Setup failed:", err);
  process.exit(1);
});
