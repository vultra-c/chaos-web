/**
 * 商店（资源包仓库）读取逻辑
 * ------------------------------------------------------------------
 * 官网主仓库不存放任何大文件，所有 APK / 资源包都在独立仓库 chaos-store，
 * 通过 CDN 分发。网站只读取该仓库里的 manifest.json 来渲染下载列表。
 *
 * 相关环境变量（在 Vercel 项目设置里配置）：
 *   STORE_REPO    资源包仓库，默认 vultra-c/chaos-store
 *   STORE_BRANCH  分支，默认 main
 */
export interface StoreApk {
  /** 仓库内路径，例如 files/chaos-bandpack-v1.0.0.apk */
  file: string
  version: string
  size: string
  note?: string
}

export interface StoreAsset {
  /** 唯一标识，通常就是文件名 */
  key: string
  /** 仓库内路径 */
  file: string
  /** 展示名称 */
  name: string
  /** 类型文案 */
  type: string
  size: string
  /** 图标配色，对应 globals.css 的 .resource-icon.<tone> */
  tone: string
  order: number
  note?: string
  hidden?: boolean
}

export interface StoreManifest {
  /** CDN 预设名，见 CDN_PRESETS */
  cdn: string
  /** cdn 为 custom 时使用的自定义前缀 */
  cdnBase: string
  /** 是否在页面上显示备用镜像链接 */
  mirror: boolean
  apk: StoreApk
  assets: StoreAsset[]
}

export const STORE_REPO = process.env.STORE_REPO || "vultra-c/chaos-store"
export const STORE_BRANCH = process.env.STORE_BRANCH || "main"

/** 文件名里合法字符之外的字符会被替换，避免 URL 出错 */
export function safeName(name: string): string {
  return name
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w.\-一-龥]/g, "")
    .replace(/-+/g, "-")
}

export const CDN_PRESETS: Record<string, { label: string; hint: string; build: (repo: string, branch: string) => string }> = {
  jsdelivr: {
    label: "jsDelivr（推荐）",
    hint: "全球 CDN，国内大部分地区可用",
    build: (repo, branch) => `https://cdn.jsdelivr.net/gh/${repo}@${branch}`,
  },
  fastly: {
    label: "jsDelivr · Fastly",
    hint: "jsDelivr 的 Fastly 线路，可作为备选",
    build: (repo, branch) => `https://fastly.jsdelivr.net/gh/${repo}@${branch}`,
  },
  jsd: {
    label: "jsDelivr · 国内镜像",
    hint: "第三方镜像，国内部分地区更快",
    build: (repo, branch) => `https://jsd.onmicrosoft.cn/gh/${repo}@${branch}`,
  },
  kgithub: {
    label: "KGithub（国内镜像）",
    hint: "raw.githubusercontent 的国内镜像，适合国内用户",
    build: (repo, branch) => `https://raw.kgithub.com/${repo}/${branch}`,
  },
  ghproxy: {
    label: "GHProxy（国内镜像）",
    hint: "GitHub 文件加速代理，国内访问较稳",
    build: (repo, branch) => `https://ghproxy.net/https://raw.githubusercontent.com/${repo}/${branch}`,
  },
  github: {
    label: "GitHub Raw",
    hint: "官方源站，一定最新但国内常被限速",
    build: (repo, branch) => `https://raw.githubusercontent.com/${repo}/${branch}`,
  },
  custom: {
    label: "自定义域名",
    hint: "填你自己的对象存储 / R2 / CDN 前缀",
    build: () => "",
  },
}

export function cdnBase(manifest: StoreManifest): string {
  if (manifest.cdn === "custom") return (manifest.cdnBase || "").replace(/\/+$/, "")
  const preset = CDN_PRESETS[manifest.cdn]
  return preset ? preset.build(STORE_REPO, STORE_BRANCH) : CDN_PRESETS.jsdelivr.build(STORE_REPO, STORE_BRANCH)
}

export function fileUrl(manifest: StoreManifest, file: string): string {
  return `${cdnBase(manifest)}/${file}`
}

/** 备用镜像：主用 CDN 之外再给一条不同线路，主线路慢时用户可以手动切换 */
export function mirrorUrl(manifest: StoreManifest, file: string): string {
  const backup = manifest.cdn === "github" ? "jsdelivr" : "github"
  const preset = CDN_PRESETS[backup]
  return `${preset.build(STORE_REPO, STORE_BRANCH)}/${file}`
}

export const EMPTY_MANIFEST: StoreManifest = {
  cdn: "jsdelivr",
  cdnBase: "",
  mirror: true,
  apk: { file: "", version: "v1.0.0", size: "", note: "" },
  assets: [],
}

function normalize(input: any): StoreManifest {
  const assets: StoreAsset[] = Array.isArray(input?.assets)
    ? input.assets
        .filter((a: any) => a && a.file)
        .map((a: any, i: number) => ({
          key: String(a.key || a.file),
          file: String(a.file),
          name: String(a.name || a.file.split("/").pop() || a.file),
          type: String(a.type || "资源包"),
          size: String(a.size || ""),
          tone: String(a.tone || "blue"),
          order: Number(a.order ?? 100 + i),
          note: a.note ? String(a.note) : "",
          hidden: Boolean(a.hidden),
        }))
        .sort((a: StoreAsset, b: StoreAsset) => a.order - b.order)
    : []
  return {
    cdn: CDN_PRESETS[input?.cdn] ? input.cdn : "jsdelivr",
    cdnBase: String(input?.cdnBase || ""),
    mirror: input?.mirror !== false,
    apk: {
      file: String(input?.apk?.file || ""),
      version: String(input?.apk?.version || "v1.0.0"),
      size: String(input?.apk?.size || ""),
      note: String(input?.apk?.note || ""),
    },
    assets,
  }
}

/**
 * 读取资源包清单。失败时返回空清单，保证站点永远能正常构建与打开。
 * 缓存 60 秒；管理员后台改动后会主动触发重新验证。
 */
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
