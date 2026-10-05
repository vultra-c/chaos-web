"use client"

import { useState } from "react"
import { ArrowDownToLine, ArrowUpRight, Check, ChevronRight, Github, Menu, ShieldCheck, Sparkles, X } from "lucide-react"
import type { StoreManifest } from "../lib/store-shared"

const repoUrl = "https://github.com/WenHuaYiYang/chaos-bandpack"
const moduleUrl = "https://github.com/WenHuaYiYang/Chaos-Module"

export default function HomeClient({ manifest }: { manifest: StoreManifest }) {
  const [menu, setMenu] = useState(false)
  const [toast, setToast] = useState(false)
  const download = () => { setToast(true); setTimeout(() => setToast(false), 2600) }

  const assets = manifest.assets.filter((a) => !a.hidden)
  const assetCount = String(assets.length).padStart(2, "0")

  return <main>
    <nav className="nav"><a className="brand" href="#top"><img src="/chaos-mark.png" alt="Chaos" /><span>Chaos</span></a><div className={menu ? "navlinks open" : "navlinks"}><a href="/store">商店</a><a href="#ecosystem">生态</a><a href="#about">关于项目</a><a className="github" href={repoUrl} target="_blank" rel="noreferrer"><Github /> GitHub <ArrowUpRight /></a></div><button className="menubtn" onClick={() => setMenu(!menu)} aria-label="打开菜单">{menu ? <X /> : <Menu />}</button></nav>
    <section className="hero" id="top"><div className="hero-copy"><div className="eyebrow"><span className="live-dot" /> OPEN SOURCE · ANDROID</div><h1>让每一份创意，<br /><em>都能抵达设备。</em></h1><p>Chaos 是面向 Android 创作者的本地制作台。选择字体或图标，生成可投递的资源包，再把它们带到小米手环 10 Pro。</p><div className="hero-actions"><a className="button primary" href="/store"><ArrowDownToLine /> 前往资源商店 <span>{apk.version}</span></a><a className="textlink" href="#ecosystem">了解 Chaos <ChevronRight /></a></div><div className="meta"><span><Check /> 开源免费分发</span><span><ShieldCheck /> 无追踪 · 安全下载</span></div></div><div className="hero-art"><div className="art-glow" /><img className="hero-screen" src="/chaos-showcase.jpg" alt="Chaos Android 制作台界面" /></div></section>
    <section className="stats"><div><strong>01</strong><span>制作台</span></div><div><strong>{assetCount}</strong><span>资源包</span></div><div><strong>100%</strong><span>开源透明</span></div><div><strong>∞</strong><span>想象空间</span></div></section>
    <section className="section ecosystem" id="ecosystem"><div className="ecosystem-grid"><div><div className="eyebrow">MADE FOR MAKERS</div><h2>从一个包，<br /><em>开始创造。</em></h2><p>Chaos Module 提供设备侧能力，Chaos Bandpack 负责在手机上制作资源包。两者一起，让字体与桌面图标的定制更简单。</p><a className="textlink" href={moduleUrl} target="_blank" rel="noreferrer">探索项目生态 <ArrowUpRight /></a></div><div className="feature-cards"><div className="feature"><Sparkles /><h3>本地制作</h3><p>字体子集化、图标整理与预览都在手机完成，不上传你的素材。</p></div><div className="feature"><Github /><h3>开放源码</h3><p>代码与构建过程公开透明，欢迎加入共创。</p></div></div></div></section>
    <section className="visual"><div className="visual-copy"><div className="eyebrow">CHAOS, IN YOUR HAND</div><h2>把定制，<br /><em>带到手环。</em></h2><p>从字体到桌面图标，在手机上完成制作，再通过你选择的侧载方式送到设备。</p></div><img src="/chaos-showcase.jpg" alt="Chaos Android 制作台界面" /></section>
    <footer id="about"><div className="brand"><img src="/chaos-mark.png" alt="Chaos" /><span>Chaos</span></div><p>Android 制作台 · 由社区驱动</p><div><a href={moduleUrl} target="_blank" rel="noreferrer">Chaos Module</a><a href={repoUrl} target="_blank" rel="noreferrer">Chaos Bandpack</a><a href={repoUrl} target="_blank" rel="noreferrer">GitHub</a></div></footer>
    {toast && <div className="toast"><Check /> 已开始下载，感谢使用 Chaos</div>}
  </main>
}
