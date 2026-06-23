import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Phone, MessageCircle, MapPin, Building2, Map,
  ArrowRight, CheckCircle2, FileText, Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { buildWhatsAppLink } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const doctor = await prisma.doctor.findUnique({
    where: { id: parseInt(id) },
    include: { governorate: true },
  });

  if (!doctor) return { title: "طبيبة غير موجودة" };
  return {
    title: `${doctor.name} - ${doctor.specialty}`,
    description: `${doctor.name} - ${doctor.specialty} في ${doctor.governorate?.name_ar}. ${doctor.bio?.slice(0, 150)}`,
  };
}

export default async function DoctorProfilePage({ params }: Props) {
  const { id } = await params;
  const doctor = await prisma.doctor.findUnique({
    where: { id: parseInt(id) },
    include: {
      governorate: { select: { id: true, name_ar: true, name_en: true, slug: true } },
      city: { select: { id: true, name_ar: true, name_en: true, slug: true } },
    },
  });

  if (!doctor) notFound();

  const whatsappLink = doctor.whatsapp ? buildWhatsAppLink(doctor.whatsapp) : null;

  // Extract clean initials (strips Arabic doctor prefixes)
  const getInitials = (name: string) => {
    const clean = name.replace(/^(أ\.?\s*د\.?|د\.?|أ\.د\/|د\/)\s+/, "");
    return clean.trim().charAt(0) || "ط";
  };

  // JSON-LD structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: doctor.name,
    medicalSpecialty: doctor.specialty,
    address: {
      "@type": "PostalAddress",
      streetAddress: doctor.address,
      addressLocality: doctor.city?.name_ar,
      addressRegion: doctor.governorate?.name_ar,
      addressCountry: "EG",
    },
    telephone: doctor.phone,
    image: doctor.image_url,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-pink-100 py-3">
          <div className="container mx-auto px-4">
            <nav className="flex items-center gap-2 text-sm text-gray-500" aria-label="breadcrumb">
              <Link href="/" className="hover:text-purple-600 transition-colors">الرئيسية</Link>
              <span>/</span>
              <Link href="/doctors" className="hover:text-purple-600 transition-colors">الطبيبات</Link>
              <span>/</span>
              <span className="text-gray-900 font-medium truncate max-w-[150px] sm:max-w-none">{doctor.name}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-5 sm:py-8">

          {/* ══════════════════════════════════════════
              MOBILE-ONLY: Compact horizontal header card
          ══════════════════════════════════════════ */}
          <div className="lg:hidden mb-4">
            <div className="bg-white rounded-2xl border border-purple-100 shadow-sm overflow-hidden">
              {/* Top: avatar + info */}
              <div className="flex gap-3 p-4 items-start" dir="rtl">
                {/* Avatar */}
                <div className="relative w-20 h-20 shrink-0 rounded-full overflow-hidden border-2 border-purple-100 bg-purple-50">
                  {doctor.image_url ? (
                    <Image
                      src={doctor.image_url}
                      alt={doctor.name}
                      fill
                      sizes="80px"
                      loading="eager"
                      className="object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-200 to-pink-200 text-purple-700 font-bold text-2xl">
                      {getInitials(doctor.name)}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                    <h1 className="text-base font-bold text-gray-900 leading-tight">{doctor.name}</h1>
                    {doctor.verified && (
                      <Badge variant="success" className="text-[10px] px-1.5 py-0 rounded-full bg-green-50 text-green-700 border-green-200 shrink-0">
                        <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" /> موثقة
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-pink-500 mb-2">{doctor.specialty}</p>

                  {/* Location */}
                  {doctor.map_url ? (
                    <a
                      href={doctor.map_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-purple-600 transition-colors mb-1"
                    >
                      <MapPin className="w-3 h-3 text-purple-400 shrink-0" />
                      <span className="truncate">
                        {doctor.governorate?.name_ar}
                        {doctor.city && ` - ${doctor.city.name_ar}`}
                      </span>
                      <Map className="w-3 h-3 text-purple-400 shrink-0" />
                    </a>
                  ) : (
                    <div className="flex items-center gap-1 text-[11px] text-gray-500 mb-1">
                      <MapPin className="w-3 h-3 text-purple-400 shrink-0" />
                      <span className="truncate">
                        {doctor.governorate?.name_ar}
                        {doctor.city && ` - ${doctor.city.name_ar}`}
                      </span>
                    </div>
                  )}

                  {/* Address */}
                  <p className="text-[11px] text-gray-400 truncate pr-4 mb-1">{doctor.address}</p>

                  {/* Phone */}
                  <a
                    href={`tel:${doctor.phone}`}
                    className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-green-600 transition-colors"
                  >
                    <Phone className="w-3 h-3 text-green-400 shrink-0" />
                    <span dir="ltr">{doctor.phone}</span>
                  </a>
                </div>
              </div>

              {/* Mobile Action Buttons */}
              <div className="px-4 pb-4 flex gap-2">
                {whatsappLink ? (
                  <>
                    <Button variant="whatsapp" className="flex-1 h-11 text-sm font-bold rounded-xl" asChild>
                      <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="w-4 h-4 shrink-0" />
                        واتساب
                      </a>
                    </Button>
                    <Button variant="default" className="flex-1 h-11 text-sm font-bold rounded-xl" asChild>
                      <a href={`tel:${doctor.phone}`}>
                        <Phone className="w-4 h-4 shrink-0" />
                        اتصال
                      </a>
                    </Button>
                  </>
                ) : (
                  <Button variant="default" className="w-full h-11 text-sm font-bold rounded-xl" asChild>
                    <a href={`tel:${doctor.phone}`}>
                      <Phone className="w-4 h-4 shrink-0" />
                      {doctor.phone}
                    </a>
                  </Button>
                )}
              </div>

              {/* Map button on mobile */}
              {doctor.map_url && (
                <div className="px-4 pb-4">
                  <Button variant="secondary" className="w-full h-10 text-sm rounded-xl" asChild>
                    <a href={doctor.map_url} target="_blank" rel="noopener noreferrer">
                      <Map className="w-4 h-4 shrink-0" />
                      عرض على خرائط جوجل
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* ══════════════════════════════════════════
              MAIN GRID (sidebar hidden on mobile)
          ══════════════════════════════════════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Sidebar (Desktop only) ── */}
            <div className="hidden lg:block lg:col-span-1 space-y-5">
              {/* Profile Card */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-pink-100">
                <div className="relative h-56 bg-gradient-to-br from-pink-100 to-purple-100">
                  {doctor.image_url ? (
                    <Image
                      src={doctor.image_url}
                      alt={doctor.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      loading="eager"
                      className="object-cover object-top"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-300 to-pink-300 flex items-center justify-center text-white text-5xl font-bold shadow-lg">
                        {getInitials(doctor.name)}
                      </div>
                    </div>
                  )}
                  {doctor.verified && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="success">
                        <CheckCircle2 className="w-3 h-3 ml-1" /> موثقة
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h1 className="text-xl font-bold text-gray-900 mb-1">{doctor.name}</h1>
                  <p className="text-purple-600 font-medium text-sm mb-4">{doctor.specialty}</p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                      <span>{doctor.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building2 className="w-4 h-4 text-purple-500 shrink-0" />
                      <span>
                        {doctor.governorate?.name_ar}
                        {doctor.city && ` - ${doctor.city.name_ar}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Card */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-100 space-y-3">
                <h2 className="font-bold text-gray-900 mb-4">التواصل مع الطبيبة</h2>
                <Button variant="default" size="lg" className="w-full" asChild>
                  <a href={`tel:${doctor.phone}`}>
                    <Phone className="w-5 h-5" />
                    {doctor.phone}
                  </a>
                </Button>
                {whatsappLink && (
                  <Button variant="whatsapp" size="lg" className="w-full" asChild>
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="w-5 h-5" />
                      تواصل عبر واتساب
                    </a>
                  </Button>
                )}
                {doctor.email && (
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a href={`mailto:${doctor.email}`}>
                      <Mail className="w-4 h-4" />
                      {doctor.email}
                    </a>
                  </Button>
                )}
                {doctor.map_url && (
                  <Button variant="secondary" size="sm" className="w-full" asChild>
                    <a href={doctor.map_url} target="_blank" rel="noopener noreferrer">
                      <Map className="w-4 h-4" />
                      عرض على خرائط جوجل
                    </a>
                  </Button>
                )}
              </div>

              {/* Back button */}
              <Button variant="outline" asChild className="w-full">
                <Link href="/doctors">
                  <ArrowRight className="w-4 h-4" />
                  العودة للدليل
                </Link>
              </Button>
            </div>

            {/* ── Main Content ── */}
            <div className="lg:col-span-2 space-y-4">
              {/* Bio */}
              {doctor.bio && (
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-100">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-5 h-5 text-purple-600" />
                    <h2 className="text-lg font-bold text-gray-900">نبذة عن الطبيبة</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{doctor.bio}</p>
                </div>
              )}

              {/* Clinic Details */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4">معلومات العيادة</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: "الاسم", value: doctor.name },
                    { label: "التخصص", value: doctor.specialty },
                    { label: "المحافظة", value: doctor.governorate?.name_ar || "-" },
                    { label: "المنطقة", value: doctor.city?.name_ar || "-" },
                    { label: "العنوان", value: doctor.address },
                    { label: "رقم الهاتف", value: doctor.phone },
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col bg-purple-50/50 rounded-xl p-3">
                      <span className="text-[11px] text-purple-500 font-medium mb-0.5">{item.label}</span>
                      <span className="text-sm text-gray-900 font-semibold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map */}
              {doctor.map_url && (
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-pink-100">
                  <div className="p-4 border-b border-pink-50 flex items-center gap-2">
                    <Map className="w-5 h-5 text-purple-600" />
                    <h2 className="text-lg font-bold text-gray-900">الموقع على الخريطة</h2>
                  </div>
                  <div className="p-4">
                    <div className="rounded-xl overflow-hidden h-48 bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
                      <Button variant="outline" asChild>
                        <a href={doctor.map_url} target="_blank" rel="noopener noreferrer">
                          <Map className="w-4 h-4" />
                          فتح في خرائط جوجل
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile-only back button */}
              <Button variant="outline" asChild className="w-full lg:hidden">
                <Link href="/doctors">
                  <ArrowRight className="w-4 h-4" />
                  العودة لدليل الطبيبات
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
