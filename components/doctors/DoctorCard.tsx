import Image from "next/image";
import Link from "next/link";
import { Phone, MapPin, MessageCircle, Map, ChevronLeft, Clock } from "lucide-react";
import { Doctor } from "@/lib/types";
import { buildWhatsAppLink, formatWorkingDaysSummary } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DoctorCardProps {
  doctor: Doctor;
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  const whatsappLink = doctor.whatsapp ? buildWhatsAppLink(doctor.whatsapp) : null;
  const workingHoursSummary = formatWorkingDaysSummary(doctor.working_hours);

  // Names are stored without titles — just take the first character
  const getInitials = (name: string) => name.trim().charAt(0) || "ط";

  return (
    <Card className="group overflow-hidden bg-white border border-purple-100 shadow-[0_2px_8px_-3px_rgba(168,85,247,0.1),_0_10px_20px_-15px_rgba(236,72,153,0.15)] hover:shadow-[0_8px_30px_rgba(168,85,247,0.12)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between">
      {/* Top Section: Avatar and Doctor Info */}
      <div className="flex gap-3 p-3.5 items-start" dir="rtl">
        {/* Right side: Avatar (first element in RTL flow) */}
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-full overflow-hidden border border-purple-100 bg-purple-50">
          {doctor.image_url ? (
            <Image
              src={doctor.image_url}
              alt={`د. ${doctor.name}`}
              fill
              sizes="(max-width: 640px) 56px, 64px"
              loading="lazy"
              className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-700 font-bold text-lg sm:text-xl">
              {getInitials(doctor.name)}
            </div>
          )}
        </div>

        {/* Left side: Info Content (second element in RTL flow) */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          {/* Name and Verification Badge */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="text-sm sm:text-base font-bold text-gray-800 leading-tight group-hover:text-purple-700 transition-colors">
              د. {doctor.name}
            </h3>
            {doctor.verified && (
              <Badge variant="success" className="text-[10px] px-1.5 py-0 rounded-full bg-green-50 text-green-700 border-green-200 hover:bg-green-50 shrink-0">
                ✓ موثقة
              </Badge>
            )}
          </div>

          {/* Specialty */}
          <p className="text-xs font-semibold text-pink-500 mt-1">{doctor.specialty}</p>

          {/* Governorate and City & Optional Address / Map link */}
          {doctor.map_url ? (
            <a
              href={doctor.map_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] sm:text-xs text-gray-500 hover:text-purple-600 transition-colors mt-1.5 max-w-full group/link"
            >
              <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span className="truncate border-b border-dashed border-gray-300 group-hover/link:border-purple-600">
                {doctor.governorate?.name_ar}
                {doctor.city && ` - ${doctor.city.name_ar}`}
                {doctor.address && ` (${doctor.address})`}
              </span>
              <Map className="w-3 h-3 text-purple-400 shrink-0 inline mr-0.5" />
            </a>
          ) : (
            <div className="flex items-center gap-1 text-[11px] sm:text-xs text-gray-500 mt-1.5 max-w-full">
              <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span className="truncate">
                {doctor.governorate?.name_ar}
                {doctor.city && ` - ${doctor.city.name_ar}`}
                {doctor.address && ` (${doctor.address})`}
              </span>
            </div>
          )}

          {/* Phone */}
          <div className="flex items-center gap-1 text-[11px] sm:text-xs text-gray-500 mt-1">
            <Phone className="w-3.5 h-3.5 text-green-400 shrink-0" />
            <a
              href={`tel:${doctor.phone}`}
              className="hover:text-green-600 hover:underline transition-colors font-medium"
              dir="ltr"
            >
              {doctor.phone}
            </a>
          </div>

          {/* Working Hours */}
          {workingHoursSummary && (
            <div className="flex items-center gap-1 text-[11px] sm:text-xs text-gray-700 mt-1">
              <Clock className="w-3.5 h-3.5 text-pink-600 shrink-0" />
              <span className="truncate">
                {workingHoursSummary}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons Section */}
      <div className="border-t border-purple-50 p-2.5 bg-gray-50/50 flex gap-2">
        {whatsappLink ? (
          <>
            <Button
              variant="whatsapp"
              className="flex-1 h-[42px] text-xs sm:text-sm font-bold rounded-xl shadow-sm hover:shadow"
              asChild
            >
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4 shrink-0" />
                واتساب
              </a>
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-[42px] text-xs sm:text-sm font-bold rounded-xl border-purple-200 text-purple-700 hover:bg-purple-50"
              asChild
            >
              <Link href={`/doctors/${doctor.id}`}>
                <ChevronLeft className="w-4 h-4 shrink-0" />
                التفاصيل
              </Link>
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            className="w-full h-[42px] text-xs sm:text-sm font-bold rounded-xl border-purple-200 text-purple-700 hover:bg-purple-50"
            asChild
          >
            <Link href={`/doctors/${doctor.id}`}>
              <ChevronLeft className="w-4 h-4 shrink-0" />
              التفاصيل
            </Link>
          </Button>
        )}
      </div>
    </Card>
  );
}

