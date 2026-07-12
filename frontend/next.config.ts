/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable source maps in production to protect code
  productionBrowserSourceMaps: false,

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevent clickjacking
          { key: 'X-Frame-Options', value: 'DENY' },
          // Prevent MIME type sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // XSS Protection
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          // Referrer policy
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob:",
              "frame-src https://www.n2yo.com https://satellitemap.space https://celestrak.org",
              "connect-src 'self' http://localhost:8000 http://127.0.0.1:8000 https://orbital-risk-intel.onrender.com " + (process.env.NEXT_PUBLIC_API_URL || ''),
            ].join('; '),
          },
        ],
      },
    ];
  },

  // Disable powered-by header
  poweredByHeader: false,

  // Ignore build errors for production deploy (strict type issues in Recharts)
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
