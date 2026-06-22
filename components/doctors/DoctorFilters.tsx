"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Governorate, City, SPECIALTIES } from "@/lib/types";

interface DoctorFiltersProps {
  governorates: Governorate[];
  cities: City[];
}

export default function DoctorFilters({ governorates, cities }: DoctorFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [governorate, setGovernorate] = useState(searchParams.get("governorate") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [specialty, setSpecialty] = useState(searchParams.get("specialty") || "");

  const filteredCities = governorate
    ? cities.filter((c) => c.governorate_id === parseInt(governorate))
    : cities;

  const handleSearch = () => {
    startTransition(() => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (governorate) params.set("governorate", governorate);
      if (city) params.set("city", city);
      if (specialty) params.set("specialty", specialty);
      router.push(`/doctors?${params.toString()}`);
    });
  };

  const handleReset = () => {
    setSearch("");
    setGovernorate("");
    setCity("");
    setSpecialty("");
    startTransition(() => {
      router.push("/doctors");
    });
  };

  const hasFilters = search || governorate || city || specialty;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-6">
      <div className="flex items-center gap-2 mb-5">
        <Filter className="w-5 h-5 text-purple-600" />
        <h2 className="text-base font-bold text-gray-900">بحث وتصفية</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search by name */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <Input
            placeholder="اسم الطبيبة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pr-9"
            id="search-input"
          />
        </div>

        {/* Governorate */}
        <Select value={governorate} onValueChange={(val) => { setGovernorate(val); setCity(""); }}>
          <SelectTrigger id="governorate-filter">
            <SelectValue placeholder="اختر المحافظة" />
          </SelectTrigger>
          <SelectContent>
            {governorates.map((gov) => (
              <SelectItem key={gov.id} value={String(gov.id)}>
                {gov.name_ar}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* City */}
        <Select value={city} onValueChange={setCity} disabled={!governorate}>
          <SelectTrigger id="city-filter">
            <SelectValue placeholder="اختر المنطقة" />
          </SelectTrigger>
          <SelectContent>
            {filteredCities.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.name_ar}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Specialty */}
        <Select value={specialty} onValueChange={setSpecialty}>
          <SelectTrigger id="specialty-filter">
            <SelectValue placeholder="التخصص" />
          </SelectTrigger>
          <SelectContent>
            {SPECIALTIES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-3 mt-4">
        <Button
          variant="pink"
          onClick={handleSearch}
          disabled={isPending}
          className="flex-1 sm:flex-none"
          id="apply-filters-btn"
        >
          <Search className="w-4 h-4" />
          {isPending ? "جاري البحث..." : "بحث"}
        </Button>
        {hasFilters && (
          <Button variant="outline" size="sm" onClick={handleReset} id="reset-filters-btn">
            <X className="w-4 h-4" />
            مسح
          </Button>
        )}
      </div>
    </div>
  );
}
