import type { MetadataRoute } from "next"
import { siteUrl } from "../lib/site"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      // 以下是常见的垃圾/违规爬虫，可按需放开
      {
        userAgent: ["AhrefsBot", "SemrushBot", "DotBot", "MJ12bot"],
        disallow: "/",
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
