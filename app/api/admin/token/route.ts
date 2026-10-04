import { NextResponse } from "next/server"
import { githubToken, isAuthorized } from "../../../../lib/admin"
import { STORE_BRANCH, STORE_REPO } from "../../../../lib/store"

/** 已登录管理员才能拿到上传用的令牌，用于浏览器直连 GitHub 提交大文件 */
export async function GET() {
  if (!(await isAuthorized())) return NextResponse.json({ error: "未登录" }, { status: 401 })
  const token = githubToken()
  if (!token) return NextResponse.json({ error: "未配置 GITHUB_TOKEN" }, { status: 500 })
  return NextResponse.json({ token, repo: STORE_REPO, branch: STORE_BRANCH })
}
