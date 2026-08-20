import { connectDB } from "@/lib/db";
import Article from "@/models/Article";
import ITClient from "./ITClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "सूचना प्रविधि | स्मार्टसञ्चार",
  description: "प्रविधि, ग्याजेट, स्टार्टअप र डिजिटल नेपालका समाचारहरू।",
};

export default async function ITPage() {
  let newsList = [];
  try {
    await connectDB();
    const docs = await Article.find({
      status: "Published",
      category: new RegExp("सूचना प्रविधि|प्रविधि|IT", "i"),
    })
      .sort({ createdAt: -1 })
      .lean();

    newsList = JSON.parse(JSON.stringify(docs));
  } catch (err) {
    console.error("[IT PAGE DB FETCH ERROR]", err);
  }

  return <ITClient newsList={newsList} />;
}
