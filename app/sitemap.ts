import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const doctors = await prisma.doctor.findMany({
    where: { verified: true },
    select: {
      id: true,
      created_at: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
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

  const doctorRoutes: MetadataRoute.Sitemap = doctors.map((doctor) => ({
    url: `${SITE_URL}/doctors/${doctor.id}`,
    lastModified: new Date(doctor.created_at),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...staticRoutes, ...doctorRoutes];
}