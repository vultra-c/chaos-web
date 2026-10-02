"use client"

import { useState } from "react"
import { ArrowDownToLine, ArrowUpRight, Check, ChevronRight, Github, Menu, Package, ShieldCheck, Sparkles, X } from "lucide-react"

const apkUrl = "https://github.com/vultra-c/chaos-web/raw/refs/heads/main/658b9b0bb8a1dbb60ecf0902012888d3_4080889121206691547_m_app-r.apk"
const files = [
  { name: "Chaos Fontpack · LXGW", type: "字体投递包", size: "3.54 MB", file: "658b9b0bb8a1dbb60ecf0902012888d3_4080889121206691547_m_chaos-fontpack-lxgw.bin", tone: "blue" },
  { name: "Chaos Fontpack · 好身体", type: "字体投递包", size: "3.07 MB", file: "658b9b0bb8a1dbb60ecf0902012888d3_4080889121206691547_m_chaos-fontpack-好身体.bin", tone: "yellow" },
  { name: "Chaos Iconpack · Delta", type: "图标投递包", size: "1.97 MB", file: "658b9b0bb8a1dbb60ecf0902012888d3_4080889121206691547_m_chaos-iconpack-Delta.bin", tone: "violet" },
  { name: "Chaos Iconpack · Pure", type: "图标投递包", size: "1.83 MB", file: "658b9b0bb8a1dbb60ecf0902012888d3_4080889121206691547_m_chaos-iconpack-Pure.bin", tone: "green" },
]

export default function Home() {
  const [menu, setMenu] = useState(false)
  const [toast, setToast] = useState(false)
  const download = () => { setToast(true); setTimeout(() => setToast(false), 2600) }
  return <main>
    <nav className="nav"><a className="brand" href="#top"><img src="/chaos-mark.png" alt="Chaos" /><span>Chaos</span></a><div className={menu ? "navlinks open" : "navlinks"}><a href="#download">下载</a><a href="#ecosystem">生态</a><a href="#about">关于项目</a><a className="github" href="https://github.com/vultra-c/chaos-web" target="_blank" rel="noreferrer"><Github /> GitHub <ArrowUpRight /></a></div><button className="menubtn" onClick={() => setMenu(!menu)} aria-label="打开菜单">{menu ? <X /> : <Menu />}</button></nav>
    <section className="hero" id="top"><div className="hero-copy"><div className="eyebrow"><span className="live-dot" /> OPEN SOURCE · ANDROID</div><h1>把你的 Android，<br /><em>变成 Chaos。</em></h1><p>Chaos 制作台是一个轻量、自由、可扩展的 Android 工具箱。下载最新构建，开始你的投递之旅。</p><div className="hero-actions"><a className="button primary" href={apkUrl} download onClick={download}><ArrowDownToLine /> 下载 Chaos APK <span>v1.0.0</span></a><a className="textlink" href="#ecosystem">了解 Chaos <ChevronRight /></a></div><div className="meta"><span><Check /> GitHub 直链分发</span><span><ShieldCheck /> 无追踪 · 安全下载</span></div></div><div className="hero-art"><div className="art-glow" /><img className="hero-screen" src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mmexport1790937229777-pSdKZp7GwJ1uygNMkbpHBPRK6YthHh.png" alt="Chaos Android 制作台界面" /></div></section>
    <section className="stats"><div><strong>01</strong><span>制作台</span></div><div><strong>04</strong><span>资源包</span></div><div><strong>100%</strong><span>开源透明</span></div><div><strong>∞</strong><span>想象空间</span></div></section>
    <section className="section downloads" id="download"><div className="section-head"><div><div className="eyebrow">LATEST RELEASE</div><h2>下载中心</h2></div><p>所有文件均托管于 GitHub，<br />版本与源码公开可查。</p></div><div className="release-card"><div className="release-icon"><Package /></div><div className="release-info"><div className="tag">推荐下载</div><h3>Chaos Android 制作台</h3><p>最新稳定版 · APK · 15.1 MB</p></div><a className="button dark" href={apkUrl} download onClick={download}><ArrowDownToLine /> 下载 APK</a></div><div className="resource-list">{files.map((item) => <a className="resource" key={item.name} href={`https://github.com/vultra-c/chaos-web/raw/refs/heads/main/${item.file}`} target="_blank" rel="noreferrer"><div className={`resource-icon ${item.tone}`}><Package /></div><div><h4>{item.name}</h4><p>{item.type} · {item.size}</p></div><ArrowDownToLine className="resource-download" /></a>)}</div></section>
    <section className="section ecosystem" id="ecosystem"><div className="ecosystem-grid"><div><div className="eyebrow">BUILT FOR CREATORS</div><h2>一套工具，<br /><em>无限可能。</em></h2><p>从 Chaos Module 到 Chaos Bandpack，整个生态围绕「自由投递」而生。你可以制作、组合、分享属于自己的 Android 体验。</p><a className="textlink" href="https://github.com/WenHuaYiYang/Chaos-Module" target="_blank" rel="noreferrer">探索项目生态 <ArrowUpRight /></a></div><div className="feature-cards"><div className="feature"><Sparkles /><h3>自由投递</h3><p>将字体、图标与更多资源打包，随时投递到你的设备。</p></div><div className="feature"><Github /><h3>开放源码</h3><p>代码与构建过程公开透明，欢迎加入共创。</p></div></div></div></section>
    <section className="visual"><div className="visual-copy"><div className="eyebrow">CHAOS, IN YOUR HAND</div><h2>简洁，但不简单。</h2><p>为移动端而生的制作台。清晰的状态、直接的操作，不让复杂挡住你的创意。</p></div><img src="/chaos-screen.jpg" alt="Chaos Android 制作台界面" /></section>
    <footer id="about"><div className="brand"><img src="/chaos-mark.png" alt="Chaos" /><span>Chaos</span></div><p>Android 制作台 · 由社区驱动</p><div><a href="https://github.com/WenHuaYiYang/Chaos-Module" target="_blank" rel="noreferrer">Chaos Module</a><a href="https://github.com/WenHuaYiYang/chaos-bandpack" target="_blank" rel="noreferrer">Chaos Bandpack</a><a href="https://github.com/vultra-c/chaos-web" target="_blank" rel="noreferrer">GitHub</a></div></footer>
    {toast && <div className="toast"><Check /> 已开始下载，感谢使用 Chaos</div>}
  </main>
}
