import { notFound } from "next/navigation";
import ProvinceClient from "./ProvinceClient";

export const dynamic = "force-dynamic";

const PROVINCES = {
  koshi: "कोशी",
  madhesh: "मधेश",
  bagmati: "बागमती",
  gandaki: "गण्डकी",
  lumbini: "लुम्बिनी",
  karnali: "कर्णाली",
  sudurpashchim: "सुदूरपश्चिम",
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default async function ProvincePage({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  if (!PROVINCES[slug]) {
    notFound();
  }

  const provinceName = PROVINCES[slug];
  
  let provinceNews = [];
  try {
    const res = await fetch(`${API_BASE}/api/articles?status=Published&province=${encodeURIComponent(provinceName)}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.articles)) {
        provinceNews = data.articles;
      }
    }
  } catch (err) {
    console.warn("[PROVINCE PAGE API FETCH NOTICE]", err.message);
  }

  return <ProvinceClient provinceName={provinceName} provinceNews={provinceNews} />;
}
