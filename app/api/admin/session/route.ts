import { NextResponse } from "next/server"
import { githubToken, isAuthorized } from "../../../../lib/admin"
import { STORE_BRANCH, STORE_REPO } from "../../../../lib/store"

export async function GET() {
  if (!(await isAuthorized())) return NextResponse.json({ ok: false }, { status: 401 })
  return NextResponse.json({ ok: true, repo: STORE_REPO, branch: STORE_BRANCH, canUpload: Boolean(githubToken()) })
}
