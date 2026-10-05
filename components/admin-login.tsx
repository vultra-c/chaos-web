"use client"

import { useEffect, useState } from "react"
import AdminPanel from "./admin-panel"
import type { StoreManifest } from "../lib/store-shared"

export default function AdminLogin({ manifest, repo, branch, canUpload }: {
  manifest: StoreManifest
  repo: string
  branch: string
  canUpload: boolean
}) {
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/admin/session").then((res) => setAuthed(res.ok)).catch(() => setAuthed(false))
  }, [])

  async function login() {
    setError("")
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })
    if (res.ok) setAuthed(true)
    else setError((await res.json()).error || "登录失败")
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" })
    setAuthed(false)
    setPassword("")
  }

  if (authed === null) return <div className="admin-shell"><p className="admin-warn">正在校验登录状态…</p></div>

  if (!authed) {
    return <div className="admin-shell">
      <div className="admin-card login">
        <h2>Chaos 资源管理后台</h2>
        <p className="admin-warn">请输入管理员密码</p>
        <input type="password" value={password} placeholder="管理员密码" onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") login() }} />
        {error && <p className="admin-msg err">{error}</p>}
        <button className="button primary" onClick={login}>进入后台</button>
      </div>
    </div>
  }

  return <div className="admin-shell">
    <div className="admin-top">
      <strong>Chaos 资源管理后台</strong>
      <button className="admin-link" onClick={logout}>退出登录</button>
    </div>
    <AdminPanel manifest={manifest} info={{ repo, branch, canUpload }} />
  </div>
}
