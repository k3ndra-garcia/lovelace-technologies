import type { MetadataRoute } from "next";
import { caseStudies, services } from "@/content/site";

const base = "https://lovelacetechnologies.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/services", "/approach", "/about", "/case-studies", "/contact"];
  return [
    ...pages.map((p) => ({ url: `${base}${p}` })),
    ...services.map((s) => ({ url: `${base}/services/${s.slug}` })),
    ...caseStudies.map((c) => ({ url: `${base}/case-studies/${c.slug}` })),
  ];
}
