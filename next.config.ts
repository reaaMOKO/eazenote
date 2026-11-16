import type { NextConfig } from "next";

/**
 * Security headers sent with every page.
 * A full Content-Security-Policy is added in Phase 5, once the outside
 * services (Supabase, email) are known.
 */
const SECURITY_HEADERS = [
  // Always use the encrypted (https) address, for the next two years.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  // Stop other websites from showing EazeNote inside a frame (clickjacking).
  { key: "X-Frame-Options", value: "DENY" },
  // Stop browsers from guessing file types.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Do not leak consult page addresses to other sites.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Only EazeNote itself may use the microphone. Camera and location are never needed.
  { key: "Permissions-Policy", value: "microphone=(self), camera=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  // Do not advertise which framework the app runs on.
  poweredByHeader: false,

  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  async headers() {
    return [{ source: "/(.*)", headers: SECURITY_HEADERS }];
  },

  // The call-back campaign page is a plain HTML file in public/callback, so the
  // ad link can be the short /callback address instead of /callback/index.html.
  async rewrites() {
    return [{ source: "/callback", destination: "/callback/index.html" }];
  },
};

export default nextConfig;
