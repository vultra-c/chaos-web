import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Chaos · Android 制作台",
  description: "Chaos Android 制作台、投递包与扩展资源下载中心。",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>
}
