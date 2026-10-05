import type { Metadata } from "next"
import StoreView from "../../components/store-view"
import { getManifest } from "../../lib/store"
import { siteName } from "../../lib/site"

export const revalidate = 60

export const metadata: Metadata = {
  title: "资源商店",
  description: "下载 Chaos Android 制作台与字体、图标投递包，全部开源，无追踪。",
  alternates: { canonical: "/store" },
  openGraph: {
    title: `资源商店 · ${siteName}`,
    description: "下载 Chaos Android 制作台与字体、图标投递包，全部开源，无追踪。",
    url: "/store",
  },
}

export default async function StorePage() {
  return <StoreView manifest={await getManifest()} />
}
