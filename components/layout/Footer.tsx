import Link from "next/link";
import { Heart, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <Heart className="w-6 h-6 text-pink-300 fill-pink-300" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">دليل طبيبات</p>
                <p className="text-sm text-pink-300">مصر</p>
              </div>
            </Link>
            <p className="text-purple-200 text-sm leading-relaxed max-w-xs">
              منصة متخصصة في توجيه السيدات للعثور على أفضل الطبيبات في مختلف التخصصات الطبية في جميع محافظات مصر.
              نؤمن بحق المرأة في الرعاية الصحية على يد طبيبة متخصصة.
            </p>

          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white mb-4 text-base">روابط سريعة</h3>
            <ul className="space-y-2">
              {[
                { href: "/doctors", label: "دليل الطبيبات" },
                { href: "/register", label: "تسجيل طبيبة جديدة" },
                { href: "/contact", label: "تواصل معنا" },
             
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-purple-200 hover:text-pink-300 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-white mb-4 text-base">تواصل معنا</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-purple-200 text-sm">
                <a href="https://wa.me/201556812414" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-purple-200 hover:text-pink-300 transition-all">
                  <Phone className="w-4 h-4 text-pink-300 shrink-0" />
                  <span>واتساب: 01556812414</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-purple-300 text-sm text-center">
            © {new Date().getFullYear()} دليل طبيبات مصر. جميع الحقوق محفوظة.
          </p>
          <p className="text-purple-400 text-xs">
            صُنع بـ <Heart className="inline w-3 h-3 fill-pink-400 text-pink-400" /> بواسطة{" "}
            <Link href="/developer" className="hover:text-pink-300 transition-colors underline underline-offset-2">
              Ahmed Ismail
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
