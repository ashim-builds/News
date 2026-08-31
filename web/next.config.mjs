/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
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
