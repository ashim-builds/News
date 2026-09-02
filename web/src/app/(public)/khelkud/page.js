import { API_BASE } from "@/lib/api";
import KhelkudClient from "./KhelkudClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "खेलकुद | स्मार्टसञ्चार",
  description: "नेपाल र विश्वभरका ताजा खेलकुद समाचारहरू। क्रिकेट, फुटबल, भलिबल, एथलेटिक्स तथा अन्य खेल गतिविधिहरू।",
};

export default async function KhelkudPage() {
  let sportsNews = [];
  try {
    const res = await fetch(`${API_BASE}/api/articles?status=Published&category=खेलकुद`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.articles)) {
        sportsNews = data.articles;
      }
    }
  } catch (err) {
    console.warn("[KHELKUD API FETCH NOTICE]", err.message);
  }

  return <KhelkudClient initialSportsNews={sportsNews} />;
}
