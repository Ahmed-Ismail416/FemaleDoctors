import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // re-generate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all data in parallel
  const [doctors, governorates, cities] = await Promise.all([
    prisma.doctor.findMany({
      where: { verified: true },
      select: { id: true, created_at: true },
      orderBy: { created_at: "desc" },
    }),
    prisma.governorate.findMany({ select: { id: true } }),
    prisma.city.findMany({ select: { id: true, governorate_id: true } }),
  ]);

  // Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/doctors`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/register`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Individual doctor profile pages
  const doctorRoutes: MetadataRoute.Sitemap = doctors.map((doc) => ({
    url: `${SITE_URL}/doctors/${doc.id}`,
    lastModified: new Date(doc.created_at),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  // Governorate filter pages (high-value local SEO landing pages)
  const governorateRoutes: MetadataRoute.Sitemap = governorates.map((gov) => ({
    url: `${SITE_URL}/doctors?governorate=${gov.id}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  // City filter pages
  const cityRoutes: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${SITE_URL}/doctors?governorate=${city.governorate_id}&city=${city.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...doctorRoutes,
    ...governorateRoutes,
    ...cityRoutes,
  ];
}
