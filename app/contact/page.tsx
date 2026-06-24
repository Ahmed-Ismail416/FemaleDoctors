"use client";

import { MessageCircle, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-2xl shadow-xl border border-pink-100 p-8 md:p-12 text-center max-w-xl w-full">
        <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center mx-auto mb-6 shadow-md shadow-pink-100">
          <MessageCircle className="w-10 h-10 text-white fill-white" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-4">تواصل معنا</h1>
        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
          يسعدنا الرد على جميع استفساراتكم واقتراحاتكم.
          <br />
          يمكنكم التواصل معنا مباشرةً وبسهولة عبر تطبيق الواتساب.
        </p>
        
        <div className="bg-pink-50/50 rounded-2xl p-6 mb-8 border border-pink-100/50">
          <p className="text-sm font-semibold text-purple-700 mb-2">رقم التواصل الموحد (واتساب فقط)</p>
          <p className="text-2xl font-black text-gray-800 tracking-wider" dir="ltr">01556812414</p>
        </div>

        <Button variant="default" size="xl" className="w-full flex items-center justify-center gap-2 text-base font-bold shadow-lg" asChild>
          <a href="https://wa.me/201556812414" target="_blank" rel="noopener noreferrer">
            <MessageCircle className="w-5 h-5 fill-white" />
            افتح محادثة واتساب
          </a>
        </Button>
      </div>
    </div>
  );
}
