"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Governorate } from "@/lib/types";

export default function AdminGovernoratesPage() {
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editNameAr, setEditNameAr] = useState("");
  const [editNameEn, setEditNameEn] = useState("");
  const [editSlug, setEditSlug] = useState("");

  useEffect(() => {
    async function loadGovernorates() {
      const res = await fetch("/api/governorates");
      const data = await res.json();
      setGovernorates(data);
      setLoading(false);
    }
    loadGovernorates();
  }, []);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    const res = await fetch("/api/governorates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name_ar: newName }),
    });
    if (res.ok) {
      const data = await res.json();
      setGovernorates((prev) => [...prev, data]);
      setNewName("");
      setShowAdd(false);
    } else {
      alert("Error adding governorate");
    }
  };

  const handleUpdate = async (id: number) => {
    if (!editNameAr.trim()) return;
    const res = await fetch("/api/governorates", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        name_ar: editNameAr,
        name_en: editNameEn || editNameAr,
        slug: editSlug || editNameAr.replace(/\s+/g, "-"),
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setGovernorates((prev) =>
        prev.map((g) => (g.id === id ? data : g))
      );
      setEditingId(null);
    } else {
      alert("Error updating governorate");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذه المحافظة؟")) {
      const res = await fetch(`/api/governorates?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setGovernorates((prev) => prev.filter((g) => g.id !== id));
      } else {
        alert("Error deleting governorate");
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة المحافظات</h1>
          <p className="text-gray-500 text-sm mt-1">{governorates.length} محافظة</p>
        </div>
        <Button variant="pink" onClick={() => setShowAdd(true)} id="add-governorate-btn">
          <Plus className="w-4 h-4" />
          إضافة محافظة
        </Button>
      </div>

      {showAdd && (
        <div className="bg-purple-50 rounded-2xl p-5 mb-6 border border-purple-100">
          <h2 className="font-bold text-gray-900 mb-3">إضافة محافظة جديدة</h2>
          <div className="flex gap-3">
            <Input
              id="new-governorate-name"
              placeholder="اسم المحافظة بالعربية"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1"
            />
            <Button variant="pink" onClick={handleAdd}>إضافة</Button>
            <Button variant="outline" onClick={() => setShowAdd(false)}>إلغاء</Button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-pink-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-purple-50 border-b border-purple-100">
              <th className="text-right font-semibold text-purple-800 p-4">رقم</th>
              <th className="text-right font-semibold text-purple-800 p-4">الاسم بالعربية</th>
              <th className="text-right font-semibold text-purple-800 p-4">الاسم بالإنجليزية</th>
              <th className="text-right font-semibold text-purple-800 p-4">المعرف</th>
              <th className="text-right font-semibold text-purple-800 p-4">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-400">
                  <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  جاري تحميل المحافظات...
                </td>
              </tr>
            ) : governorates.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-400">لا توجد محافظات</td>
              </tr>
            ) : (
              governorates.map((gov) => {
                const isEditing = editingId === gov.id;
                return (
                  <tr key={gov.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-500 text-xs">{gov.id}</td>
                    <td className="p-4 font-medium text-gray-900">
                      {isEditing ? (
                        <Input
                          value={editNameAr}
                          onChange={(e) => setEditNameAr(e.target.value)}
                          className="h-8 py-1"
                        />
                      ) : (
                        gov.name_ar
                      )}
                    </td>
                    <td className="p-4 text-gray-600">
                      {isEditing ? (
                        <Input
                          value={editNameEn}
                          onChange={(e) => setEditNameEn(e.target.value)}
                          className="h-8 py-1"
                        />
                      ) : (
                        gov.name_en
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
                        gov.slug
                      )}
                    </td>
                    <td className="p-4">
                      {isEditing ? (
                        <div className="flex items-center gap-1.5">
                          <Button
                            size="sm"
                            className="h-7 px-2.5 bg-green-600 hover:bg-green-700 text-white text-xs"
                            onClick={() => handleUpdate(gov.id)}
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
                              setEditingId(gov.id);
                              setEditNameAr(gov.name_ar);
                              setEditNameEn(gov.name_en);
                              setEditSlug(gov.slug);
                            }}
                            className="p-1.5 rounded-lg text-purple-500 hover:bg-purple-50"
                            title="تعديل"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(gov.id)}
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
