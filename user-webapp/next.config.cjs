// Content Security Policy
// //
// See also Mozilla documentation:
// https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
const ContentSecurityPolicy = `
  child-src 'self';
  frame-ancestors 'self';
`;

// See other Security Headers on Next.js documentation:
// https://nextjs.org/docs/advanced-features/security-headers
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
];

/** @type {import('next').NextConfig} */
module.exports = {
  async headers() {
    return [
      {
        // Apply securityHeaders headers to all routes.
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  reactStrictMode: true,
  swcMinify: true,
};
