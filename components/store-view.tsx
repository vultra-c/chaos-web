"use client"

import { useMemo, useState } from "react"
import { ArrowDownToLine, ArrowLeft, ArrowUpRight, Check, Package, Search } from "lucide-react"
import { CDN_PRESETS, cdnBase, fileUrl, mirrorUrl, type StoreManifest } from "../lib/store"

export default function StoreView({ manifest }: { manifest: StoreManifest }) {
  const [query, setQuery] = useState("")
  const [kind, setKind] = useState("全部")
  const [toast, setToast] = useState(false)
  const download = () => { setToast(true); setTimeout(() => setToast(false), 2600) }

  const apk = manifest.apk
  const apkUrl = apk.file ? fileUrl(manifest, apk.file) : ""
  const apkMirror = apk.file && manifest.mirror ? mirrorUrl(manifest, apk.file) : ""
  const visible = manifest.assets.filter((a) => !a.hidden)

  const kinds = useMemo(() => ["全部", ...Array.from(new Set(visible.map((a) => a.type)))], [visible])

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return visible
      .filter((a) => (kind === "全部" ? true : a.type === kind))
      .filter((a) => (q ? `${a.name} ${a.note || ""} ${a.type}`.toLowerCase().includes(q) : true))
      .sort((a, b) => a.order - b.order)
  }, [visible, kind, query])

  return <main className="store">
    <nav className="nav">
      <a className="brand" href="/"><img src="/chaos-mark.png" alt="Chaos" /><span>Chaos</span></a>
      <div className="navlinks">
        <a href="/">返回首页 <ArrowLeft /></a>
      </div>
    </nav>

    <header className="store-head">
      <div className="eyebrow">CHAOS STORE</div>
      <h1>资源商店</h1>
      <p>下载 Chaos 制作台与字体、图标投递包。全部开源，无追踪，无广告。</p>
      <div className="store-meta">
        <span><Check /> {CDN_PRESETS[manifest.cdn]?.label || "GitHub 直链"}</span>
        <span><Package /> {visible.length} 个资源包</span>
      </div>
    </header>

    {apkUrl ? <section className="store-featured">
      <div className="release-icon"><Package /></div>
      <div className="store-featured-info">
        <div className="tag">推荐下载</div>
        <h2>Chaos Android 制作台</h2>
        <p>{apk.note ? `${apk.note} · ` : ""}{apk.version} · APK · {apk.size}</p>
      </div>
      <div className="store-featured-actions">
        <a className="button dark" href={apkUrl} download onClick={download}><ArrowDownToLine /> 下载 APK</a>
        {apkMirror ? <a className="mirror-tip" href={apkMirror} target="_blank" rel="noreferrer">备用镜像 <ArrowUpRight /></a> : null}
      </div>
    </section> : null}

    <section className="store-list">
      <div className="store-toolbar">
        <div className="store-kinds">
          {kinds.map((k) => <button key={k} className={kind === k ? "chip active" : "chip"} onClick={() => setKind(k)}>{k}</button>)}
        </div>
        <label className="store-search"><Search /><input value={query} placeholder="搜索资源包" onChange={(e) => setQuery(e.target.value)} /></label>
      </div>

      {list.length === 0 ? <p className="store-empty">没有匹配的资源包。</p> : <div className="resource-list store-grid">
        {list.map((item) => {
          const url = fileUrl(manifest, item.file)
          const backup = manifest.mirror ? mirrorUrl(manifest, item.file) : ""
          return <div className="resource" key={item.key}>
            <div className={`resource-icon ${item.tone}`}><Package /></div>
            <div>
              <h4>{item.name}</h4>
              <p>{item.note ? `${item.note} · ${item.size}` : `${item.type} · ${item.size}`}</p>
              {backup ? <a className="resource-mirror" href={backup} target="_blank" rel="noreferrer">备用镜像</a> : null}
            </div>
            <a className="resource-download" href={url} target="_blank" rel="noreferrer" download onClick={download} aria-label={`下载 ${item.name}`}><ArrowDownToLine /></a>
          </div>
        })}
      </div>}
    </section>

    <footer className="store-foot">
      <p>资源由 {cdnBase(manifest) || "GitHub"} 分发 · 版本与源码公开可查</p>
      <div><a href="/">返回首页</a><a href="/admin">资源管理</a></div>
    </footer>

    {toast && <div className="toast"><Check /> 已开始下载，感谢使用 Chaos</div>}
  </main>
}
