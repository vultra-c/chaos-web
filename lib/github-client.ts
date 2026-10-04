/**
 * 浏览器直连 GitHub 提交文件。
 *
 * 为什么不让 Vercel 代传：Vercel 免费版的请求体上限约 4.5MB，
 * 而 APK 有十几 MB。让登录后的管理员浏览器直接提交给 GitHub，
 * 既能传大文件，也避免大文件占用 Vercel 的函数资源。
 */
export interface CommitFile {
  /** 仓库内路径 */
  path: string
  /** base64 内容；传 null 表示删除该文件 */
  content: string | null
}

const API = "https://api.github.com"

async function gh(path: string, token: string, init?: RequestInit) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  })
  if (!res.ok) {
    const detail = await res.text()
    throw new Error(`GitHub ${res.status}: ${detail.slice(0, 200)}`)
  }
  return res.json()
}

/** 读取文件为 base64（不含 data: 前缀） */
export function readAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = String(reader.result || "")
      resolve(result.includes(",") ? result.split(",")[1] : result)
    }
    reader.onerror = () => reject(new Error("读取文件失败"))
    reader.readAsDataURL(file)
  })
}

/** 一次提交可同时包含多个新增 / 修改 / 删除 */
export async function commitFiles(options: {
  token: string
  repo: string
  branch: string
  message: string
  files: CommitFile[]
}): Promise<string> {
  const { token, repo, branch, message, files } = options

  const ref = await gh(`/repos/${repo}/git/ref/heads/${branch}`, token)
  const parentSha: string = ref.object.sha
  const commit = await gh(`/repos/${repo}/git/commits/${parentSha}`, token)
  const baseTree: string = commit.tree.sha

  const tree: { path: string; mode: string; type: string; sha: string | null }[] = []
  for (const item of files) {
    if (item.content === null) {
      tree.push({ path: item.path, mode: "100644", type: "blob", sha: null })
      continue
    }
    const blob = await gh(`/repos/${repo}/git/blobs`, token, {
      method: "POST",
      body: JSON.stringify({ content: item.content, encoding: "base64" }),
    })
    tree.push({ path: item.path, mode: "100644", type: "blob", sha: blob.sha })
  }

  const newTree = await gh(`/repos/${repo}/git/trees`, token, {
    method: "POST",
    body: JSON.stringify({ base_tree: baseTree, tree }),
  })
  const newCommit = await gh(`/repos/${repo}/git/commits`, token, {
    method: "POST",
    body: JSON.stringify({ message, tree: newTree.sha, parents: [parentSha] }),
  })
  await gh(`/repos/${repo}/git/refs/heads/${branch}`, token, {
    method: "PATCH",
    body: JSON.stringify({ sha: newCommit.sha }),
  })
  return newCommit.sha as string
}
