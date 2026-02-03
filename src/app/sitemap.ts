import { MetadataRoute } from "next";
import { businessConfig } from "@/lib/config";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://larufeta.es";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Main pages
  const mainPages = [
    {
      url: `${BASE_URL}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${BASE_URL}/menu`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/reservas`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/galeria`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/eventos`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contacto`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
  ];

  // Legal pages (lower priority, noindex anyway)
  const legalPages = [
    {
      url: `${BASE_URL}/legal/privacidad`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/legal/cookies`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/legal/aviso-legal`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ];

  return [...mainPages, ...legalPages];
}
