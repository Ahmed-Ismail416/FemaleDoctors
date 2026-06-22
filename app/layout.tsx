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
    default: "دليل طبيبات مصر | في مختلف التخصصات الطبية",
    template: "%s | دليل طبيبات مصر",
  },
  description:
    "ابحثي عن أفضل الطبيبات في مختلف التخصصات الطبية في مصر. دليل شامل يضم مئات الطبيبات في جميع المحافظات المصرية. ابحثي بالمحافظة والمنطقة والتخصص.",
  keywords: [
    "دليل طبيبات مصر",
    "طبيبات مصر",
    "طبيبة مصرية",
    "دليل طبيبات",
    "دليل الطبيبات المصريات",
    "female doctors egypt",
    "women doctors egypt",
  ],
  openGraph: {
    title: "دليل طبيبات مصر | في مختلف التخصصات الطبية",
    description: "ابحثي عن أفضل الطبيبات في مختلف التخصصات الطبية في مصر",
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
