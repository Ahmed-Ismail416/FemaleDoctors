import Link from "next/link";
import { Heart } from "lucide-react";

interface MobileMenuProps {
  navLinks: { href: string; label: string }[];
  onClose: () => void;
}

export default function MobileMenu({ navLinks, onClose }: MobileMenuProps) {
  return (
    <div className="md:hidden py-4 border-t border-pink-100 animate-fade-in">
      <nav className="flex flex-col gap-1">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
            onClick={onClose}
          >
            {link.label}
          </Link>
        ))}
        <div className="pt-2 px-1">
          <Link
            href="/register"
            onClick={onClose}
            className="flex items-center justify-center gap-2 bg-purple-600 text-white text-sm font-medium px-4 py-3 rounded-lg w-full hover:bg-purple-700 transition-all"
          >
            <Heart className="w-4 h-4" />
            انضمي للدليل
          </Link>
        </div>
      </nav>
    </div>
  );
}