# chaos-web

Chaos 官网 —— 小米手环 10 Pro 投递包制作台（Chaos Bandpack）的下载与介绍站点。

- 官网：https://chaosmgr.dpdns.org
- Android 制作台源码：<https://github.com/WenHuaYiYang/chaos-bandpack>
- 设备侧模块：<https://github.com/WenHuaYiYang/Chaos-Module>

## 架构：下载走 GitHub 直链

下载文件放在本仓库根目录，链接直指 `github.com/vultra-c/chaos-web/raw/refs/heads/main/<文件名>`，
与站点部署解耦。网站读取仓库根目录的 `manifest.json` 渲染下载列表。

后台可切换下载线路：GitHub 直链（默认）、GitHub Raw、jsDelivr、KGithub、GHProxy、自定义域名。

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
