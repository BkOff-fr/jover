/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configuration optimisée pour Windows
  trailingSlash: false,
  
  // Configuration des images pour performance optimale
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Optimisations de performance
  experimental: {
    optimizePackageImports: ['gsap', '@gsap/react', '@studio-freight/react-lenis'],
    esmExternals: 'loose'
  },
  
  // Configuration pour 3d-force-graph
  transpilePackages: ['three', 'react-force-graph-3d', '3d-force-graph'],
  
  // Compilation optimisée
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Optimisations de build
  poweredByHeader: false,
  compress: true,
  
  // Configuration webpack pour 3d-force-graph
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      }
    }
    return config
  },
  
  // Headers de performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);