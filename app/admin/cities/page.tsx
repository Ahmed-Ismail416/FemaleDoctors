"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { City, Governorate } from "@/lib/types";

export default function AdminCitiesPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newGov, setNewGov] = useState("");
  const [filterGov, setFilterGov] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editNameAr, setEditNameAr] = useState("");
  const [editNameEn, setEditNameEn] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editGovId, setEditGovId] = useState("");

  useEffect(() => {
    async function loadData() {
      const [govRes, cityRes] = await Promise.all([
        fetch("/api/governorates"),
        fetch("/api/cities"),
      ]);
      const govs = await govRes.json();
      const cits = await cityRes.json();
      setGovernorates(govs);
      setCities(cits);
      setLoading(false);
    }
    loadData();
  }, []);

  const filtered = filterGov
    ? cities.filter((c) => c.governorate_id === parseInt(filterGov))
    : cities;

  const handleAdd = async () => {
    if (!newName.trim() || !newGov) return;
    const res = await fetch("/api/cities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name_ar: newName, governorate_id: parseInt(newGov) }),
    });
    if (res.ok) {
      const data = await res.json();
      setCities((prev) => [...prev, data]);
      setNewName("");
      setNewGov("");
      setShowAdd(false);
    } else {
      alert("Error adding city");
    }
  };

  const handleUpdate = async (id: number) => {
    if (!editNameAr.trim() || !editGovId) return;
    const res = await fetch("/api/cities", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        name_ar: editNameAr,
        name_en: editNameEn || editNameAr,
        slug: editSlug || editNameAr.replace(/\s+/g, "-"),
        governorate_id: parseInt(editGovId),
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setCities((prev) =>
        prev.map((c) => (c.id === id ? data : c))
      );
      setEditingId(null);
    } else {
      alert("Error updating city");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذه المدينة؟")) {
      const res = await fetch(`/api/cities?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setCities((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert("Error deleting city");
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
                const isEditing = editingId === city.id;
                return (
                  <tr key={city.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">
                      {isEditing ? (
                        <Input
                          value={editNameAr}
                          onChange={(e) => setEditNameAr(e.target.value)}
                          className="h-8 py-1"
                        />
                      ) : (
                        city.name_ar
                      )}
                    </td>
                    <td className="p-4 text-gray-600">
                      {isEditing ? (
                        <Select value={editGovId} onValueChange={setEditGovId}>
                          <SelectTrigger className="h-8 py-1 w-40">
                            <SelectValue placeholder="اختر المحافظة" />
                          </SelectTrigger>
                          <SelectContent>
                            {governorates.map((g) => (
                              <SelectItem key={g.id} value={String(g.id)}>{g.name_ar}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        gov?.name_ar
                      )}
                    </td>
                    <td className="p-4 text-gray-400 font-mono text-xs">
                      {isEditing ? (
                        <Input
                          value={editSlug}
                          onChange={(e) => setEditSlug(e.target.value)}
                          className="h-8 py-1"
                        />
                      ) : (
                        city.slug
                      )}
                    </td>
                    <td className="p-4">
                      {isEditing ? (
                        <div className="flex items-center gap-1.5">
                          <Button
                            size="sm"
                            className="h-7 px-2.5 bg-green-600 hover:bg-green-700 text-white text-xs"
                            onClick={() => handleUpdate(city.id)}
                          >
                            حفظ
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2.5 text-xs"
                            onClick={() => setEditingId(null)}
                          >
                            إلغاء
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingId(city.id);
                              setEditNameAr(city.name_ar);
                              setEditNameEn(city.name_en || city.name_ar);
                              setEditSlug(city.slug);
                              setEditGovId(String(city.governorate_id));
                            }}
                            className="p-1.5 rounded-lg text-purple-500 hover:bg-purple-50"
                            title="تعديل"
                          >
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
                      )}
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
