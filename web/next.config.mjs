/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  poweredByHeader: false,
  compress: true,

  // Image optimization formats for maximum compression and 60fps rendering
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "**.smartsanchar.com",
      },
    ],
  },

  async rewrites() {
    let apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    if (apiUrl && !apiUrl.startsWith("http://") && !apiUrl.startsWith("https://") && !apiUrl.startsWith("/")) {
      apiUrl = `https://${apiUrl}`;
    }
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
