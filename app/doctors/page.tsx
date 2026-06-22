import type { Metadata } from "next";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Users, ChevronRight, ChevronLeft } from "lucide-react";
import DoctorCard from "@/components/doctors/DoctorCard";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

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

  const where: Prisma.DoctorWhereInput = { verified: true };

  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { specialty: { contains: params.search, mode: "insensitive" } },
      { address: { contains: params.search, mode: "insensitive" } },
    ];
  }
  if (params.governorate) where.governorate_id = parseInt(params.governorate);
  if (params.city) where.city_id = parseInt(params.city);
  if (params.specialty) where.specialty = params.specialty;

  // Pagination calculations
  const currentPage = (() => {
    const parsed = parseInt(params.page || "1");
    return isNaN(parsed) || parsed < 1 ? 1 : parsed;
  })();
  const PAGE_SIZE = 12;
  const skip = (currentPage - 1) * PAGE_SIZE;

  const [governorates, cities, filtered, totalCount] = await Promise.all([
    prisma.governorate.findMany({ orderBy: { name_ar: "asc" } }),
    prisma.city.findMany({ orderBy: { name_ar: "asc" } }),
    prisma.doctor.findMany({
      where,
      include: {
        governorate: { select: { id: true, name_ar: true, name_en: true, slug: true } },
        city: { select: { id: true, name_ar: true, name_en: true, slug: true } },
      },
      orderBy: [{ featured: "desc" }, { created_at: "desc" }],
      take: PAGE_SIZE,
      skip,
    }),
    prisma.doctor.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const hasFilters =
    params.search || params.governorate || params.city || params.specialty;

  // Helper to build links preserving existing filters
  const buildPageLink = (pageNum: number) => {
    const query = new URLSearchParams();
    if (params.search) query.set("search", params.search);
    if (params.governorate) query.set("governorate", params.governorate);
    if (params.city) query.set("city", params.city);
    if (params.specialty) query.set("specialty", params.specialty);
    query.set("page", pageNum.toString());
    return `/doctors?${query.toString()}`;
  };

  // Helper to get array of page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

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
            {totalCount} طبيبة في مصر
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
                    {totalCount}
                  </span>{" "}
                  نتيجة
                </>
              ) : (
                <>
                  إجمالي{" "}
                  <span className="font-bold text-purple-700">
                    {totalCount}
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

        {/* Pagination Controls */}
        {filtered.length > 0 && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12" dir="rtl">
            {/* Previous Page Button */}
            <Link
              href={currentPage > 1 ? buildPageLink(currentPage - 1) : "#"}
              className={`inline-flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                currentPage > 1
                  ? "bg-white text-purple-700 border-purple-100 hover:bg-purple-50 hover:border-purple-200 active:scale-95"
                  : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed pointer-events-none"
              }`}
              aria-disabled={currentPage <= 1}
            >
              <ChevronRight className="w-4 h-4" />
              السابق
            </Link>

            {/* Page Numbers */}
            <div className="hidden sm:flex items-center gap-1.5">
              {getPageNumbers().map((pageNum) => {
                const isCurrent = pageNum === currentPage;
                return (
                  <Link
                    key={pageNum}
                    href={buildPageLink(pageNum)}
                    className={`w-10 h-10 inline-flex items-center justify-center rounded-xl text-sm font-bold transition-all duration-200 ${
                      isCurrent
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-200"
                        : "bg-white text-gray-700 border border-gray-150 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700"
                    }`}
                  >
                    {pageNum}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Current Page Indicator */}
            <span className="sm:hidden text-sm text-gray-600 font-medium">
              صفحة {currentPage} من {totalPages}
            </span>

            {/* Next Page Button */}
            <Link
              href={currentPage < totalPages ? buildPageLink(currentPage + 1) : "#"}
              className={`inline-flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                currentPage < totalPages
                  ? "bg-white text-purple-700 border-purple-100 hover:bg-purple-50 hover:border-purple-200 active:scale-95"
                  : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed pointer-events-none"
              }`}
              aria-disabled={currentPage >= totalPages}
            >
              التالي
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
