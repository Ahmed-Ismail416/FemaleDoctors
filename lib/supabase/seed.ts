import { createAdminClient } from "@/lib/supabase/admin";
import { GOVERNORATES, CITIES, MOCK_DOCTORS } from "@/lib/data/mock";

export async function seedDatabase() {
  const supabase = createAdminClient();

  try {
    // Check if already seeded
    const { count, error: countError } = await supabase
      .from("governorates")
      .select("*", { count: "exact", head: true });
    
    if (countError) {
      console.warn("Could not check if seeded (maybe tables do not exist yet):", countError.message);
      return;
    }

    if (count && count > 0) {
      console.log("Database already seeded. Skipping auto-seed.");
      return;
    }

    console.log("Starting auto-seed...");
    
    // 1. Seed Governorates
    const { error: govErr } = await supabase
      .from("governorates")
      .upsert(
        GOVERNORATES.map((g) => ({
          id: g.id,
          name_ar: g.name_ar,
          name_en: g.name_en,
          slug: g.slug,
        })),
        { onConflict: "slug" }
      );

    if (govErr) throw new Error(`Governorates seed error: ${govErr.message}`);

    // 2. Seed Cities
    const { error: cityErr } = await supabase
      .from("cities")
      .upsert(
        CITIES.map((c) => ({
          id: c.id,
          governorate_id: c.governorate_id,
          name_ar: c.name_ar,
          name_en: c.name_en,
          slug: c.slug,
        })),
        { onConflict: "governorate_id,slug" }
      );

    if (cityErr) throw new Error(`Cities seed error: ${cityErr.message}`);

    // 3. Seed Doctors
    const doctorRecords = MOCK_DOCTORS.map((d) => ({
      name: d.name,
      phone: d.phone,
      whatsapp: d.whatsapp || null,
      email: d.email || null,
      governorate_id: d.governorate_id,
      city_id: d.city_id || null,
      address: d.address,
      specialty: d.specialty,
      bio: d.bio || null,
      map_url: d.map_url || null,
      image_url: d.image_url || null,
      verified: d.verified,
      featured: d.featured,
    }));

    const { error: docErr } = await supabase.from("doctors").insert(doctorRecords);
    if (docErr) throw new Error(`Doctors seed error: ${docErr.message}`);

    console.log("Auto-seed completed successfully!");
  } catch (err: any) {
    console.error("Auto-seed failed:", err.message);
  }
}
