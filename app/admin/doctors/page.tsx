"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Edit2, Trash2, CheckCircle2, Star, Eye, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Doctor, Governorate, City, SPECIALTIES } from "@/lib/types";

export default function AdminDoctorsPage() {
  const [search, setSearch] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    whatsapp: "",
    email: "",
    governorate_id: "",
    city_id: "",
    address: "",
    specialty: "",
    bio: "",
    map_url: "",
    image_url: "",
    verified: false,
    featured: false,
  });

  const [workingHours, setWorkingHours] = useState<Record<string, { active: boolean; from: string; to: string }>>({
    saturday: { active: false, from: "10:00 صباحاً", to: "06:00 مساءً" },
    sunday: { active: false, from: "10:00 صباحاً", to: "06:00 مساءً" },
    monday: { active: false, from: "10:00 صباحاً", to: "06:00 مساءً" },
    tuesday: { active: false, from: "10:00 صباحاً", to: "06:00 مساءً" },
    wednesday: { active: false, from: "10:00 صباحاً", to: "06:00 مساءً" },
    thursday: { active: false, from: "10:00 صباحاً", to: "06:00 مساءً" },
    friday: { active: false, from: "10:00 صباحاً", to: "06:00 مساءً" },
  });

  const handleDayToggle = (dayKey: string) => {
    setWorkingHours((prev) => ({
      ...prev,
      [dayKey]: { ...prev[dayKey], active: !prev[dayKey].active },
    }));
  };

  const handleTimeChange = (dayKey: string, field: "from" | "to", value: string) => {
    setWorkingHours((prev) => ({
      ...prev,
      [dayKey]: { ...prev[dayKey], [field]: value },
    }));
  };

  const startAdd = () => {
    setEditingDoctor({
      id: 0,
      name: "",
      phone: "",
      whatsapp: "",
      email: "",
      governorate_id: 0,
      city_id: undefined,
      address: "",
      specialty: "",
      bio: "",
      map_url: "",
      image_url: "",
      verified: true,
      featured: false,
      working_hours: null,
      created_at: new Date(),
    });
    setEditForm({
      name: "",
      phone: "",
      whatsapp: "",
      email: "",
      governorate_id: "",
      city_id: "",
      address: "",
      specialty: "",
      bio: "",
      map_url: "",
      image_url: "",
      verified: true,
      featured: false,
    });
    setWorkingHours({
      saturday: { active: false, from: "10:00 صباحاً", to: "06:00 مساءً" },
      sunday: { active: false, from: "10:00 صباحاً", to: "06:00 مساءً" },
      monday: { active: false, from: "10:00 صباحاً", to: "06:00 مساءً" },
      tuesday: { active: false, from: "10:00 صباحاً", to: "06:00 مساءً" },
      wednesday: { active: false, from: "10:00 صباحاً", to: "06:00 مساءً" },
      thursday: { active: false, from: "10:00 صباحاً", to: "06:00 مساءً" },
      friday: { active: false, from: "10:00 صباحاً", to: "06:00 مساءً" },
    });
  };

  useEffect(() => {
    async function loadDoctors() {
      const res = await fetch("/api/doctors?pageSize=200");
      const json = await res.json();
      if (json.data) setDoctors(json.data as Doctor[]);
      setLoading(false);
    }
    loadDoctors();
  }, []);

  useEffect(() => {
    async function loadLocations() {
      try {
        const [govRes, cityRes] = await Promise.all([
          fetch("/api/governorates"),
          fetch("/api/cities"),
        ]);
        const govs = await govRes.json();
        const cits = await cityRes.json();
        setGovernorates(govs);
        setCities(cits);
      } catch (err) {
        console.error("Error loading location data:", err);
      }
    }
    loadLocations();
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


  const startEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setEditForm({
      name: doctor.name,
      phone: doctor.phone,
      whatsapp: doctor.whatsapp || "",
      email: doctor.email || "",
      governorate_id: String(doctor.governorate_id),
      city_id: doctor.city_id ? String(doctor.city_id) : "",
      address: doctor.address,
      specialty: doctor.specialty,
      bio: doctor.bio || "",
      map_url: doctor.map_url || "",
      image_url: doctor.image_url || "",
      verified: doctor.verified,
      featured: doctor.featured,
    });

    let hoursObj = doctor.working_hours;
    if (typeof hoursObj === "string") {
      try { hoursObj = JSON.parse(hoursObj); } catch { hoursObj = null; }
    }
    const defaultHours = {
      saturday: { active: false, from: "10:00 صباحاً", to: "06:00 مساءً" },
      sunday: { active: false, from: "10:00 صباحاً", to: "06:00 مساءً" },
      monday: { active: false, from: "10:00 صباحاً", to: "06:00 مساءً" },
      tuesday: { active: false, from: "10:00 صباحاً", to: "06:00 مساءً" },
      wednesday: { active: false, from: "10:00 صباحاً", to: "06:00 مساءً" },
      thursday: { active: false, from: "10:00 صباحاً", to: "06:00 مساءً" },
      friday: { active: false, from: "10:00 صباحاً", to: "06:00 مساءً" },
    };

    if (hoursObj && typeof hoursObj === "object") {
      const loaded: any = { ...defaultHours };
      Object.entries(hoursObj).forEach(([day, val]: [string, any]) => {
        if (loaded[day]) {
          loaded[day] = {
            active: true,
            from: val.from || "10:00 صباحاً",
            to: val.to || "06:00 مساءً",
          };
        }
      });
      setWorkingHours(loaded);
    } else {
      setWorkingHours(defaultHours);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingDoctor) return;
    if (!editForm.name.trim() || !editForm.phone.trim() || !editForm.governorate_id || !editForm.address.trim() || !editForm.specialty) {
      alert("يرجى ملء الحقول الأساسية");
      return;
    }

    const activeWorkingHours: Record<string, { from: string; to: string }> = {};
    Object.entries(workingHours).forEach(([day, data]) => {
      if (data.active) {
        activeWorkingHours[day] = { from: data.from, to: data.to };
      }
    });
    const hoursPayload = Object.keys(activeWorkingHours).length > 0 ? activeWorkingHours : null;

    const payload: any = {
      name: editForm.name,
      phone: editForm.phone,
      whatsapp: editForm.whatsapp || null,
      email: editForm.email || null,
      governorate_id: parseInt(editForm.governorate_id),
      city_id: editForm.city_id ? parseInt(editForm.city_id) : null,
      address: editForm.address,
      specialty: editForm.specialty,
      bio: editForm.bio || null,
      map_url: editForm.map_url || null,
      image_url: editForm.image_url || null,
      verified: editForm.verified,
      featured: editForm.featured,
      working_hours: hoursPayload,
    };

    const isAdding = editingDoctor.id === 0;

    try {
      const url = "/api/doctors";
      const method = isAdding ? "POST" : "PUT";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isAdding ? payload : { id: editingDoctor.id, ...payload }),
      });

      const json = await res.json();
      if (json.data) {
        const updatedGov = governorates.find(g => g.id === parseInt(editForm.governorate_id));
        const updatedCity = cities.find(c => c.id === (editForm.city_id ? parseInt(editForm.city_id) : null));
        
        const resultDoctor: Doctor = {
          ...json.data,
          governorate: updatedGov,
          city: updatedCity
        };

        if (isAdding) {
          setDoctors((prev) => [resultDoctor, ...prev]);
        } else {
          setDoctors((prev) =>
            prev.map((d) => (d.id === editingDoctor.id ? resultDoctor : d))
          );
        }
        setEditingDoctor(null);
      } else {
        alert(isAdding ? "حدث خطأ أثناء إضافة الطبيبة" : "حدث خطأ أثناء تعديل بيانات الطبيبة");
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ في الاتصال بالخادم");
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
        <Button variant="pink" id="add-doctor-btn" onClick={startAdd}>
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
                        <button
                          onClick={() => startEdit(doctor)}
                          className="p-1.5 rounded-lg text-purple-500 hover:bg-purple-50"
                          title="تعديل"
                        >
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

      {/* Edit Doctor Modal */}
      {editingDoctor && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-purple-50 max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-purple-50 flex justify-between items-center bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-3xl" dir="rtl">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editingDoctor.id === 0 ? "إضافة طبيبة جديدة" : "تعديل بيانات الطبيبة"}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  {editingDoctor.id === 0 ? "إدخال بيانات طبيبة جديدة في الدليل" : `تحديث ملف الطبيبة: ${editingDoctor.name}`}
                </p>
              </div>
              <button
                onClick={() => setEditingDoctor(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-sm text-right" dir="rtl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">الاسم الكامل</label>
                  <Input
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">الهاتف</label>
                  <Input
                    value={editForm.phone}
                    onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">رقم واتساب</label>
                  <Input
                    value={editForm.whatsapp}
                    onChange={(e) => setEditForm(prev => ({ ...prev, whatsapp: e.target.value }))}
                  />
                </div>

                {/* Email */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">البريد الإلكتروني</label>
                  <Input
                    value={editForm.email}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                {/* Governorate */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">المحافظة</label>
                  <Select
                    value={editForm.governorate_id}
                    onValueChange={(v) => setEditForm(prev => ({ ...prev, governorate_id: v, city_id: "" }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المحافظة" />
                    </SelectTrigger>
                    <SelectContent>
                      {governorates.map((g) => (
                        <SelectItem key={g.id} value={String(g.id)}>{g.name_ar}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">المنطقة / الحي</label>
                  <Select
                    value={editForm.city_id}
                    onValueChange={(v) => setEditForm(prev => ({ ...prev, city_id: v }))}
                    disabled={!editForm.governorate_id}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المنطقة" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities
                        .filter(c => c.governorate_id === parseInt(editForm.governorate_id))
                        .map((c) => (
                          <SelectItem key={c.id} value={String(c.id)}>{c.name_ar}</SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">العنوان بالتفصيل</label>
                  <Input
                    value={editForm.address}
                    onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>

                {/* Specialty */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">التخصص</label>
                  <Select
                    value={editForm.specialty}
                    onValueChange={(v) => setEditForm(prev => ({ ...prev, specialty: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر التخصص" />
                    </SelectTrigger>
                    <SelectContent>
                      {SPECIALTIES.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Photo URL */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">رابط الصورة الشخصية</label>
                  <Input
                    value={editForm.image_url}
                    onChange={(e) => setEditForm(prev => ({ ...prev, image_url: e.target.value }))}
                  />
                </div>

                {/* Map URL */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">رابط خرائط جوجل</label>
                  <Input
                    value={editForm.map_url}
                    onChange={(e) => setEditForm(prev => ({ ...prev, map_url: e.target.value }))}
                  />
                </div>

                {/* Custom Working Hours */}
                <div className="sm:col-span-2 text-right">
                  <label className="block text-xs font-bold text-gray-700 mb-2">أوقات وساعات العمل</label>
                  <div className="space-y-2 bg-purple-50/20 border border-purple-100 rounded-xl p-4">
                    {[
                      { key: "saturday", label: "السبت" },
                      { key: "sunday", label: "الأحد" },
                      { key: "monday", label: "الإثنين" },
                      { key: "tuesday", label: "الثلاثاء" },
                      { key: "wednesday", label: "الأربعاء" },
                      { key: "thursday", label: "الخميس" },
                      { key: "friday", label: "الجمعة" },
                    ].map((day) => {
                      const dayData = workingHours[day.key] || { active: false, from: "10:00 صباحاً", to: "06:00 مساءً" };
                      return (
                        <div key={day.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 last:pb-0 border-b border-purple-100/40 last:border-0">
                          {/* Day Toggle */}
                          <div
                            className="flex items-center gap-2 cursor-pointer select-none"
                            onClick={() => handleDayToggle(day.key)}
                          >
                            <div
                              className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                                dayData.active
                                  ? "bg-purple-600 border-purple-600 text-white"
                                  : "border-gray-300 bg-white"
                              }`}
                            >
                              {dayData.active && <CheckCircle2 className="w-3 h-3 text-white" />}
                            </div>
                            <span className={`text-xs font-bold ${dayData.active ? "text-purple-700" : "text-gray-600"}`}>
                              {day.label}
                            </span>
                          </div>

                          {/* Time fields */}
                          {dayData.active ? (
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-gray-500">من:</span>
                              <Input
                                type="text"
                                placeholder="10:00 صباحاً"
                                className="w-28 h-8 text-[11px] py-1 px-2"
                                value={dayData.from}
                                onChange={(e) => handleTimeChange(day.key, "from", e.target.value)}
                              />
                              <span className="text-[10px] text-gray-500">إلى:</span>
                              <Input
                                type="text"
                                placeholder="06:00 مساءً"
                                className="w-28 h-8 text-[11px] py-1 px-2"
                                value={dayData.to}
                                onChange={(e) => handleTimeChange(day.key, "to", e.target.value)}
                              />
                            </div>
                          ) : (
                            <span className="text-[10px] text-gray-400 font-semibold">مغلق</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bio */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">نبذة تعريفية</label>
                  <Textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                    rows={4}
                  />
                </div>

                {/* Verified & Featured toggles */}
                <div className="flex gap-6 sm:col-span-2 py-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editForm.verified}
                      onChange={(e) => setEditForm(prev => ({ ...prev, verified: e.target.checked }))}
                      className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-gray-300"
                    />
                    <span className="font-semibold text-gray-700">موثقة (Verified)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editForm.featured}
                      onChange={(e) => setEditForm(prev => ({ ...prev, featured: e.target.checked }))}
                      className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-gray-300"
                    />
                    <span className="font-semibold text-gray-700">مميزة (Featured)</span>
                  </label>
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-purple-50 flex gap-3 justify-end bg-gray-50 rounded-b-3xl">
              <Button variant="outline" onClick={() => setEditingDoctor(null)}>
                إلغاء
              </Button>
              <Button variant="pink" onClick={handleSaveEdit}>
                {editingDoctor.id === 0 ? "إضافة الطبيبة" : "حفظ التغييرات"}
              </Button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
