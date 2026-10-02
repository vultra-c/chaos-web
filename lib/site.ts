/**
 * 站点基础信息：SEO 相关的绝对地址、标题、描述都从这里取。
 * 正式域名确定后，在 Vercel 项目里加环境变量 NEXT_PUBLIC_SITE_URL 覆盖即可，
 * 例如 https://chaosmgr.dpdns.org （结尾不要带斜杠）。
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://chaosmgr.dpdns.org").replace(/\/+$/, "")

export const siteName = "Chaos"
export const siteTitle = "Chaos · 小米手环 10 Pro 投递包制作台"
export const siteDescription =
  "Chaos 是面向 Android 创作者的本地制作台：在手机上完成字体子集化与图标整理，生成可投递的资源包，带到小米手环 10 Pro。提供 Chaos Bandpack APK 与字体、图标投递包下载。"

export const siteKeywords = [
  "Chaos",
  "Chaos Bandpack",
  "小米手环 10 Pro",
  "小米手环字体",
  "手环桌面图标",
  "投递包制作",
  "字体子集化",
  "Android 制作台",
  "手环资源包",
]

export const ogImage = "/chaos-showcase.jpg"
