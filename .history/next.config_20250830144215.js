/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['image.tmdb.org', 'www.themoviedb.org'],
  },
  async rewrites() {
    return [
      {
        source: '/api/vidsrc/:path*',
        destination: 'https://vidsrc.me/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
