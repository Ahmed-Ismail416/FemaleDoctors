"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

  // Generic navigate helper — accepts overrides so we can pass the new value
  // before state has had a chance to update.
  const navigate = useCallback(
    (overrides: {
      search?: string;
      governorate?: string;
      city?: string;
      specialty?: string;
    }) => {
      const merged = {
        search,
        governorate,
        city,
        specialty,
        ...overrides,
      };
      const params = new URLSearchParams();
      if (merged.search) params.set("search", merged.search);
      if (merged.governorate) params.set("governorate", merged.governorate);
      if (merged.city) params.set("city", merged.city);
      if (merged.specialty) params.set("specialty", merged.specialty);
      startTransition(() => {
        router.push(`/doctors?${params.toString()}`);
      });
    },
    [router, search, governorate, city, specialty],
  );

  // Dropdowns auto-apply immediately
  const handleGovernorateChange = (val: string) => {
    setGovernorate(val);
    setCity(""); // reset city when governorate changes
    navigate({ governorate: val, city: "" });
  };

  const handleCityChange = (val: string) => {
    setCity(val);
    navigate({ city: val });
  };

  const handleSpecialtyChange = (val: string) => {
    setSpecialty(val);
    navigate({ specialty: val });
  };

  // Text search: apply on Enter key or button click
  const handleSearchApply = () => navigate({});

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
        {isPending && (
          <span className="mr-auto text-xs text-purple-500 animate-pulse">جاري التحديث...</span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search by name — needs Enter or button */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <Input
            placeholder="اسم الطبيبة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearchApply()}
            className="pr-9"
            id="search-input"
          />
        </div>

        {/* Governorate — auto-applies on change */}
        <Select value={governorate} onValueChange={handleGovernorateChange}>
          <SelectTrigger id="governorate-filter" disabled={isPending}>
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

        {/* City — auto-applies on change */}
        <Select value={city} onValueChange={handleCityChange} disabled={!governorate || isPending}>
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

        {/* Specialty — auto-applies on change */}
        <Select value={specialty} onValueChange={handleSpecialtyChange} disabled={isPending}>
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
        {/* Search button — only for text search field */}
        <Button
          variant="pink"
          onClick={handleSearchApply}
          disabled={isPending}
          className="flex-1 sm:flex-none"
          id="apply-filters-btn"
        >
          <Search className="w-4 h-4" />
          {isPending ? "جاري البحث..." : "بحث"}
        </Button>

        {/* Clear all filters */}
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
