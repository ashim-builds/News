import { API_BASE } from "@/lib/api";
import ApradhClient from "./ApradhClient";

export const dynamic = "force-dynamic";


export const metadata = {
  title: "अपराध | स्मार्टसञ्चार",
  description: "अपराध, सुरक्षा, प्रहरी अनुसन्धान तथा न्यायिक गतिविधि सम्बन्धी ताजा समाचार।",
};


export default async function ApradhPage() {
  let crimeNews = [];
  try {
    const res = await fetch(`${API_BASE}/api/articles?status=Published&category=अपराध`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.articles)) {
        crimeNews = data.articles;
      }
    }
  } catch (err) {
    console.warn("[APRADH API FETCH NOTICE]", err.message);
  }

  return <ApradhClient crimeNews={crimeNews} />;
}
