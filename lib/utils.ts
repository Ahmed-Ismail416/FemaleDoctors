import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// =============================================
// Arabic Search Normalization
// =============================================

/**
 * Normalizes an Arabic string for search comparison.
 * Mirrors the logic of the PostgreSQL `normalize_arabic()` function.
 *
 * Rules applied:
 *  - أ / إ / آ  →  ا
 *  - ؤ          →  و
 *  - ئ / ى      →  ي
 *  - ة          →  ه
 *  - Remove tatweel ـ
 *  - Remove all diacritics (tashkeel: fatha, damma, kasra, tanween, shadda, sukun)
 *  - Collapse multiple whitespace → single space
 *  - Trim leading / trailing whitespace
 *
 * The original database value is NEVER changed — this is used only on the
 * search query text before passing it to PostgreSQL.
 */
export function normalizeArabic(text: string): string {
  if (!text) return "";

  return text
    // Step 1: lowercase (no effect on Arabic, but handles any Latin mix)
    .toLowerCase()
    // Step 2: map letter variants
    .replace(/[أإآ]/g, "ا")
    .replace(/ؤ/g, "و")
    .replace(/[ئى]/g, "ي")
    .replace(/ة/g, "ه")
    // Step 3: remove tatweel
    .replace(/ـ/g, "")
    // Step 4: remove diacritics (tashkeel U+064B – U+0652)
    .replace(/[\u064B-\u0652]/g, "")
    // Step 5: collapse whitespace & trim
    .replace(/\s+/g, " ")
    .trim();
}

export function formatPhone(phone: string): string {
  return phone.replace(/(\d{4})(\d{3})(\d{4})/, "$1 $2 $3");
}

export function buildWhatsAppLink(phone: string, message?: string): string {
  const cleanPhone = phone.replace(/\D/g, "");
  const egyptPhone = cleanPhone.startsWith("0")
    ? "2" + cleanPhone
    : cleanPhone.startsWith("2")
    ? cleanPhone
    : "2" + cleanPhone;
  const encodedMessage = message
    ? encodeURIComponent(message)
    : encodeURIComponent("مرحبا، أريد حجز موعد مع الدكتورة");
  return `https://wa.me/${egyptPhone}?text=${encodedMessage}`;
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.substring(0, length) + "...";
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

export function getTripleName(fullName: string): string {
  if (!fullName) return "";
  
  const cleanStr = fullName.trim();
  
  // Match prefix like 'د. ', 'دكتورة ', 'د/ ', 'أ.د. ' etc.
  const prefixMatch = cleanStr.match(/^(أ\.?\s*د\.?\s+|د\.\s*|دكتورة\s+|د\/\s*)/i);
  let prefix = "";
  let namePart = cleanStr;
  
  if (prefixMatch) {
    prefix = prefixMatch[0];
    namePart = cleanStr.substring(prefix.length).trim();
  }
  
  const parts = namePart.split(/\s+/).filter(Boolean);
  if (parts.length <= 3) {
    return cleanStr;
  }
  
  const tripleName = parts.slice(0, 3).join(" ");
  return `${prefix}${tripleName}`.trim();
}

export const DAYS_OF_WEEK = [
  { key: "saturday", label: "السبت" },
  { key: "sunday", label: "الأحد" },
  { key: "monday", label: "الإثنين" },
  { key: "tuesday", label: "الثلاثاء" },
  { key: "wednesday", label: "الأربعاء" },
  { key: "thursday", label: "الخميس" },
  { key: "friday", label: "الجمعة" },
] as const;

export function formatWorkingDaysSummary(workingHours: any): string {
  if (!workingHours) return "";
  let hoursObj = workingHours;
  if (typeof workingHours === "string") {
    try {
      hoursObj = JSON.parse(workingHours);
    } catch {
      return "";
    }
  }
  
  if (!hoursObj || typeof hoursObj !== "object") return "";

  const activeDays = DAYS_OF_WEEK.filter(day => {
    const dayData = hoursObj[day.key];
    // Check if the day is checked/active and has from/to hours
    return dayData && (dayData.active || (dayData.from && dayData.to));
  });

  if (activeDays.length === 0) return "";
  
  const dayNames = activeDays.map(d => d.label);
  return `مواعيد العمل: ${dayNames.join("، ")}`;
}
