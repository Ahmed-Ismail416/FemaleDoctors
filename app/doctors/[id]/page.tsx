import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Phone, MessageCircle, MapPin, Building2, Star, Map,
  ArrowRight, CheckCircle2, Calendar, FileText, Mail
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
            <nav className="flex items-center gap-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-purple-600 transition-colors">الرئيسية</Link>
              <span>/</span>
              <Link href="/doctors" className="hover:text-purple-600 transition-colors">الطبيبات</Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">{doctor.name}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-pink-100">
                <div className="relative h-64 bg-gradient-to-br from-pink-100 to-purple-100">
                  {doctor.image_url ? (
                    <Image
                      src={doctor.image_url}
                      alt={doctor.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      loading="lazy"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-5xl font-bold shadow-xl">
                        {doctor.name.charAt(3)}
                      </div>
                    </div>
                  )}
                  {/* Badges */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {doctor.featured && (
                      <Badge variant="default">
                        <Star className="w-3 h-3 ml-1 fill-white" /> مميزة
                      </Badge>
                    )}
                    {doctor.verified && (
                      <Badge variant="success">
                        <CheckCircle2 className="w-3 h-3 ml-1" /> موثقة
                      </Badge>
                    )}
                  </div>
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

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Bio */}
              {doctor.bio && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-purple-600" />
                    <h2 className="text-xl font-bold text-gray-900">نبذة عن الطبيبة</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-base">{doctor.bio}</p>
                </div>
              )}

              {/* Details */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <h2 className="text-xl font-bold text-gray-900">معلومات العيادة</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "الاسم", value: doctor.name },
                    { label: "التخصص", value: doctor.specialty },
                    { label: "المحافظة", value: doctor.governorate?.name_ar || "-" },
                    { label: "المنطقة", value: doctor.city?.name_ar || "-" },
                    { label: "العنوان", value: doctor.address },
                    { label: "رقم الهاتف", value: doctor.phone },
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col">
                      <span className="text-xs text-gray-500 font-medium mb-0.5">{item.label}</span>
                      <span className="text-sm text-gray-900 font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map Embed */}
              {doctor.map_url && (
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-pink-100">
                  <div className="p-4 border-b border-pink-50">
                    <div className="flex items-center gap-2">
                      <Map className="w-5 h-5 text-purple-600" />
                      <h2 className="text-xl font-bold text-gray-900">الموقع على الخريطة</h2>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="rounded-xl overflow-hidden h-64 bg-purple-50 flex items-center justify-center">
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
