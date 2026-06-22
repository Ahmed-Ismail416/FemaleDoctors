"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Edit2, Trash2, CheckCircle2, Star, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Doctor } from "@/lib/types";

export default function AdminDoctorsPage() {
  const [search, setSearch] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDoctors() {
      const res = await fetch("/api/doctors?pageSize=200");
      const json = await res.json();
      if (json.data) setDoctors(json.data as Doctor[]);
      setLoading(false);
    }
    loadDoctors();
  }, []);

  const filtered = doctors.filter(
    (d) =>
      d.name.includes(search) ||
      d.phone.includes(search) ||
      d.specialty.includes(search)
  );

  const toggleVerified = async (id: number) => {
    const doc = doctors.find((d) => d.id === id);
    if (!doc) return;
    const newVerified = !doc.verified;
    const res = await fetch("/api/doctors", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, verified: newVerified }),
    });
    if (res.ok) {
      setDoctors((prev) =>
        prev.map((d) => (d.id === id ? { ...d, verified: newVerified } : d))
      );
    }
  };


  const deleteDoctor = async (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذه الطبيبة؟")) {
      const res = await fetch(`/api/doctors?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setDoctors((prev) => prev.filter((d) => d.id !== id));
      }
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الطبيبات</h1>
          <p className="text-gray-500 text-sm mt-1">{filtered.length} طبيبة</p>
        </div>
        <Button variant="pink" id="add-doctor-btn">
          <Plus className="w-4 h-4" />
          إضافة طبيبة
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          id="admin-doctor-search"
          placeholder="البحث بالاسم أو الهاتف أو التخصص..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pr-9"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-pink-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-purple-50 border-b border-purple-100">
                <th className="text-right font-semibold text-purple-800 p-4">الاسم</th>
                <th className="text-right font-semibold text-purple-800 p-4">التخصص</th>
                <th className="text-right font-semibold text-purple-800 p-4">المحافظة</th>
                <th className="text-right font-semibold text-purple-800 p-4">الهاتف</th>
                <th className="text-right font-semibold text-purple-800 p-4">الحالة</th>
                <th className="text-right font-semibold text-purple-800 p-4">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    جاري تحميل الطبيبات...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">لا توجد نتائج</td>
                </tr>
              ) : (
                filtered.map((doctor) => (
                  <tr key={doctor.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{doctor.name}</div>
                      <div className="text-xs text-gray-400">{doctor.email}</div>
                    </td>
                    <td className="p-4 text-gray-600">{doctor.specialty}</td>
                    <td className="p-4 text-gray-600">{doctor.governorate?.name_ar}</td>
                    <td className="p-4 text-gray-600 font-mono" dir="ltr">{doctor.phone}</td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <Badge variant={doctor.verified ? "success" : "warning"} className="w-fit text-xs">
                          {doctor.verified ? "موثقة" : "غير موثقة"}
                        </Badge>

                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleVerified(doctor.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            doctor.verified
                              ? "text-green-600 hover:bg-green-50"
                              : "text-gray-400 hover:bg-gray-100"
                          }`}
                          title={doctor.verified ? "إلغاء التوثيق" : "توثيق"}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>

                        <Link href={`/doctors/${doctor.id}`} className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50" title="عرض">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button className="p-1.5 rounded-lg text-purple-500 hover:bg-purple-50" title="تعديل">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteDoctor(doctor.id)}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-50"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
