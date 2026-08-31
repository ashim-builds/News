import { notFound } from "next/navigation";
import ProvinceClient from "./ProvinceClient";
import { API_BASE } from "@/lib/api";

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



export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const provinceName = PROVINCES[slug] || "प्रदेश";
  const title = `${provinceName} प्रदेश समाचार | स्मार्टसञ्चार`;
  const description = `${provinceName} प्रदेशका ताजा, निष्पक्ष र भरपर्दा समाचारहरू। राजनीति, समाज, विकास र स्थानीय गतिविधि।`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.smartsanchar.com";
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/province/${slug}`,
      siteName: "स्मार्टसञ्चार",
      images: [
        {
          url: `${siteUrl}/logo.jpg`,
          width: 1200,
          height: 630,
          alt: `${provinceName} प्रदेश समाचार`,
        },
      ],
      locale: "ne_NP",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteUrl}/logo.jpg`],
    },
  };
}

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
        provinceNews = data.articles.filter((a) => a.category !== "भिडियो ग्यालरी");
      }

    }
  } catch (err) {
    console.warn("[PROVINCE PAGE API FETCH NOTICE]", err.message);
  }

  return <ProvinceClient provinceName={provinceName} provinceNews={provinceNews} />;
}
