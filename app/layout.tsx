import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Suspense } from "react";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://femalydoctors.eg"),
  title: {
    default: "دليل طبيبات النساء  في مصر",
    template: "%s | دليل طبيبات النساء ",
  },
  description:
    "ابحثي عن أفضل طبيبات أمراض النساء والتوليد في مصر. دليل شامل يضم مئات الطبيبات في جميع المحافظات المصرية. ابحثي بالمحافظة والمنطقة والتخصص.",
  keywords: [
    "دكتورة نساء وتوليد",
    "طبيبة نساء مصر",
    "أمراض النساء",
    "دليل أطباء نساء",
    "gynecologist egypt",
    "female gynecologist",
    "obstetrician egypt",
  ],
  openGraph: {
    title: "دليل طبيبات النساء  في مصر",
    description: "ابحثي عن أفضل طبيبات أمراض النساء  في مصر",
    locale: "ar_EG",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className={`${cairo.className} bg-gray-50 min-h-screen antialiased`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </body>
    </html>
  );
}
