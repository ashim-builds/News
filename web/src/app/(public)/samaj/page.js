import SamajClient from "./SamajClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "हाम्रो समाजमा | स्मार्टसञ्चार",
  description: "समाज, संस्कृति, स्वास्थ्य र स्थानीय गतिविधि सम्बन्धी समाचार।",
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default async function SamajPage() {
  let newsList = [];
  try {
    const res = await fetch(`${API_BASE}/api/articles?status=Published&category=समाज`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.articles)) {
        newsList = data.articles;
      }
    }
  } catch (err) {
    console.warn("[SAMAJ PAGE API FETCH NOTICE]", err.message);
  }

  return <SamajClient newsList={newsList} />;
}
