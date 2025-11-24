const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
        },
      },
    },
  ],
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@mui/material', '@emotion/react', '@emotion/styled'],
  },
  images: {
    domains: [
      'localhost',
      'ipfs.io',
      'gateway.pinata.cloud',
      'dweb.link',
      'images.unsplash.com'
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  webpack: (config, { dev, isServer }) => {
    // Bundle analyzer in development
    if (dev && !isServer) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
        })
      )
    }

    // Tree shaking
   // config.optimization.usedExports = true
    config.optimization.sideEffects = false

    // Alias resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': '.',
      '@components': './components',
      '@utils': './utils',
      '@stores': './stores',
    }

    return config
  },
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
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
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
  redirects: async () => {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ]
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  output: 'standalone',
  trailingSlash: false,
  poweredByHeader: false,
}

module.exports = withPWA(nextConfig)
