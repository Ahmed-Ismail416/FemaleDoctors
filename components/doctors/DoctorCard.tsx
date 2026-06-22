import Image from "next/image";
import Link from "next/link";
import { Phone, MapPin, MessageCircle, Star, Map, ChevronLeft, Building2 } from "lucide-react";
import { Doctor } from "@/lib/types";
import { buildWhatsAppLink } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DoctorCardProps {
  doctor: Doctor;
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  const whatsappLink = doctor.whatsapp ? buildWhatsAppLink(doctor.whatsapp) : null;

  return (
    <Card className="group overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-pink-100">
      {/* Card Header with gradient */}
      <div className="relative h-48 bg-gradient-to-br from-pink-100 to-purple-100 overflow-hidden">
        {doctor.image_url ? (
          <Image
            src={doctor.image_url}
            alt={doctor.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            loading="lazy"
            className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              {doctor.name.charAt(3)}
            </div>
          </div>
        )}
        {/* Badges overlay */}
        <div className="absolute top-3 right-3 flex flex-col gap-1">
          {doctor.verified && (
            <Badge variant="success" className="text-xs shadow-sm">
              ✓ موثقة
            </Badge>
          )}
        </div>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      <CardContent className="p-5">
        {/* Name & Specialty */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-700 transition-colors leading-tight">
            {doctor.name}
          </h3>
          <p className="text-sm text-purple-600 font-medium mt-0.5">{doctor.specialty}</p>
        </div>

        {/* Location Info */}
        <div className="space-y-2 mb-4">
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
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-4 h-4 text-green-500 shrink-0" />
            <a
              href={`tel:${doctor.phone}`}
              className="hover:text-green-600 transition-colors font-medium"
              dir="ltr"
            >
              {doctor.phone}
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          {whatsappLink && (
            <Button variant="whatsapp" size="sm" asChild>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4" />
                واتساب
              </a>
            </Button>
          )}
          <Button variant="outline" size="sm" asChild>
            <Link href={`/doctors/${doctor.id}`}>
              <ChevronLeft className="w-4 h-4" />
              التفاصيل
            </Link>
          </Button>
          {doctor.map_url && (
            <Button variant="secondary" size="sm" asChild className="col-span-2">
              <a href={doctor.map_url} target="_blank" rel="noopener noreferrer">
                <Map className="w-4 h-4" />
                عرض على الخريطة
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
