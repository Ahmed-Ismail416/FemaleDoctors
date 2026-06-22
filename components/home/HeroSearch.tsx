"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Governorate, SPECIALTIES } from "@/lib/types";

interface HeroSearchProps {
  governorates: Governorate[];
}

export default function HeroSearch({ governorates }: HeroSearchProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [specialty, setSpecialty] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (governorate && governorate !== "all") params.set("governorate", governorate);
    if (specialty && specialty !== "all") params.set("specialty", specialty);
    router.push(`/doctors?${params.toString()}`);
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 max-w-3xl w-full mx-auto border border-white/50">
      <p className="text-center text-gray-600 text-sm mb-4 font-medium">
        ابحثي عن طبيبة في مختلف التخصصات الطبية
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            id="hero-search"
            placeholder="اسم الطبيبة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pr-9 h-12 text-base"
          />
        </div>
        <div className="relative sm:w-44">
          <Select value={specialty} onValueChange={setSpecialty}>
            <SelectTrigger id="hero-specialty" className="h-12">
              <SelectValue placeholder="التخصص" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل التخصصات</SelectItem>
              {SPECIALTIES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="relative sm:w-44">
          <Select value={governorate} onValueChange={setGovernorate}>
            <SelectTrigger id="hero-governorate" className="h-12">
              <MapPin className="w-4 h-4 text-gray-400 ml-1" />
              <SelectValue placeholder="المحافظة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل المحافظات</SelectItem>
              {governorates.map((gov) => (
                <SelectItem key={gov.id} value={String(gov.id)}>
                  {gov.name_ar}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="pink"
          size="lg"
          onClick={handleSearch}
          id="hero-search-btn"
          className="h-12 px-8"
        >
          <Search className="w-5 h-5" />
          بحث
        </Button>
      </div>
    </div>
  );
}
