/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['image.tmdb.org', 'www.themoviedb.org', 'via.placeholder.com'],
    unoptimized: false,
  },
  async rewrites() {
    return [
      {
        source: '/api/vidsrc/:path*',
        destination: 'https://vidsrc.me/:path*',
      },
    ];
  },
  // Optimize for production
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      }
    ]
  }
};

module.exports = nextConfig;
