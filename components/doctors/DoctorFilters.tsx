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
  const [governorate, setGovernorate] = useState(
    searchParams.get("governorate") !== null ? searchParams.get("governorate")! : "17"
  );
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
  );  // Dropdowns auto-apply immediately
  const handleGovernorateChange = (val: string) => {
    const finalVal = val === "all" ? "" : val;
    setGovernorate(finalVal);
    setCity(""); // reset city when governorate changes
    navigate({ governorate: finalVal, city: "" });
  };

  const handleCityChange = (val: string) => {
    const finalVal = val === "all" ? "" : val;
    setCity(finalVal);
    navigate({ city: finalVal });
  };

  const handleSpecialtyChange = (val: string) => {
    const finalVal = val === "all" ? "" : val;
    setSpecialty(finalVal);
    navigate({ specialty: finalVal });
  };

  // Text search: apply on Enter key or button click
  const handleSearchApply = () => navigate({});

  const handleReset = () => {
    setSearch("");
    setGovernorate("17");
    setCity("");
    setSpecialty("");
    startTransition(() => {
      router.push("/doctors");
    });
  };

  const hasFilters = search || governorate !== "17" || city || specialty;

  return (
    <div className="space-y-4">
      {/* Name Search Box */}
      <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-5">
        <div className="flex gap-2 sm:gap-3">
          <div className="relative flex-grow">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <Input
              placeholder="ابحثي باسم الطبيبة"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchApply()}
              className="pr-10 h-12 rounded-xl text-sm border-purple-100 focus-visible:ring-purple-400 bg-gray-50/10"
              id="search-input"
            />
          </div>
          <Button
            variant="pink"
            onClick={handleSearchApply}
            disabled={isPending}
            className="h-12 px-5 sm:px-8 font-bold rounded-xl shadow-sm hover:shadow transition-all shrink-0"
            id="apply-filters-btn"
          >
            <Search className="w-4 h-4" />
            {isPending ? (
              <span>جاري...</span>
            ) : (
              <>
                <span className="hidden sm:inline">بحث بالاسم</span>
                <span className="inline sm:hidden">بحث</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-purple-600" />
            <h2 className="text-sm font-bold text-gray-900">تصفية النتائج حسب المنطقة أو التخصص</h2>
          </div>
          {isPending && (
            <span className="text-xs text-purple-500 animate-pulse font-medium">جاري التحديث...</span>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
          {/* Governorate Dropdown */}
          <div className="col-span-1 space-y-0.5 sm:space-y-1.5">
            <label className="hidden sm:block text-[11px] font-semibold text-gray-500 mr-1">المحافظة</label>
            <Select value={governorate || "all"} onValueChange={handleGovernorateChange}>
              <SelectTrigger id="governorate-filter" className="h-10 rounded-xl border-purple-100 bg-gray-50/20 text-xs sm:text-sm text-gray-700 px-2 sm:px-3" disabled={isPending}>
                <SelectValue placeholder="كل المحافظات" />
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

          {/* Specialty Dropdown */}
          <div className="col-span-1 space-y-0.5 sm:space-y-1.5">
            <label className="hidden sm:block text-[11px] font-semibold text-gray-500 mr-1">التخصص الطبي</label>
            <Select value={specialty || "all"} onValueChange={handleSpecialtyChange} disabled={isPending}>
              <SelectTrigger id="specialty-filter" className="h-10 rounded-xl border-purple-100 bg-gray-50/20 text-xs sm:text-sm text-gray-700 px-2 sm:px-3">
                <SelectValue placeholder="كل التخصصات" />
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

          {/* City Dropdown */}
          <div className="col-span-2 lg:col-span-1 space-y-0.5 sm:space-y-1.5">
            <label className="hidden sm:block text-[11px] font-semibold text-gray-500 mr-1">المنطقة / الحي</label>
            <Select value={city || "all"} onValueChange={handleCityChange} disabled={!governorate || isPending}>
              <SelectTrigger id="city-filter" className="h-10 rounded-xl border-purple-100 bg-gray-50/20 text-xs sm:text-sm text-gray-700 px-2 sm:px-3">
                <SelectValue placeholder="كل المناطق" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل المناطق</SelectItem>
                {filteredCities.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name_ar}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {hasFilters && (
          <div className="flex justify-end mt-4 pt-3 border-t border-purple-50">
            <Button variant="outline" size="sm" onClick={handleReset} className="h-9 px-4 rounded-xl text-xs text-gray-600 hover:text-purple-700 border-purple-100 hover:bg-purple-50" id="reset-filters-btn">
              <X className="w-3.5 h-3.5" />
              إعادة تعيين الكل
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}