/**
 * 服务端专用：读取资源仓库的清单。
 * 客户端组件请改用 lib/store-shared，避免把 fetch 的 next 选项打进浏览器包。
 */
import { EMPTY_MANIFEST, normalize, STORE_BRANCH, STORE_REPO, type StoreManifest } from "./store-shared"

export * from "./store-shared"

export async function getManifest(): Promise<StoreManifest> {
  const urls = [
    `https://raw.githubusercontent.com/${STORE_REPO}/${STORE_BRANCH}/manifest.json`,
    `https://cdn.jsdelivr.net/gh/${STORE_REPO}@${STORE_BRANCH}/manifest.json`,
  ]
  for (const url of urls) {
    try {
      const res = await fetch(url, { next: { revalidate: 60 } })
      if (!res.ok) continue
      return normalize(await res.json())
    } catch {
      /* 换下一个源 */
    }
  }
  return EMPTY_MANIFEST
}
