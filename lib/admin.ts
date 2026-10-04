/**
 * 管理员鉴权（仅服务端使用）
 * 密码通过环境变量 ADMIN_PASSWORD 配置，未配置时使用默认密码。
 */
import { createHash } from "node:crypto"
import { cookies } from "next/headers"

export const ADMIN_COOKIE = "chaos_admin_session"

export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "racwr52q"
}

/** cookie 内容 = 密码的哈希，不存明文 */
export function sessionToken(): string {
  return createHash("sha256").update(`chaos:${adminPassword()}`).digest("hex")
}

export async function isAuthorized(): Promise<boolean> {
  const store = await cookies()
  return store.get(ADMIN_COOKIE)?.value === sessionToken()
}

/** 上传用的 GitHub 令牌，未配置时后台只能查看不能上传 */
export function githubToken(): string {
  return process.env.GITHUB_TOKEN || ""
}
