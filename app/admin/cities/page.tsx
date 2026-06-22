"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { City, Governorate } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

export default function AdminCitiesPage() {
  const supabase = createClient();
  const [cities, setCities] = useState<City[]>([]);
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newGov, setNewGov] = useState("");
  const [filterGov, setFilterGov] = useState("");

  useEffect(() => {
    async function loadData() {
      const { data: govs } = await supabase.from("governorates").select("*").order("name_ar");
      const { data: cits } = await supabase.from("cities").select("*").order("name_ar");
      if (govs) setGovernorates(govs);
      if (cits) setCities(cits);
      setLoading(false);
    }
    loadData();
  }, [supabase]);

  const filtered = filterGov
    ? cities.filter((c) => c.governorate_id === parseInt(filterGov))
    : cities;

  const handleAdd = async () => {
    if (!newName.trim() || !newGov) return;

    const newCity = {
      governorate_id: parseInt(newGov),
      name_ar: newName,
      name_en: newName,
      slug: newName.replace(/\s+/g, "-"),
    };

    const { data, error } = await supabase
      .from("cities")
      .insert([newCity])
      .select()
      .single();

    if (!error && data) {
      setCities((prev) => [...prev, data]);
      setNewName("");
      setNewGov("");
      setShowAdd(false);
    } else if (error) {
      alert("Error adding city: " + error.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذه المدينة؟")) {
      const { error } = await supabase.from("cities").delete().eq("id", id);
      if (!error) {
        setCities((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert("Error deleting city: " + error.message);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة المدن والأحياء</h1>
          <p className="text-gray-500 text-sm mt-1">{filtered.length} مدينة</p>
        </div>
        <Button variant="pink" onClick={() => setShowAdd(true)} id="add-city-btn">
          <Plus className="w-4 h-4" />
          إضافة مدينة
        </Button>
      </div>

      {showAdd && (
        <div className="bg-purple-50 rounded-2xl p-5 mb-6 border border-purple-100">
          <h2 className="font-bold text-gray-900 mb-3">إضافة مدينة / حي جديد</h2>
          <div className="flex gap-3 flex-wrap">
            <Select value={newGov} onValueChange={setNewGov}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="اختر المحافظة" />
              </SelectTrigger>
              <SelectContent>
                {governorates.map((g) => (
                  <SelectItem key={g.id} value={String(g.id)}>{g.name_ar}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              id="new-city-name"
              placeholder="اسم المدينة / الحي"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1 min-w-48"
            />
            <Button variant="pink" onClick={handleAdd}>إضافة</Button>
            <Button variant="outline" onClick={() => setShowAdd(false)}>إلغاء</Button>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="mb-4 w-60">
        <Select value={filterGov} onValueChange={setFilterGov}>
          <SelectTrigger id="filter-gov">
            <SelectValue placeholder="تصفية بالمحافظة" />
          </SelectTrigger>
          <SelectContent>
            {governorates.map((g) => (
              <SelectItem key={g.id} value={String(g.id)}>{g.name_ar}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-pink-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-purple-50 border-b border-purple-100">
              <th className="text-right font-semibold text-purple-800 p-4">الاسم</th>
              <th className="text-right font-semibold text-purple-800 p-4">المحافظة</th>
              <th className="text-right font-semibold text-purple-800 p-4">المعرف</th>
              <th className="text-right font-semibold text-purple-800 p-4">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-12 text-gray-400">
                  <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  جاري تحميل المدن...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-12 text-gray-400">لا توجد مدن</td>
              </tr>
            ) : (
              filtered.map((city) => {
                const gov = governorates.find((g) => g.id === city.governorate_id);
                return (
                  <tr key={city.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">{city.name_ar}</td>
                    <td className="p-4 text-gray-600">{gov?.name_ar}</td>
                    <td className="p-4 text-gray-400 font-mono text-xs">{city.slug}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded-lg text-purple-500 hover:bg-purple-50" title="تعديل">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(city.id)}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-50"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
