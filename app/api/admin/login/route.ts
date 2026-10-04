import { NextResponse } from "next/server"
import { ADMIN_COOKIE, adminPassword, sessionToken } from "../../../../lib/admin"

export async function POST(request: Request) {
  const { password } = (await request.json()) as { password?: string }
  if (!password || password !== adminPassword()) {
    return NextResponse.json({ ok: false, error: "密码不正确" }, { status: 401 })
  }
  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE, sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 8,
  })
  return res
}
