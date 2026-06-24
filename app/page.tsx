import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeroSearch from "@/components/home/HeroSearch";
import StatsSection from "@/components/home/StatsSection";
import CTASection from "@/components/home/CTASection";
import DoctorCard from "@/components/doctors/DoctorCard";
import { prisma } from "@/lib/prisma";
import { SITE_URL, SITE_NAME, OG_IMAGE, BASE_KEYWORDS, canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: `${SITE_NAME} | في مختلف التخصصات الطبية - الرئيسية`,
  description:
    "ابحثي عن أفضل الطبيبات في مختلف التخصصات الطبية في مصر. دليل موثوق يضم مئات الطبيبات الموثوقات في جميع المحافظات المصرية. طبيبة نساء، باطنة، جراحة، وغيرها.",
  keywords: [
    ...BASE_KEYWORDS,
    "طبيبة نساء في القاهرة",
    "طبيبة نساء في الجيزة",
    "طبيبة نساء في الإسكندرية",
    "دكتورة نساء وتوليد",
    "طبيبة نساء في الفيوم",
  ],
  alternates: { canonical: canonical("/") },
  openGraph: {
    title: `${SITE_NAME} | في مختلف التخصصات الطبية`,
    description: "ابحثي عن أفضل الطبيبات في مختلف التخصصات الطبية في مصر. دليل موثوق لطبيبات مصر.",
    url: SITE_URL,
    type: "website",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | في مختلف التخصصات الطبية`,
    description: "ابحثي عن أفضل الطبيبات في مختلف التخصصات الطبية في مصر.",
    images: [OG_IMAGE.url],
  },
};

export default async function HomePage() {
  const [latestDoctors, governorates, totalDoctors, totalGovernorates, totalCities] =
    await Promise.all([
      prisma.doctor.findMany({
        where: { verified: true },
        include: {
          governorate: { select: { id: true, name_ar: true, name_en: true, slug: true } },
          city: { select: { id: true, name_ar: true, name_en: true, slug: true } },
        },
        orderBy: { created_at: "desc" },
        take: 6,
      }),
      prisma.governorate.findMany({ orderBy: { name_ar: "asc" } }),
      prisma.doctor.count({ where: { verified: true } }),
      prisma.governorate.count(),
      prisma.city.count(),
    ]);

  const stats = { totalDoctors, totalGovernorates, totalCities };

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Image background with overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/veiled_doctors.png')" }}
        />
        <div className="absolute inset-0 bg-black/60" />

        {/* Decorative orbs - subtle neutral light */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/5 blur-3xl" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 text-white text-sm font-medium mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 text-pink-300" />
              الدليل الطبي الموثوق للمرأة المصرية
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6 animate-fade-in">
              دليل{" "}
              <span className="text-pink-300">
                طبيبات مصر
              </span>
              <br />
              في مختلف التخصصات
            </h1>

            <p className="text-lg md:text-xl text-purple-100 max-w-2xl leading-relaxed mb-10 animate-fade-in">
              ابحثي عن أفضل الطبيبات في مختلف التخصصات الطبية القريبات منك في مصر.
              <br className="hidden md:block" />
              آلاف الطبيبات الموثوقات في كل المحافظات.
            </p>

            {/* Search Bar */}
            <div className="w-full animate-fade-in">
              <HeroSearch governorates={governorates} />
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-12 animate-fade-in">
              {[
                { value: `${stats.totalDoctors}+`, label: "طبيبة" },
                { value: `${stats.totalGovernorates}`, label: "محافظة" },
                { value: "100%", label: "موثوقات" },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-3xl font-bold text-white">{s.value}</p>
                  <p className="text-purple-200 text-sm">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" className="w-full" preserveAspectRatio="none">
            <path
              d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"
              className="fill-gray-50"
            />
          </svg>
        </div>
      </section>

      {/* Stats */}
      <StatsSection
        totalDoctors={stats.totalDoctors}
        totalGovernorates={stats.totalGovernorates}
        totalCities={stats.totalCities}
      />

      {/* Featured Doctors */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span className="text-purple-600 font-semibold text-sm">طبيبات الدليل</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">طبيبات مصر</h2>
              <p className="text-gray-500 mt-1">أحدث الطبيبات في مختلف التخصصات الطبية في مصر</p>
            </div>
            <Button variant="outline" asChild className="hidden sm:flex">
              <Link href="/doctors">
                <ArrowLeft className="w-4 h-4" />
                عرض الكل
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor as any} />
            ))}
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Button variant="outline" asChild>
              <Link href="/doctors">
                <ArrowLeft className="w-4 h-4" />
                عرض جميع الطبيبات
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Governorates Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">تصفحي بالمحافظة</h2>
            <p className="text-gray-500">اختاري محافظتك وابحثي عن أقرب طبيبة</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {governorates.map((gov) => (
              <Link
                key={gov.id}
                href={`/doctors?governorate=${gov.id}`}
                className="flex items-center justify-center p-3 rounded-xl border border-purple-100 bg-purple-50 hover:bg-purple-100 hover:border-purple-300 text-center text-sm font-medium text-purple-700 transition-all duration-200 hover:shadow-sm group"
              >
                <span className="group-hover:scale-105 transition-transform inline-block">
                  {gov.name_ar}
                </span>
              </Link>
            ))}
            <Link
              href="/doctors"
              className="flex items-center justify-center p-3 rounded-xl border border-pink-200 bg-pink-50 hover:bg-pink-100 text-center text-sm font-medium text-pink-700 transition-all duration-200 hover:shadow-sm"
            >
              كل المحافظات →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection />
    </>
  );
}