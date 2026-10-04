import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { isAuthorized } from "../../../../lib/admin"

/** 后台改完清单后刷新首页缓存 */
export async function POST() {
  if (!(await isAuthorized())) return NextResponse.json({ error: "未登录" }, { status: 401 })
  revalidatePath("/")
  return NextResponse.json({ ok: true })
}
