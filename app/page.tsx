import HomeClient from "../components/home-client"
import { getManifest } from "../lib/store"

/**
 * 首页在服务端读取资源仓库的 manifest.json，
 * 下载链接指向独立 CDN，主仓库本身不放任何大文件。
 */
export const revalidate = 60

export default async function Home() {
  const manifest = await getManifest()
  return <HomeClient manifest={manifest} />
}
