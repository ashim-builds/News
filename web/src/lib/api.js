let rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

if (rawApiUrl && !rawApiUrl.startsWith("http://") && !rawApiUrl.startsWith("https://") && !rawApiUrl.startsWith("/")) {
  rawApiUrl = `https://${rawApiUrl}`;
}

export const API_BASE = rawApiUrl;
