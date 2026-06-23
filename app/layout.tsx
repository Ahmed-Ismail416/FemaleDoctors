import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Suspense } from "react";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, OG_IMAGE } from "@/lib/seo";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: `${SITE_NAME} | في مختلف التخصصات الطبية`,
    template: `%s | ${SITE_NAME}`,
  },

  description: SITE_DESCRIPTION,

  keywords: [
    "دليل طبيبات مصر",
    "طبيبة نساء وتوليد",
    "دكتورة نساء",
    "طبيبة موثوقة مصر",
    "متابعة حمل",
    "طبيبة باطنة",
    "طبيبة جراحة",
    "طبيبة جلدية",
    "طبيبة أطفال",
    "طبيبة نساء في القاهرة",
    "طبيبة نساء في الجيزة",
    "طبيبة نساء في الإسكندرية",
    "طبيبة نساء في الفيوم",
    "أفضل طبيبة مصر",
    "female doctors egypt",
    "women doctors egypt",
  ],

  authors: [{ name: "Ahmed Ismail", url: `${SITE_URL}/developer` }],
  creator: "Ahmed Ismail",
  publisher: SITE_NAME,

  alternates: {
    canonical: SITE_URL,
    languages: { "ar-EG": SITE_URL },
  },

  openGraph: {
    type: "website",
    locale: "ar_EG",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | في مختلف التخصصات الطبية`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [OG_IMAGE],
  },

  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | في مختلف التخصصات الطبية`,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE.url],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Add your Search Console verification token here when ready:
  // verification: { google: "YOUR_GOOGLE_VERIFICATION_TOKEN" },
};

// ── Global JSON-LD: WebSite + Organization ──────────────────────────────────
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  inLanguage: "ar-EG",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/doctors?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/veiled_doctors.png`,
    width: 1200,
    height: 630,
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+201556812414",
    contactType: "customer service",
    availableLanguage: "Arabic",
    areaServed: "EG",
  },
  areaServed: {
    "@type": "Country",
    name: "Egypt",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
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
