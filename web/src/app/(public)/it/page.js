import ITClient from "./ITClient";
import { API_BASE } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "सूचना प्रविधि | स्मार्टसञ्चार",
  description: "प्रविधि, ग्याजेट, स्टार्टअप र डिजिटल नेपालका समाचारहरू।",
};


export default async function ITPage() {
  let newsList = [];
  try {
    const res = await fetch(`${API_BASE}/api/articles?status=Published&category=सूचना प्रविधि`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.articles)) {
        newsList = data.articles;
      }
    }
  } catch (err) {
    console.warn("[IT PAGE API FETCH NOTICE]", err.message);
  }

  return <ITClient newsList={newsList} />;
}
