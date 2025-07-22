/** @type {import('next').NextConfig} */
const nextConfig = {
  // 图片优化配置
  images: {
    // 允许的图片域名
    domains: [
      'localhost',
      // 添加你的生产域名
      // 'yourdomain.com',
    ],
    // 远程图片模式配置
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
    ],
    // 图片格式优化
    formats: ['image/webp', 'image/avif'],
    // 图片尺寸配置
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // 启用图片优化
    unoptimized: false,
  },

  // 实验性功能
  experimental: {
    // 启用 App Router 的静态导出优化
    optimizePackageImports: ['lucide-react'],
  },

  // 编译配置
  compiler: {
    // 移除 console.log (仅在生产环境)
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // 性能优化
  poweredByHeader: false,
  compress: true,

  // 重定向配置
  async redirects() {
    return [
      // 示例重定向
      // {
      //   source: '/old-blog/:slug',
      //   destination: '/posts/:slug',
      //   permanent: true,
      // },
    ];
  },

  // 头部配置
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // 安全头部
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          // API 缓存头部
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300',
          },
        ],
      },
      {
        source: '/_next/image(.*)',
        headers: [
          // 图片缓存头部
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          // 静态资源缓存头部
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
