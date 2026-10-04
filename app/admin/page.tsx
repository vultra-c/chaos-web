import AdminLogin from "../../components/admin-login"
import { getManifest, STORE_BRANCH, STORE_REPO } from "../../lib/store"

export const metadata = { title: "资源管理后台 · Chaos", robots: { index: false, follow: false } }

export default async function AdminPage() {
  const manifest = await getManifest()
  return (
    <AdminLogin
      manifest={manifest}
      repo={STORE_REPO}
      branch={STORE_BRANCH}
      canUpload={Boolean(process.env.GITHUB_TOKEN)}
    />
  )
}
