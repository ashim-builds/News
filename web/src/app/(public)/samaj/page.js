import { connectDB } from "@/lib/db";
import Article from "@/models/Article";
import SamajClient from "./SamajClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "हाम्रो समाजमा | स्मार्टसञ्चार",
  description: "समाज, संस्कृति, स्वास्थ्य र स्थानीय गतिविधि सम्बन्धी समाचार।",
};

export default async function SamajPage() {
  let newsList = [];
  try {
    await connectDB();
    const docs = await Article.find({
      status: "Published",
      category: new RegExp("हाम्रो समाजमा|समाज", "i"),
    })
      .sort({ createdAt: -1 })
      .lean();

    newsList = JSON.parse(JSON.stringify(docs));
  } catch (err) {
    console.error("[SAMAJ PAGE DB FETCH ERROR]", err);
  }

  return <SamajClient newsList={newsList} />;
}
