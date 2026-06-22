"use client";

import { useState, useEffect } from "react";
import { Star, X } from "lucide-react";
import Image from "next/image";
import { Doctor } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function AdminFeaturedPage() {
  const supabase = createClient();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDoctors() {
      const { data } = await supabase
        .from("doctors")
        .select(`
          *,
          governorate:governorates(id, name_ar, name_en, slug),
          city:cities(id, name_ar, name_en, slug)
        `)
        .eq("verified", true)
        .order("created_at", { ascending: false });
      if (data) {
        setDoctors(data as any);
      }
      setLoading(false);
    }
    loadDoctors();
  }, []);

  const featured = doctors.filter((d) => d.featured);
  const notFeatured = doctors.filter((d) => d.verified && !d.featured);

  const toggleFeatured = async (id: number) => {
    const doc = doctors.find((d) => d.id === id);
    if (!doc) return;
    const newFeatured = !doc.featured;

    const { error } = await supabase
      .from("doctors")
      .update({ featured: newFeatured })
      .eq("id", id);

    if (!error) {
      setDoctors((prev) =>
        prev.map((d) => (d.id === id ? { ...d, featured: newFeatured } : d))
      );
    } else {
      alert("Error featuring doctor: " + error.message);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">إدارة الطبيبات المميزات</h1>
        <p className="text-gray-500 text-sm mt-1">
          الطبيبات المميزة تظهر في أعلى نتائج البحث والصفحة الرئيسية
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">
          <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          جاري تحميل الطبيبات...
        </div>
      ) : (
        <>
          {/* Currently Featured */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <h2 className="text-lg font-bold text-gray-900">الطبيبات المميزات حالياً ({featured.length})</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featured.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-xl p-4 border-2 border-yellow-200 shadow-sm flex items-center gap-3"
                >
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-purple-100 shrink-0">
                    {doc.image_url && (
                      <Image src={doc.image_url} alt={doc.name} fill className="object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{doc.name}</p>
                    <p className="text-xs text-gray-500 truncate">{doc.specialty}</p>
                    <Badge variant="secondary" className="text-xs mt-1">{doc.governorate?.name_ar}</Badge>
                  </div>
                  <button
                    onClick={() => toggleFeatured(doc.id)}
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 shrink-0"
                    title="إزالة من المميزين"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {featured.length === 0 && (
                <p className="text-gray-400 text-sm col-span-full">لا توجد طبيبات مميزات حالياً</p>
              )}
            </div>
          </div>

          {/* Add to Featured */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">إضافة طبيبة للمميزات</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {notFeatured.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex items-center gap-3 hover:border-purple-200 transition-colors"
                >
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-purple-100 shrink-0">
                    {doc.image_url && (
                      <Image src={doc.image_url} alt={doc.name} fill className="object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{doc.name}</p>
                    <p className="text-xs text-gray-500 truncate">{doc.specialty}</p>
                    <Badge variant="outline" className="text-xs mt-1">{doc.governorate?.name_ar}</Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="shrink-0 text-xs h-7"
                    onClick={() => toggleFeatured(doc.id)}
                  >
                    <Star className="w-3 h-3" />
                    تمييز
                  </Button>
                </div>
              ))}
              {notFeatured.length === 0 && (
                <p className="text-gray-400 text-sm col-span-full">لا توجد طبيبات متوفرة للتمييز</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
