"use client";

import Link from "next/link";
import { useState, lazy, Suspense } from "react";
import { Menu, X, Heart } from "lucide-react";

const MobileMenu = lazy(() => import("./MobileMenu"));

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "الرئيسية" },
    { href: "/doctors", label: "دليل الطبيبات" },
    { href: "/register", label: "تسجيل طبيبة" },
    { href: "/contact", label: "تواصل معنا" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-pink-100 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-gray-900 leading-tight">دليل طبيبات</p>
              <p className="text-xs text-purple-600 leading-tight">مصر</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/register"
              className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:shadow-md hover:shadow-pink-200 transition-all"
            >
              <Heart className="w-4 h-4" />
              انضمي للدليل
            </Link>
            <button
              className="md:hidden p-2 rounded-lg hover:bg-pink-50 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="فتح القائمة"
            >
              {mobileOpen ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Lazy Loaded */}
        {mobileOpen && (
          <Suspense fallback={null}>
            <MobileMenu navLinks={navLinks} onClose={() => setMobileOpen(false)} />
          </Suspense>
        )}
      </div>
    </header>
  );
}