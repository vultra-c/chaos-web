import type { Metadata } from "next"
import "./globals.css"
import { siteUrl, siteName, siteTitle, siteDescription, siteKeywords, ogImage } from "../lib/site"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s · ${siteName}`,
  },
  description: siteDescription,
  keywords: siteKeywords,
  applicationName: siteName,
  authors: [{ name: "Chaos" }],
  creator: "Chaos",
  publisher: "Chaos",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: siteUrl,
    siteName,
    title: siteTitle,
    description: siteDescription,
    images: [{ url: ogImage, width: 1200, height: 630, alt: siteName }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [ogImage],
  },
  category: "technology",
}

export const viewport = {
  themeColor: "#0b0b0f",
  width: "device-width",
  initialScale: 1,
}

/** 结构化数据，帮助搜索引擎理解站点与下载内容 */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: siteName,
      description: siteDescription,
      inLanguage: "zh-CN",
      publisher: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: siteName,
      url: `${siteUrl}/`,
      logo: `${siteUrl}/chaos-mark.png`,
    },
    {
      "@type": "SoftwareApplication",
      name: "Chaos Bandpack",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Android",
      description: "在手机上为小米手环 10 Pro 制作字体与桌面图标投递包的本地制作台。",
      softwareVersion: "1.0.0",
      inLanguage: "zh-CN",
      url: `${siteUrl}/`,
      downloadUrl: `${siteUrl}/releases/chaos-bandpack-v1.0.0.apk`,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "CNY",
      },
      codeRepository: "https://github.com/WenHuaYiYang/chaos-bandpack",
      license: "https://www.gnu.org/licenses/agpl-3.0.html",
    },
  ],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href="/chaos-mark.png" />
        <link rel="apple-touch-icon" href="/chaos-mark.png" />
        <meta name="format-detection" content="telephone=no" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
