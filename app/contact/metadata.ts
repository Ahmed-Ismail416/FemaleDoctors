import type { Metadata } from "next";
import { canonical, SITE_NAME, OG_IMAGE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "تواصل معنا | دليل طبيبات مصر",
  description:
    "تواصلي مع دليل طبيبات مصر عبر واتساب لأي استفسار، اقتراح، أو طلب تسجيل طبيبة جديدة. رقم التواصل: 01556812414",
  keywords: [
    "تواصل مع دليل طبيبات مصر",
    "واتساب دليل طبيبات",
    "تسجيل طبيبة مصر",
    "استفسار طبيبة",
  ],
  alternates: { canonical: canonical("/contact") },
  openGraph: {
    title: `تواصل معنا | ${SITE_NAME}`,
    description: "تواصلي معنا عبر واتساب لأي استفسار أو اقتراح.",
    url: canonical("/contact"),
    type: "website",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary",
    title: `تواصل معنا | ${SITE_NAME}`,
    description: "تواصلي معنا عبر واتساب لأي استفسار أو اقتراح.",
  },
};
