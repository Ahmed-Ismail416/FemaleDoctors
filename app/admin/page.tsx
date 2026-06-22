import {
  Users, CheckCircle2, Clock, XCircle, Building2, MapPin, Star, ClipboardList, Heart
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const { count: totalDoctors } = await supabase.from("doctors").select("*", { count: "exact", head: true });
  const { count: verifiedDoctors } = await supabase.from("doctors").select("*", { count: "exact", head: true }).eq("verified", true);
  const { count: featuredDoctors } = await supabase.from("doctors").select("*", { count: "exact", head: true }).eq("featured", true);
  
  const { count: pendingApps } = await supabase.from("applications").select("*", { count: "exact", head: true }).eq("status", "pending");
  const { count: approvedApps } = await supabase.from("applications").select("*", { count: "exact", head: true }).eq("status", "approved");
  const { count: rejectedApps } = await supabase.from("applications").select("*", { count: "exact", head: true }).eq("status", "rejected");

  const { count: totalGovernorates } = await supabase.from("governorates").select("*", { count: "exact", head: true });
  const { count: totalCities } = await supabase.from("cities").select("*", { count: "exact", head: true });

  const stats = [
    {
      label: "إجمالي الطبيبات",
      value: totalDoctors || 0,
      icon: <Users className="w-6 h-6" />,
      color: "text-purple-600",
      bg: "bg-purple-50",
      href: "/admin/doctors",
    },
    {
      label: "الطبيبات الموثوقات",
      value: verifiedDoctors || 0,
      icon: <CheckCircle2 className="w-6 h-6" />,
      color: "text-green-600",
      bg: "bg-green-50",
      href: "/admin/doctors",
    },
    {
      label: "طلبات معلقة",
      value: pendingApps || 0,
      icon: <Clock className="w-6 h-6" />,
      color: "text-orange-600",
      bg: "bg-orange-50",
      href: "/admin/applications",
    },
    {
      label: "طلبات مقبولة",
      value: approvedApps || 0,
      icon: <CheckCircle2 className="w-6 h-6" />,
      color: "text-blue-600",
      bg: "bg-blue-50",
      href: "/admin/applications",
    },
    {
      label: "طلبات مرفوضة",
      value: rejectedApps || 0,
      icon: <XCircle className="w-6 h-6" />,
      color: "text-red-600",
      bg: "bg-red-50",
      href: "/admin/applications",
    },
    {
      label: "طبيبات مميزات",
      value: featuredDoctors || 0,
      icon: <Star className="w-6 h-6" />,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      href: "/admin/featured",
    },
    {
      label: "المحافظات",
      value: totalGovernorates || 0,
      icon: <MapPin className="w-6 h-6" />,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      href: "/admin/governorates",
    },
    {
      label: "المدن والأحياء",
      value: totalCities || 0,
      icon: <Building2 className="w-6 h-6" />,
      color: "text-pink-600",
      bg: "bg-pink-50",
      href: "/admin/cities",
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
        <p className="text-gray-500 text-sm mt-1">مرحباً بك في لوحة إدارة دليل الطبيبات</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <Link
            key={i}
            href={stat.href}
            className={`${stat.bg} rounded-2xl p-5 hover:shadow-md transition-all duration-200 group`}
          >
            <div className={`${stat.color} mb-3 group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-orange-500" />
            الطلبات المعلقة
          </h2>
          <p className="text-gray-500 text-sm mb-4">
            يوجد <span className="font-bold text-orange-600">{pendingApps || 0}</span> طلبات تنتظر المراجعة
          </p>
          <Link
            href="/admin/applications"
            className="inline-flex items-center gap-2 bg-orange-50 hover:bg-orange-100 text-orange-700 font-medium text-sm px-4 py-2 rounded-lg transition-colors"
          >
            مراجعة الطلبات →
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-purple-500" />
            إجراءات سريعة
          </h2>
          <div className="flex flex-col gap-2">
            <Link
              href="/admin/doctors"
              className="flex items-center gap-2 text-sm text-purple-700 hover:text-purple-900 font-medium py-1"
            >
              + إضافة طبيبة جديدة
            </Link>
            <Link
              href="/admin/governorates"
              className="flex items-center gap-2 text-sm text-purple-700 hover:text-purple-900 font-medium py-1"
            >
              + إضافة محافظة
            </Link>
            <Link
              href="/admin/cities"
              className="flex items-center gap-2 text-sm text-purple-700 hover:text-purple-900 font-medium py-1"
            >
              + إضافة مدينة
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
