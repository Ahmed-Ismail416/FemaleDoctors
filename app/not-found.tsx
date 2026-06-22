import Link from "next/link";
import { Heart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center mx-auto mb-6">
          <Heart className="w-12 h-12 text-purple-400" />
        </div>
        <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 mb-4">
          ٤٠٤
        </h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">الصفحة غير موجودة</h2>
        <p className="text-gray-600 mb-8 max-w-sm mx-auto">
          عذراً، الصفحة التي تبحثين عنها غير موجودة أو ربما تم نقلها
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="pink" asChild>
            <Link href="/">
              <Heart className="w-4 h-4" />
              الصفحة الرئيسية
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/doctors">
              <Search className="w-4 h-4" />
              تصفح الطبيبات
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
