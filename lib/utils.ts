import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
