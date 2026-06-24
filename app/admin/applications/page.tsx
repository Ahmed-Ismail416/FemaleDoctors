"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle2, XCircle, Clock, Eye, X, User, Phone, MessageCircle, Mail,
  MapPin, Map, Briefcase, FileText, Image as ImageIcon, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Application } from "@/lib/types";

const statusLabels: Record<Application["status"], string> = {
  pending: "معلق",
  approved: "مقبول",
  rejected: "مرفوض",
};

const statusVariants: Record<Application["status"], "pending" | "success" | "destructive"> = {
  pending: "pending",
  approved: "success",
  rejected: "destructive",
};

export default function AdminApplicationsPage() {
  const [filter, setFilter] = useState<"all" | Application["status"]>("all");
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  useEffect(() => {
    async function loadApplications() {
      try {
        const res = await fetch("/api/applications");
        const json = await res.json();
        if (json.data) {
          setApplications(json.data);
        }
      } catch (err) {
        console.error("Error loading applications:", err);
      } finally {
        setLoading(false);
      }
    }
    loadApplications();
  }, []);

  const filtered = filter === "all" ? applications : applications.filter((a) => a.status === filter);

  const updateStatus = async (id: number, status: Application["status"]) => {
    try {
      const res = await fetch("/api/applications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const json = await res.json();
      if (!json.error) {
        setApplications((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status } : a))
        );
      } else {
        alert("Error: " + json.error);
      }
    } catch (err) {
      console.error("Error updating application status:", err);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">الطلبات المقدمة</h1>
        <p className="text-gray-500 text-sm mt-1">مراجعة طلبات تسجيل الطبيبات الجديدات</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { value: "all", label: "الكل", count: applications.length },
          { value: "pending", label: "معلقة", count: applications.filter((a) => a.status === "pending").length },
          { value: "approved", label: "مقبولة", count: applications.filter((a) => a.status === "approved").length },
          { value: "rejected", label: "مرفوضة", count: applications.filter((a) => a.status === "rejected").length },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value as typeof filter)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === tab.value
                ? "bg-purple-600 text-white shadow-sm"
                : "bg-white text-gray-600 hover:bg-purple-50 border border-gray-200"
            }`}
          >
            {tab.label}
            <span className={`text-xs rounded-full px-1.5 py-0.5 ${
              filter === tab.value ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Applications Table */}
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
                <th className="text-right font-semibold text-purple-800 p-4">التاريخ</th>
                <th className="text-right font-semibold text-purple-800 p-4">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    جاري تحميل الطلبات...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">لا توجد طلبات</td>
                </tr>
              ) : (
                filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{app.doctor_name}</div>
                      <div className="text-xs text-gray-400">{app.email}</div>
                    </td>
                    <td className="p-4 text-gray-600">{app.specialty}</td>
                    <td className="p-4 text-gray-600">{app.governorate?.name_ar}</td>
                    <td className="p-4 text-gray-600 font-mono" dir="ltr">{app.phone}</td>
                    <td className="p-4">
                      <Badge variant={statusVariants[app.status]}>
                        {statusLabels[app.status]}
                      </Badge>
                    </td>
                    <td className="p-4 text-gray-500 text-xs">
                      {new Date(app.created_at).toLocaleDateString("ar-EG")}
                    </td>
                     <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 text-xs text-purple-700 border-purple-200 hover:bg-purple-50"
                          onClick={() => setSelectedApp(app)}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          تفاصيل
                        </Button>
                        {app.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="secondary"
                              className="h-7 px-2 bg-green-50 text-green-700 hover:bg-green-100 text-xs"
                              onClick={() => updateStatus(app.id, "approved")}
                              id={`approve-${app.id}`}
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              قبول
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-7 px-2 bg-red-50 text-red-600 hover:bg-red-100 text-xs border-0"
                              onClick={() => updateStatus(app.id, "rejected")}
                              id={`reject-${app.id}`}
                            >
                              <XCircle className="w-3 h-3" />
                              رفض
                            </Button>
                          </>
                        )}
                        {app.status === "approved" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-xs"
                            onClick={() => updateStatus(app.id, "pending")}
                          >
                            <Clock className="w-3 h-3" />
                            إعادة
                          </Button>
                        )}
                        {app.status === "rejected" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-xs"
                            onClick={() => updateStatus(app.id, "pending")}
                          >
                            <Clock className="w-3 h-3" />
                            إعادة
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Application Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-white rounded-3xl shadow-2xl border border-purple-50 max-w-3xl w-full max-h-[90vh] overflow-y-auto flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-purple-50 flex justify-between items-center bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-3xl" dir="rtl">
              <div>
                <h2 className="text-xl font-bold text-gray-900">تفاصيل طلب الطبيبة</h2>
                <p className="text-xs text-gray-500 mt-1">الرقم المرجعي: #{selectedApp.id}</p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm" dir="rtl">
              
              {/* Section 1: Personal info */}
              <div>
                <h3 className="text-base font-bold text-purple-800 mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-600" />
                  البيانات الشخصية
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-purple-50">
                  <div>
                    <span className="block text-xs text-gray-400 mb-1">الاسم الكامل (الرباعي)</span>
                    <span className="font-semibold text-gray-900">{selectedApp.doctor_name}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-400 mb-1">التخصص</span>
                    <span className="font-semibold text-pink-600">{selectedApp.specialty}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-400 mb-1">رقم الهاتف</span>
                    <a href={`tel:${selectedApp.phone}`} className="font-semibold text-purple-600 hover:underline inline-flex items-center gap-1" dir="ltr">
                      <Phone className="w-3.5 h-3.5" />
                      {selectedApp.phone}
                    </a>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-400 mb-1">رقم واتساب</span>
                    {selectedApp.whatsapp ? (
                      <a
                        href={`https://wa.me/${selectedApp.whatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-green-600 hover:underline inline-flex items-center gap-1"
                        dir="ltr"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        {selectedApp.whatsapp}
                      </a>
                    ) : (
                      <span className="text-gray-400">غير متوفر</span>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <span className="block text-xs text-gray-400 mb-1">البريد الإلكتروني</span>
                    {selectedApp.email ? (
                      <a href={`mailto:${selectedApp.email}`} className="font-semibold text-purple-600 hover:underline inline-flex items-center gap-1" dir="ltr">
                        <Mail className="w-3.5 h-3.5" />
                        {selectedApp.email}
                      </a>
                    ) : (
                      <span className="text-gray-400">غير متوفر</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 2: Location info */}
              <div>
                <h3 className="text-base font-bold text-purple-800 mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  معلومات الموقع والعيادة
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-purple-50">
                  <div>
                    <span className="block text-xs text-gray-400 mb-1">المحافظة</span>
                    <span className="font-semibold text-gray-900">{selectedApp.governorate?.name_ar || "غير محدد"}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-400 mb-1">المنطقة / الحي</span>
                    <span className="font-semibold text-gray-900">{selectedApp.city?.name_ar || "غير محدد"}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="block text-xs text-gray-400 mb-1">العنوان بالتفصيل</span>
                    <span className="font-semibold text-gray-900">{selectedApp.address}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="block text-xs text-gray-400 mb-1">موقع العيادة على جوجل ماب</span>
                    {selectedApp.map_url ? (
                      <a
                        href={selectedApp.map_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-purple-600 hover:underline inline-flex items-center gap-1"
                      >
                        <Map className="w-3.5 h-3.5" />
                        فتح على خرائط جوجل
                      </a>
                    ) : (
                      <span className="text-gray-400">غير متوفر</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 3: Professional Info (Bio & Working Hours) */}
              <div>
                <h3 className="text-base font-bold text-purple-800 mb-3 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-purple-600" />
                  المعلومات المهنية ومواعيد العمل
                </h3>
                <div className="grid grid-cols-1 gap-4 bg-gray-50 p-4 rounded-2xl border border-purple-50">
                  <div>
                    <span className="block text-xs text-gray-400 mb-2">مواعيد العمل في العيادة</span>
                    {selectedApp.working_hours ? (
                      (() => {
                        let hoursObj = selectedApp.working_hours;
                        if (typeof hoursObj === "string") {
                          try { hoursObj = JSON.parse(hoursObj); } catch { hoursObj = null; }
                        }
                        if (!hoursObj || typeof hoursObj !== "object") {
                          return <span className="text-gray-400">لم يتم تحديد مواعيد عمل</span>;
                        }

                        const days = [
                          { key: "saturday", label: "السبت" },
                          { key: "sunday", label: "الأحد" },
                          { key: "monday", label: "الإثنين" },
                          { key: "tuesday", label: "الثلاثاء" },
                          { key: "wednesday", label: "الأربعاء" },
                          { key: "thursday", label: "الخميس" },
                          { key: "friday", label: "الجمعة" },
                        ];

                        const activeDays = days.filter(d => {
                          const item = hoursObj[d.key];
                          return item && (item.active || (item.from && item.to));
                        });

                        if (activeDays.length === 0) {
                          return <span className="text-gray-400">لم يتم تحديد مواعيد عمل</span>;
                        }

                        return (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-1">
                            {days.map((day) => {
                              const item = hoursObj[day.key];
                              const isActive = item && (item.active || (item.from && item.to));
                              return (
                                <div 
                                  key={day.key} 
                                  className={`flex justify-between items-center px-3 py-1.5 rounded-lg text-xs ${
                                    isActive 
                                      ? "bg-purple-100/50 text-purple-900 font-medium" 
                                      : "bg-gray-100 text-gray-400 line-through"
                                  }`}
                                >
                                  <span>{day.label}</span>
                                  <span>
                                    {isActive 
                                      ? `من ${item.from} إلى ${item.to}` 
                                      : "مغلق"
                                    }
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()
                    ) : (
                      <span className="text-gray-400">لم يتم تحديد مواعيد عمل</span>
                    )}
                  </div>
                  <div>
                    <span className="block text-xs text-gray-400 mb-1">نبذة تعريفية</span>
                    <p className="text-gray-700 leading-relaxed bg-white p-3 rounded-xl border border-gray-100 whitespace-pre-line">
                      {selectedApp.bio || "لا توجد نبذة تعريفية مضافة."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 4: Documents and Previews */}
              <div>
                <h3 className="text-base font-bold text-purple-800 mb-3 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-purple-600" />
                  الصور والمستندات المرفقة
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Personal Photo Card */}
                  <div className="bg-gray-50 p-4 rounded-2xl border border-purple-50 flex flex-col items-center">
                    <span className="block text-xs text-gray-400 mb-3 self-start">الصورة الشخصية</span>
                    {selectedApp.image_url ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-purple-100 bg-purple-50 shadow-inner">
                          <img
                            src={selectedApp.image_url}
                            alt={selectedApp.doctor_name}
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                        <a
                          href={selectedApp.image_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-purple-600 font-bold hover:underline"
                        >
                          عرض الصورة بالحجم الكامل
                        </a>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-28 text-gray-400">
                        <User className="w-10 h-10 mb-1.5" />
                        <span className="text-xs">لا توجد صورة شخصية</span>
                      </div>
                    )}
                  </div>

                  {/* License Document Card */}
                  <div className="bg-gray-50 p-4 rounded-2xl border border-purple-50 flex flex-col items-center justify-between min-h-[160px]">
                    <span className="block text-xs text-gray-400 mb-2 self-start">وثيقة التحقق المهني</span>
                    {selectedApp.license_url ? (
                      <div className="flex flex-col items-center gap-3 w-full my-auto">
                        <div className="p-3 bg-purple-100/50 text-purple-700 rounded-2xl flex items-center justify-center">
                          <FileText className="w-8 h-8" />
                        </div>
                        <a
                          href={selectedApp.license_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
                        >
                          تحميل / عرض وثيقة الترخيص
                        </a>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400 my-auto">
                        <XCircle className="w-10 h-10 mb-1.5" />
                        <span className="text-xs">لا توجد وثيقة ترخيص مرفقة</span>
                      </div>
                    )}
                  </div>
                  
                </div>
              </div>

              {/* Section 5: Status and meta */}
              <div className="bg-purple-50/50 border border-purple-100 p-4 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs text-purple-600 mb-1">تاريخ تقديم الطلب</span>
                  <span className="font-semibold text-gray-900 inline-flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    {new Date(selectedApp.created_at).toLocaleDateString("ar-EG")} - {new Date(selectedApp.created_at).toLocaleTimeString("ar-EG", { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-purple-600 mb-1">حالة الطلب الحالية</span>
                  <Badge variant={statusVariants[selectedApp.status]} className="text-xs px-2.5 py-1">
                    {statusLabels[selectedApp.status]}
                  </Badge>
                </div>
              </div>

            </div>

            {/* Modal Footer (Actions) */}
            <div className="p-5 border-t border-purple-50 flex gap-3 justify-end bg-gray-50 rounded-b-3xl">
              <Button
                variant="outline"
                onClick={() => setSelectedApp(null)}
                className="rounded-xl"
              >
                إغلاق
              </Button>
              {selectedApp.status === "pending" && (
                <>
                  <Button
                    className="bg-red-50 text-red-600 hover:bg-red-100 border-0 rounded-xl"
                    onClick={() => {
                      updateStatus(selectedApp.id, "rejected");
                      setSelectedApp(null);
                    }}
                  >
                    <XCircle className="w-4 h-4 ml-1" />
                    رفض الطلب
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md"
                    onClick={() => {
                      updateStatus(selectedApp.id, "approved");
                      setSelectedApp(null);
                    }}
                  >
                    <CheckCircle2 className="w-4 h-4 ml-1" />
                    قبول ونشر الطبيبة
                  </Button>
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

