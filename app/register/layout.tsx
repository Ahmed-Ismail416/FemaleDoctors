import type { Metadata } from "next";
import { canonical, SITE_NAME, OG_IMAGE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "تسجيل طبيبة جديدة | انضمي لدليل طبيبات مصر",
  description:
    "سجّلي بياناتك في دليل طبيبات مصر واوصلي لآلاف السيدات اللواتي يبحثن عن طبيبة موثوقة في محافظتك. التسجيل مجاني وسريع.",
  keywords: [
    "تسجيل طبيبة مصر",
    "انضمي لدليل الطبيبات",
    "إضافة طبيبة",
    "دليل طبيبات مصر تسجيل",
    "نشر عيادة طبيبة",
  ],
  alternates: { canonical: canonical("/register") },
  openGraph: {
    title: `تسجيل طبيبة جديدة | ${SITE_NAME}`,
    description:
      "سجّلي بياناتك وانضمي لأكبر دليل للطبيبات في مصر. التسجيل مجاني.",
    url: canonical("/register"),
    type: "website",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary",
    title: `تسجيل طبيبة جديدة | ${SITE_NAME}`,
    description: "سجّلي بياناتك وانضمي لأكبر دليل للطبيبات في مصر.",
  },
  // Discourage indexing of the form page itself (form pages don't benefit from indexing)
  robots: { index: true, follow: true },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
