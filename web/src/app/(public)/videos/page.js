



import { Clock, Eye, PlayCircle } from "lucide-react";
import Link from "next/link";
import { API_BASE } from "@/lib/api";

export const dynamic = "force-dynamic";


async function getYoutubeData(id, fallbackTitle) {
  let title = fallbackTitle;
  let views = "N/A";
  let date = "N/A";

  try {
    const oembedRes = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`, { next: { revalidate: 3600 } });
    if (oembedRes.ok) {
      const oembedData = await oembedRes.json();
      title = oembedData.title;
    }

    const htmlRes = await fetch(`https://www.youtube.com/watch?v=${id}`, {
      next: { revalidate: 3600 },
      headers: { "Accept-Language": "en-US,en;q=0.9" },
    });
    if (htmlRes.ok) {
      const html = await htmlRes.text();
      const match = html.match(/var ytInitialData = (.*);<\/script>/);
      if (match) {
        const data = JSON.parse(match[1]);
        const videoDetails =
          data.contents?.twoColumnWatchNextResults?.results?.results?.contents?.[0]?.videoPrimaryInfoRenderer;

        if (videoDetails?.viewCount?.videoViewCountRenderer?.viewCount?.simpleText) {
          views = videoDetails.viewCount.videoViewCountRenderer.viewCount.simpleText;
        } else if (videoDetails?.viewCount?.videoViewCountRenderer?.shortViewCount?.simpleText) {
          views = videoDetails.viewCount.videoViewCountRenderer.shortViewCount.simpleText;
        }

        if (videoDetails?.dateText?.simpleText) {
          date = videoDetails.dateText.simpleText;
        }
      }
    }
  } catch (err) {}

  return { title, views, date };
}

export default async function VideosPage() {
  let videos = [];
  try {
    const res = await fetch(`${API_BASE}/api/articles?status=Published&category=भिडियो ग्यालरी`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.articles)) {
        const videoDocs = data.articles.filter((v) => v.videoId);
        videos = await Promise.all(videoDocs.map(async (doc) => {
          const data = await getYoutubeData(doc.videoId, doc.title || "Video News");
          return { 
            id: doc.videoId, 
            title: data.title,
            views: data.views !== "N/A" ? data.views : `${(doc.views || 0).toLocaleString()} हेराई`,
            date: data.date !== "N/A" ? data.date : (doc.createdAt ? new Date(doc.createdAt).toLocaleDateString("ne-NP") : "N/A")
          };
        }));
      }
    }
  } catch (apiError) {
    console.warn("Videos page API fetch error:", apiError.message);
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      
      
      

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 border-b-2 border-gray-200 pb-4 flex items-center gap-3">
          <div className="w-2 h-8 bg-red-600"></div>
          Video News
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
          {videos.map((video, idx) => (
            <div key={idx} className="flex flex-col group">
              <Link href={`/videos/${video.id}`} className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-200 mb-3 shadow-sm block group-hover:opacity-90 transition-opacity">
                <img
                  className="w-full h-full object-cover"
                  src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                  alt={video.title}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-black/60 rounded-full flex items-center justify-center group-hover:bg-red-600 transition-colors">
                    <PlayCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Link>
              <div className="flex flex-col pr-2 mt-2">
                <Link href={`/videos/${video.id}`} className="block">
                  <h3 className="font-semibold text-[15px] text-gray-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                    {video.title}
                  </h3>
                </Link>
                <div className="text-[13px] text-gray-600 flex items-center gap-1.5 mt-1 font-medium">
                  <span>{video.views}</span>
                  <span className="text-[10px] text-gray-400">•</span>
                  <span>{video.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      
    </div>
  );
}
