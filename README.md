# chaos-web

Chaos 官网 —— 小米手环 10 Pro 投递包制作台（Chaos Bandpack）的下载与介绍站点。

- 官网：https://chaosmgr.dpdns.org
- Android 制作台源码：<https://github.com/WenHuaYiYang/chaos-bandpack>
- 设备侧模块：<https://github.com/WenHuaYiYang/Chaos-Module>

## 架构：主站不放大文件

官网仓库（本仓库）只放页面代码，**不存放任何 APK 或资源包**。
所有下载文件都在独立仓库 [`vultra-c/chaos-store`](https://github.com/vultra-c/chaos-store)，
通过 CDN 分发。网站读取该仓库的 `manifest.json` 渲染下载列表。

这样做的好处：主站体积小、部署快；下载走 CDN，与站点域名解耦，换线路不用改代码。

## 管理后台

访问 `https://chaosmgr.dpdns.org/admin`，用管理员密码登录后可：

- 上传任意类型的文件（默认上限 50 MB，可现场调整）
- 修改展示名称、类型、说明、图标配色、排序
- 隐藏 / 删除资源包，或直接替换文件
- 切换下载线路（jsDelivr / Fastly / 国内镜像 / GitHub Raw / 自定义域名）
- 开关备用镜像链接、维护 APK 版本与说明

### 需要配置的环境变量

在 Vercel 项目 Settings → Environment Variables 添加：

| 变量 | 说明 | 默认值 |
|---|---|---|
| `ADMIN_PASSWORD` | 后台登录密码 | `racwr52q` |
| `GITHUB_TOKEN` | 有 `chaos-store` 写入权限的令牌，不配置则后台只读 | 无 |
| `STORE_REPO` | 资源仓库 | `vultra-c/chaos-store` |
| `STORE_BRANCH` | 资源仓库分支 | `main` |

改完环境变量要重新部署一次才会生效。

## 本地开发

```bash
npm install
npm run dev
```
