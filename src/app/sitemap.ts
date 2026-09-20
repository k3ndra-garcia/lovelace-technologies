import type { MetadataRoute } from "next";
import { caseStudies, insights, services } from "@/content/site";

const base = "https://lovelacetechnologies.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/services", "/approach", "/about", "/insights", "/contact"];
  if (caseStudies.length > 0) pages.push("/work");
  return [
    ...pages.map((p) => ({ url: `${base}${p}` })),
    ...services.map((s) => ({ url: `${base}/services/${s.slug}` })),
    ...insights.map((i) => ({ url: `${base}/insights/${i.slug}` })),
  ];
}
