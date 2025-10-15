/** @type {import('next').NextConfig} */const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  experimental: {
    optimizeCss: true,
    scrollRestoration: true
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.coverr.co' },
      { protocol: 'https', hostname: 'hoirqrkdgbmvpwutwuwj-all.supabase.co' },
      { protocol: 'https', hostname: 'properties.emaar.com' },
      { protocol: 'https', hostname: 'cdn.properties.emaar.com' },
      { protocol: 'https', hostname: 'www.damacproperties.com' },
      { protocol: 'https', hostname: 'www.sobharealty.com' },
      { protocol: 'https', hostname: 'www.nakheel.com' }
    ],
    dangerouslyAllowSVG: true,
  }
};
module.exports = nextConfig;
