"use client"

import { useState } from "react"
import { commitFiles, readAsBase64 } from "../lib/github-client"
import { CDN_PRESETS, safeName, type StoreAsset, type StoreManifest } from "../lib/store"

const TONES = ["blue", "yellow", "violet", "green", "pink", "cyan"]
const TYPES = ["字体投递包", "图标投递包", "资源包", "安装包", "其他"]

function humanSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${bytes} B`
}

interface RepoInfo {
  repo: string
  branch: string
  canUpload: boolean
}

export default function AdminPanel({ manifest: initial, info }: { manifest: StoreManifest; info: RepoInfo }) {
  const [manifest, setManifest] = useState<StoreManifest>(initial)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null)
  const [limitMb, setLimitMb] = useState(50)
  const [upload, setUpload] = useState({ name: "", type: TYPES[0], tone: TONES[0], note: "" })
  const [file, setFile] = useState<File | null>(null)

  const notify = (type: "ok" | "err", text: string) => { setMsg({ type, text }); window.scrollTo({ top: 0, behavior: "smooth" }) }

  async function withToken(): Promise<{ token: string; repo: string; branch: string }> {
    const res = await fetch("/api/admin/token")
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || "取不到上传令牌")
    return data
  }

  async function commit(message: string, files: { path: string; content: string | null }[]) {
    setBusy(true)
    try {
      const { token, repo, branch } = await withToken()
      const sha = await commitFiles({ token, repo, branch, message, files })
      await fetch("/api/admin/revalidate", { method: "POST" })
      notify("ok", `已提交 ${sha.slice(0, 7)}，首页稍后自动更新`)
      return true
    } catch (e) {
      notify("err", e instanceof Error ? e.message : String(e))
      return false
    } finally {
      setBusy(false)
    }
  }

  async function saveManifest(next: StoreManifest, message: string) {
    const ok = await commit(message, [{ path: "manifest.json", content: btoa(unescape(encodeURIComponent(JSON.stringify(next, null, 2)))) }])
    if (ok) setManifest(next)
  }

  function updateAsset(key: string, patch: Partial<StoreAsset>) {
    setManifest((m) => ({ ...m, assets: m.assets.map((a) => (a.key === key ? { ...a, ...patch } : a)) }))
  }

  async function removeAsset(asset: StoreAsset) {
    if (!confirm(`确定删除「${asset.name}」？仓库里的文件也会一并删除。`)) return
    const next: StoreManifest = { ...manifest, assets: manifest.assets.filter((a) => a.key !== asset.key) }
    const ok = await commit(`删除资源包 ${asset.name}`, [
      { path: "manifest.json", content: btoa(unescape(encodeURIComponent(JSON.stringify(next, null, 2)))) },
      { path: asset.file, content: null },
    ])
    if (ok) setManifest(next)
  }

  async function replaceFile(asset: StoreAsset, f: File) {
    if (f.size > limitMb * 1024 * 1024) return notify("err", `文件 ${humanSize(f.size)} 超过限制 ${limitMb} MB`)
    const content = await readAsBase64(f)
    const nextAsset = { ...asset, size: humanSize(f.size) }
    const next: StoreManifest = { ...manifest, assets: manifest.assets.map((a) => (a.key === asset.key ? nextAsset : a)) }
    const ok = await commit(`更新资源包 ${asset.name}`, [
      { path: asset.file, content },
      { path: "manifest.json", content: btoa(unescape(encodeURIComponent(JSON.stringify(next, null, 2)))) },
    ])
    if (ok) setManifest(next)
  }

  async function doUpload() {
    if (!file) return notify("err", "先选择一个文件")
    if (file.size > limitMb * 1024 * 1024) return notify("err", `文件 ${humanSize(file.size)} 超过限制 ${limitMb} MB`)
    if (file.size > 100 * 1024 * 1024) return notify("err", "GitHub 单文件上限 100 MB")
    const base = safeName(upload.name || file.name.replace(/\.[^.]+$/, "")) || safeName(file.name)
    const ext = file.name.includes(".") ? file.name.slice(file.name.lastIndexOf(".")) : ""
    const filename = `${base}${ext.toLowerCase()}`
    const path = filename
    const content = await readAsBase64(file)
    const asset: StoreAsset = {
      key: filename,
      file: path,
      name: upload.name || base,
      type: upload.type,
      size: humanSize(file.size),
      tone: upload.tone,
      order: (manifest.assets.at(-1)?.order ?? 0) + 1,
      note: upload.note,
      hidden: false,
    }
    const next: StoreManifest = { ...manifest, assets: [...manifest.assets.filter((a) => a.key !== filename), asset] }
    const ok = await commit(`新增资源包 ${asset.name}`, [
      { path, content },
      { path: "manifest.json", content: btoa(unescape(encodeURIComponent(JSON.stringify(next, null, 2)))) },
    ])
    if (ok) { setManifest(next); setFile(null); setUpload({ name: "", type: TYPES[0], tone: TONES[0], note: "" }) }
  }

  const assets = [...manifest.assets].sort((a, b) => a.order - b.order)

  return <div className="admin">
    {msg && <div className={`admin-msg ${msg.type}`}>{msg.text}</div>}

    <section className="admin-card">
      <h2>分发设置</h2>
      <label>下载线路
        <select value={manifest.cdn} onChange={(e) => setManifest({ ...manifest, cdn: e.target.value })}>
          {Object.entries(CDN_PRESETS).map(([key, preset]) => <option key={key} value={key}>{preset.label}</option>)}
        </select>
        <small>{CDN_PRESETS[manifest.cdn]?.hint}</small>
      </label>
      {manifest.cdn === "custom" && <label>自定义前缀
        <input value={manifest.cdnBase} placeholder="https://你的域名/path" onChange={(e) => setManifest({ ...manifest, cdnBase: e.target.value })} />
        <small>最终链接 = 前缀 + / + 文件路径，例如 {manifest.cdnBase || "https://你的域名"}/files/xxx.bin</small>
      </label>}
      <label className="admin-check">
        <input type="checkbox" checked={manifest.mirror} onChange={(e) => setManifest({ ...manifest, mirror: e.target.checked })} />
        显示备用镜像链接（主线路慢时用户可以手动切换）
      </label>
      <label>制作台 APK 路径
        <input value={manifest.apk.file} placeholder="files/chaos-bandpack-v1.0.0.apk" onChange={(e) => setManifest({ ...manifest, apk: { ...manifest.apk, file: e.target.value } })} />
      </label>
      <div className="admin-row">
        <label>版本号<input value={manifest.apk.version} onChange={(e) => setManifest({ ...manifest, apk: { ...manifest.apk, version: e.target.value } })} /></label>
        <label>体积<input value={manifest.apk.size} placeholder="14.38 MB" onChange={(e) => setManifest({ ...manifest, apk: { ...manifest.apk, size: e.target.value } })} /></label>
      </div>
      <label>一句话说明<input value={manifest.apk.note || ""} placeholder="最新稳定版" onChange={(e) => setManifest({ ...manifest, apk: { ...manifest.apk, note: e.target.value } })} /></label>
    </section>

    <section className="admin-card">
      <h2>上传新文件</h2>
      {!info.canUpload && <p className="admin-warn">未配置 GITHUB_TOKEN，只能查看与编辑清单，不能上传。到 Vercel 项目 Settings → Environment Variables 添加 GITHUB_TOKEN（需要有 {info.repo} 的写入权限）。</p>}
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <div className="admin-row">
        <label>展示名称<input value={upload.name} placeholder="留空则用文件名" onChange={(e) => setUpload({ ...upload, name: e.target.value })} /></label>
        <label>类型<select value={upload.type} onChange={(e) => setUpload({ ...upload, type: e.target.value })}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select></label>
        <label>配色<select value={upload.tone} onChange={(e) => setUpload({ ...upload, tone: e.target.value })}>{TONES.map((t) => <option key={t}>{t}</option>)}</select></label>
      </div>
      <label>说明（可选）<input value={upload.note} placeholder="例如：思源黑体子集" onChange={(e) => setUpload({ ...upload, note: e.target.value })} /></label>
      <label>大小上限（MB）<input type="number" min={1} max={100} value={limitMb} onChange={(e) => setLimitMb(Number(e.target.value) || 50)} /></label>
      <button className="button primary" disabled={busy || !info.canUpload} onClick={doUpload}>{busy ? "上传中…" : "上传并发布"}</button>
      {file && <small>已选：{file.name}（{humanSize(file.size)}）</small>}
    </section>

    <section className="admin-card">
      <h2>资源包列表</h2>
      {assets.length === 0 && <p className="admin-warn">还没有资源包，用上面的上传区添加一个。</p>}
      {assets.map((asset) => <div className="admin-item" key={asset.key}>
        <div className="admin-row">
          <label>名称<input value={asset.name} onChange={(e) => updateAsset(asset.key, { name: e.target.value })} /></label>
          <label>类型<select value={asset.type} onChange={(e) => updateAsset(asset.key, { type: e.target.value })}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select></label>
        </div>
        <div className="admin-row">
          <label>说明<input value={asset.note || ""} onChange={(e) => updateAsset(asset.key, { note: e.target.value })} /></label>
          <label>排序<input type="number" value={asset.order} onChange={(e) => updateAsset(asset.key, { order: Number(e.target.value) || 0 })} /></label>
          <label>配色<select value={asset.tone} onChange={(e) => updateAsset(asset.key, { tone: e.target.value })}>{TONES.map((t) => <option key={t}>{t}</option>)}</select></label>
        </div>
        <div className="admin-actions">
          <small>{asset.file} · {asset.size}</small>
          <label className="admin-check"><input type="checkbox" checked={Boolean(asset.hidden)} onChange={(e) => updateAsset(asset.key, { hidden: e.target.checked })} /> 隐藏</label>
          <label className="admin-filebtn">替换文件<input type="file" disabled={busy || !info.canUpload} onChange={(e) => { const f = e.target.files?.[0]; if (f) replaceFile(asset, f) }} /></label>
          <button className="button danger" disabled={busy} onClick={() => removeAsset(asset)}>删除</button>
        </div>
      </div>)}
    </section>

    <div className="admin-save">
      <button className="button primary big" disabled={busy} onClick={() => saveManifest(manifest, "更新资源包清单")}>{busy ? "提交中…" : "保存全部修改"}</button>
      <small>仓库：{info.repo} · 分支：{info.branch}</small>
    </div>
  </div>
}
