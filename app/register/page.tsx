"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2, AlertCircle, Upload, Heart, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SPECIALTIES, Governorate, City } from "@/lib/types";

type FormStatus = "idle" | "loading" | "success" | "error";

export default function RegisterPage() {
  const router = useRouter();
  const [status, setStatus] = useState<FormStatus>("idle");
  const [selectedGovernorate, setSelectedGovernorate] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    doctor_name: "",
    phone: "",
    whatsapp: "",
    email: "",
    governorate_id: "",
    city_id: "",
    address: "",
    specialty: "",
    bio: "",
    map_url: "",
  });

  useEffect(() => {
    async function loadLocations() {
      const [govRes, cityRes] = await Promise.all([
        fetch("/api/governorates"),
        fetch("/api/cities"),
      ]);
      const govs = await govRes.json();
      const cits = await cityRes.json();
      setGovernorates(govs);
      setCities(cits);
    }
    loadLocations();
  }, []);

  const filteredCities = selectedGovernorate
    ? cities.filter((c) => c.governorate_id === parseInt(selectedGovernorate))
    : [];

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const uploadFile = async (file: File, bucket: string): Promise<string> => {
    const form = new FormData();
    form.append("file", file);
    form.append("bucket", bucket);

    const res = await fetch("/api/upload", { method: "POST", body: form });
    const json = await res.json();
    if (json.error) throw new Error(json.error);
    return json.url as string;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmed) {
      alert("يجب تأكيد أنك طبيبة أنثى للمتابعة");
      return;
    }
    setStatus("loading");

    try {
      let image_url = "";
      let license_url = "";

      if (imageFile) {
        try {
          image_url = await uploadFile(imageFile, "doctor-images");
        } catch (err) {
          console.error("Image upload error:", err);
        }
      }

      if (licenseFile) {
        try {
          license_url = await uploadFile(licenseFile, "license-docs");
        } catch (err) {
          console.error("License upload error:", err);
        }
      }

      const payload = {
        doctor_name: formData.doctor_name,
        phone: formData.phone,
        whatsapp: formData.whatsapp || null,
        email: formData.email || null,
        governorate_id: parseInt(formData.governorate_id),
        city_id: formData.city_id ? parseInt(formData.city_id) : null,
        address: formData.address,
        specialty: formData.specialty,
        bio: formData.bio || null,
        map_url: formData.map_url || null,
        image_url: image_url || null,
        license_url: license_url || null,
      };

      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.error) {
        throw new Error(json.error);
      }

      setStatus("success");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "حدث خطأ أثناء إرسال الطلب");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-pink-100 p-10 text-center max-w-md w-full">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">تم إرسال طلبك بنجاح!</h2>
          <p className="text-gray-600 mb-2 leading-relaxed">
            شكراً لتسجيلك في دليل دكتورات النساء والتوليد في مصر.
          </p>
          <p className="text-gray-500 text-sm mb-6">
            سيتم مراجعة طلبك من قبل فريقنا خلال <strong>24-48 ساعة</strong> ثم سيتم نشره في الدليل.
          </p>
          <Badge variant="warning" className="text-sm py-1.5 px-4 mb-6">
            ⏳ في انتظار المراجعة
          </Badge>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => router.push("/")}>
              الرئيسية
            </Button>
            <Button variant="pink" className="flex-1" onClick={() => router.push("/doctors")}>
              تصفح الدليل
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 rounded-full px-4 py-2 text-sm font-medium mb-4">
            <Heart className="w-4 h-4 fill-purple-500" />
            تسجيل طبيبة جديدة
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            انضمي لدليل الطبيبات
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            سجّلي بياناتك للظهور في أكبر دليل لطبيبات أمراض النساء والتوليد في مصر
          </p>
        </div>

        {/* Important Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8 flex gap-3">
          <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-amber-800 mb-1">تنبيه هام</p>
            <p className="text-amber-700 text-sm leading-relaxed">
              متاح التسجيل للطبيبات الإناث فقط، وسيتم مراجعة جميع الطلبات قبل النشر.
              يتطلب التسجيل رفع صورة شخصية ووثيقة ترخيص طبي سارية لضمان موثوقية الدليل.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-pink-100 overflow-hidden">
          {/* Section: Personal Info */}
          <div className="p-6 border-b border-pink-50">
            <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-bold">١</span>
              البيانات الشخصية
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  الاسم الكامل <span className="text-red-500">*</span>
                </label>
                <Input
                  id="doctor_name"
                  placeholder="د. الاسم الأول الاسم الأخير"
                  value={formData.doctor_name}
                  onChange={(e) => handleChange("doctor_name", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  رقم الهاتف <span className="text-red-500">*</span>
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  dir="ltr"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  رقم واتساب
                </label>
                <Input
                  id="whatsapp"
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  dir="ltr"
                  value={formData.whatsapp}
                  onChange={(e) => handleChange("whatsapp", e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  البريد الإلكتروني
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="doctor@email.com"
                  dir="ltr"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Section: Location */}
          <div className="p-6 border-b border-pink-50">
            <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-bold">٢</span>
              موقع العيادة
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  المحافظة <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.governorate_id}
                  onValueChange={(v) => {
                    handleChange("governorate_id", v);
                    handleChange("city_id", "");
                    setSelectedGovernorate(v);
                  }}
                >
                  <SelectTrigger id="governorate">
                    <SelectValue placeholder="اختر المحافظة" />
                  </SelectTrigger>
                  <SelectContent>
                    {governorates.map((gov) => (
                      <SelectItem key={gov.id} value={String(gov.id)}>
                        {gov.name_ar}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  المنطقة / الحي
                </label>
                <Select
                  value={formData.city_id}
                  onValueChange={(v) => handleChange("city_id", v)}
                  disabled={!selectedGovernorate}
                >
                  <SelectTrigger id="city">
                    <SelectValue placeholder="اختر المنطقة" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCities.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name_ar}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  عنوان العيادة <span className="text-red-500">*</span>
                </label>
                <Input
                  id="address"
                  placeholder="رقم الشارع، اسم الشارع، المنطقة"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  رابط الموقع على خرائط جوجل
                </label>
                <Input
                  id="map_url"
                  type="url"
                  placeholder="https://maps.google.com/..."
                  dir="ltr"
                  value={formData.map_url}
                  onChange={(e) => handleChange("map_url", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Section: Professional */}
          <div className="p-6 border-b border-pink-50">
            <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-bold">٣</span>
              المعلومات المهنية
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  التخصص <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.specialty}
                  onValueChange={(v) => handleChange("specialty", v)}
                >
                  <SelectTrigger id="specialty">
                    <SelectValue placeholder="اختر التخصص" />
                  </SelectTrigger>
                  <SelectContent>
                    {SPECIALTIES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  نبذة تعريفية
                </label>
                <Textarea
                  id="bio"
                  placeholder="اكتبي نبذة مختصرة عن مؤهلاتك وخبراتك وتخصصاتك..."
                  rows={5}
                  value={formData.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                />
                <p className="text-xs text-gray-400 mt-1">هذا النص سيظهر في ملفك الشخصي</p>
              </div>
            </div>
          </div>

          {/* Section: Documents */}
          <div className="p-6 border-b border-pink-50">
            <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-bold">٤</span>
              الصور والمستندات
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  الصورة الشخصية <span className="text-red-500">*</span>
                </label>
                <label
                  htmlFor="image_upload"
                  className="flex flex-col items-center justify-center h-32 rounded-xl border-2 border-dashed border-purple-200 bg-purple-50 cursor-pointer hover:bg-purple-100 transition-colors"
                >
                  <Upload className="w-6 h-6 text-purple-400 mb-2" />
                  <span className="text-sm text-purple-600 font-medium">
                    {imageFile ? "تغيير الصورة" : "رفع صورة"}
                  </span>
                  <span className="text-xs text-gray-400 mt-1 max-w-[200px] truncate px-2 text-center">
                    {imageFile ? imageFile.name : "PNG, JPG حتى 5 ميغابايت"}
                  </span>
                  <input
                    id="image_upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) setImageFile(e.target.files[0]);
                    }}
                  />
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  الترخيص / التحقق المهني <span className="text-red-500">*</span>
                </label>
                <label
                  htmlFor="license_upload"
                  className="flex flex-col items-center justify-center h-32 rounded-xl border-2 border-dashed border-purple-200 bg-purple-50 cursor-pointer hover:bg-purple-100 transition-colors"
                >
                  <Upload className="w-6 h-6 text-purple-400 mb-2" />
                  <span className="text-sm text-purple-600 font-medium">
                    {licenseFile ? "تغيير الوثيقة" : "رفع وثيقة"}
                  </span>
                  <span className="text-xs text-gray-400 mt-1 max-w-[200px] truncate px-2 text-center">
                    {licenseFile ? licenseFile.name : "PDF, PNG, JPG حتى 10 ميغابايت"}
                  </span>
                  <input
                    id="license_upload"
                    type="file"
                    accept=".pdf,image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) setLicenseFile(e.target.files[0]);
                    }}
                  />
                </label>
              </div>
            </div>
            <div className="flex items-start gap-2 mt-3 text-xs text-gray-500">
              <Info className="w-4 h-4 shrink-0 text-blue-400 mt-0.5" />
              <span>سيتم الاحتفاظ بوثيقة الترخيص بشكل سري ولن تُنشر على الموقع</span>
            </div>
          </div>

          {/* Section: Confirmation */}
          <div className="p-6">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                  confirmed
                    ? "bg-purple-600 border-purple-600"
                    : "border-gray-300 group-hover:border-purple-400"
                }`}
                onClick={() => setConfirmed(!confirmed)}
              >
                {confirmed && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
              </div>
              <span className="text-sm text-gray-700 leading-relaxed">
                أؤكد أنني طبيبة أنثى متخصصة في أمراض النساء والتوليد، وأتحمل مسؤولية صحة البيانات المُدخلة.
                أوافق على مراجعة طلبي قبل النشر وعلى{" "}
                <a href="#" className="text-purple-600 hover:underline">سياسة الخصوصية</a>{" "}
                و<a href="#" className="text-purple-600 hover:underline">شروط الاستخدام</a>.
              </span>
            </label>

            <Button
              type="submit"
              variant="pink"
              size="xl"
              disabled={status === "loading" || !confirmed}
              className="w-full mt-6"
              id="submit-registration"
            >
              {status === "loading" ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5 fill-white" />
                  إرسال الطلب للمراجعة
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
