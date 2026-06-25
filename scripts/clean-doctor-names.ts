/**
 * One-time migration: strip doctor title prefixes from all existing doctor names.
 *
 * Run with:
 *   npx tsx scripts/clean-doctor-names.ts
 *
 * What this does:
 *  1. Reads every doctor record from the database.
 *  2. Removes any title prefix (د., دكتورة, الدكتورة, etc.) from the name.
 *  3. Normalises whitespace (collapse multiple spaces, trim).
 *  4. Updates ONLY the records whose name actually changed — no-op on clean names.
 *  5. Prints a detailed summary.
 *
 * No other fields are modified.
 * Safe to re-run — unchanged records are skipped.
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { stripDoctorTitle } from "../lib/utils";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🔄  Doctor Name Cleanup Migration\n");

  const doctors = await prisma.doctor.findMany({
    select: { id: true, name: true },
    orderBy: { id: "asc" },
  });

  console.log(`📋  Total records: ${doctors.length}\n`);

  let changed = 0;
  let skipped = 0;
  const changedLog: { id: number; before: string; after: string }[] = [];

  for (const doctor of doctors) {
    const cleanedName = stripDoctorTitle(doctor.name);

    if (cleanedName === doctor.name) {
      skipped++;
      continue;
    }

    // Only update if the name actually changed
    await prisma.doctor.update({
      where: { id: doctor.id },
      data: { name: cleanedName },
    });

    changedLog.push({ id: doctor.id, before: doctor.name, after: cleanedName });
    changed++;
  }

  // ── Report ─────────────────────────────────────────────────────────────────
  if (changedLog.length > 0) {
    console.log("✏️   Changes applied:\n");
    changedLog.forEach(({ id, before, after }) => {
      console.log(`  [ID ${id}]`);
      console.log(`    Before: ${before}`);
      console.log(`    After:  ${after}\n`);
    });
  }

  console.log("─".repeat(50));
  console.log(`✅  Updated : ${changed}`);
  console.log(`⏭️   Skipped : ${skipped} (already clean)`);
  console.log(`📊  Total   : ${doctors.length}`);
  console.log("\n🎉  Migration complete!");
}

main()
  .catch((err) => {
    console.error("❌  Migration failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
