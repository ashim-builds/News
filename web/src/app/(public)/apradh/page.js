import { connectDB } from "@/lib/db";
import Article from "@/models/Article";
import ApradhClient from "./ApradhClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "अपराध | स्मार्टसञ्चार",
  description: "अपराध, सुरक्षा, प्रहरी अनुसन्धान तथा न्यायिक गतिविधि सम्बन्धी ताजा समाचार।",
};

export default async function ApradhPage() {
  let crimeNews = [];
  try {
    await connectDB();
    const docs = await Article.find({
      status: "Published",
      category: new RegExp("अपराध", "i"),
    })
      .sort({ createdAt: -1 })
      .lean();

    crimeNews = JSON.parse(JSON.stringify(docs));
  } catch (err) {
    console.error("[APRADH DB FETCH ERROR]", err);
  }

  return <ApradhClient crimeNews={crimeNews} />;
}
