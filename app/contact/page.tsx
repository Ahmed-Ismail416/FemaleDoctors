"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((res) => setTimeout(res, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">تواصل معنا</h1>
          <p className="text-gray-600 max-w-lg mx-auto">
            نحن هنا للمساعدة. تواصلي معنا لأي استفسار أو اقتراح أو مشكلة
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            {[
              {
                icon: <Mail className="w-6 h-6 text-purple-600" />,
                title: "البريد الإلكتروني",
                value: "info@femaldoctors.eg",
                bg: "bg-purple-50",
              },
              {
                icon: <Phone className="w-6 h-6 text-pink-600" />,
                title: "رقم الهاتف",
                value: "01000000000",
                bg: "bg-pink-50",
              },
              {
                icon: <MapPin className="w-6 h-6 text-indigo-600" />,
                title: "العنوان",
                value: "القاهرة، جمهورية مصر العربية",
                bg: "bg-indigo-50",
              },
            ].map((item, i) => (
              <div key={i} className={`${item.bg} rounded-2xl p-5 flex items-start gap-4`}>
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-0.5">{item.title}</p>
                  <p className="font-bold text-gray-900">{item.value}</p>
                </div>
              </div>
            ))}

            {/* Social Links */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-100">
              <p className="font-bold text-gray-900 mb-4">تابعونا على</p>
              <div className="flex gap-3">
                {[
                  { icon: <Facebook className="w-5 h-5" />, label: "Facebook", href: "#" },
                  { icon: <Instagram className="w-5 h-5" />, label: "Instagram", href: "#" },
                  { icon: <Twitter className="w-5 h-5" />, label: "Twitter", href: "#" },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 hover:bg-purple-600 hover:text-white transition-all duration-200"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-10 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">تم إرسال رسالتك</h3>
                <p className="text-gray-600">سيتواصل معك فريقنا في أقرب وقت. شكراً لك!</p>
                <Button variant="outline" className="mt-6" onClick={() => setSubmitted(false)}>
                  إرسال رسالة أخرى
                </Button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl shadow-sm border border-pink-100 p-6 space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">الاسم</label>
                    <Input id="contact-name" placeholder="اسمك الكامل" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">البريد الإلكتروني</label>
                    <Input id="contact-email" type="email" placeholder="email@example.com" dir="ltr" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">الموضوع</label>
                  <Input id="contact-subject" placeholder="موضوع رسالتك" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">الرسالة</label>
                  <Textarea id="contact-message" placeholder="اكتب رسالتك هنا..." rows={6} required />
                </div>
                <Button type="submit" variant="pink" size="lg" className="w-full" disabled={loading} id="send-contact">
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {loading ? "جاري الإرسال..." : "إرسال الرسالة"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
