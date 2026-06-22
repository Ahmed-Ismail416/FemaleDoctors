import type { Metadata } from "next";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Users } from "lucide-react";
import DoctorCard from "@/components/doctors/DoctorCard";
import { createClient } from "@/lib/supabase/server";

const DoctorFiltersAsync = dynamic(
  () => import("@/components/doctors/DoctorFilters"),
  {
    loading: () => <div className="h-32 bg-white rounded-2xl animate-pulse" />,
  },
);

export const metadata: Metadata = {
  title: "دليل الطبيبات - أمراض النساء والتوليد في مصر",
  description:
    "تصفح دليل طبيبات أمراض النساء والتوليد في مصر. ابحثي بالاسم أو المحافظة أو المنطقة. معلومات التواصل وعناوين العيادات.",
};

interface SearchParams {
  search?: string;
  governorate?: string;
  city?: string;
  specialty?: string;
  page?: string;
}

export default async function DoctorsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  // 1. Fetch Governorates for filter dropdown
  const { data: govData } = await supabase.from("governorates").select("*").order("name_ar");
  const governorates = govData || [];

  // 2. Fetch Cities for filter dropdown
  const { data: cityData } = await supabase.from("cities").select("*").order("name_ar");
  const cities = cityData || [];

  // 3. Fetch Doctors matching filters
  let query = supabase
    .from("doctors")
    .select(`
      *,
      governorate:governorates(id, name_ar, name_en, slug),
      city:cities(id, name_ar, name_en, slug)
    `)
    .eq("verified", true);

  if (params.search) {
    const s = params.search;
    query = query.or(`name.ilike.%${s}%,specialty.ilike.%${s}%,address.ilike.%${s}%`);
  }
  if (params.governorate) {
    query = query.eq("governorate_id", parseInt(params.governorate));
  }
  if (params.city) {
    query = query.eq("city_id", parseInt(params.city));
  }
  if (params.specialty) {
    query = query.eq("specialty", params.specialty);
  }

  const { data: doctorsData } = await query
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  const filtered = doctorsData || [];

  const hasFilters =
    params.search || params.governorate || params.city || params.specialty;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-purple-800 to-pink-700 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-purple-200 font-medium">دليل الطبيبات</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            طبيبات أمراض النساء والتوليد
          </h1>
          <p className="text-purple-200 text-lg">
            {filtered.length} طبيبة في مصر
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters - Dynamically imported */}
        <div className="mb-8">
          <Suspense
            fallback={
              <div className="h-32 bg-white rounded-2xl animate-pulse" />
            }
          >
            <DoctorFiltersAsync governorates={governorates} cities={cities} />
          </Suspense>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-gray-600 text-sm">
              {hasFilters ? (
                <>
                  عرض{" "}
                  <span className="font-bold text-purple-700">
                    {filtered.length}
                  </span>{" "}
                  نتيجة
                </>
              ) : (
                <>
                  إجمالي{" "}
                  <span className="font-bold text-purple-700">
                    {filtered.length}
                  </span>{" "}
                  طبيبة
                </>
              )}
            </p>
          </div>
        </div>

        {/* Doctor Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor as any} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-purple-50 flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-purple-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              لا توجد نتائج
            </h3>
            <p className="text-gray-500">جرّبي تعديل معايير البحث</p>
          </div>
        )}
      </div>
    </div>
  );
}

