"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Clock, Eye } from "lucide-react";
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
    </div>
  );
}
