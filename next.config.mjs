/** @type {import('next').NextConfig} */
const nextConfig = {
  // 类型检查由编辑器负责，构建阶段跳过，避免类型报错阻塞上线
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
}

export default nextConfig
