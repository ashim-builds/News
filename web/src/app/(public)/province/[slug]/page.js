import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import Article from "@/models/Article";
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

export default async function ProvincePage({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  if (!PROVINCES[slug]) {
    notFound();
  }

  const provinceName = PROVINCES[slug];
  
  let provinceNews = [];
  try {
    await connectDB();
    const query = {
      status: "Published",
      $or: [
        { province: new RegExp(provinceName, "i") },
        { category: new RegExp(provinceName, "i") },
        { title: new RegExp(provinceName, "i") },
      ],
    };

    const docs = await Article.find(query).sort({ createdAt: -1 }).lean();
    provinceNews = JSON.parse(JSON.stringify(docs));
  } catch (err) {
    console.error("[PROVINCE PAGE DB FETCH ERROR]", err);
  }

  return <ProvinceClient provinceName={provinceName} provinceNews={provinceNews} />;
}
