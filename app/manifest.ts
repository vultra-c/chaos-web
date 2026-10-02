import type { MetadataRoute } from "next"
import { siteName, siteDescription } from "../lib/site"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteName,
    short_name: siteName,
    description: siteDescription,
    lang: "zh-CN",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0b0f",
    theme_color: "#0b0b0f",
    icons: [
      { src: "/chaos-mark.png", sizes: "any", type: "image/png" },
    ],
  }
}
