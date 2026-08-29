



import { Clock, Eye, PlayCircle } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function getYoutubeData(id, fallbackTitle) {
  let title = fallbackTitle;
  let views = "N/A";
  let date = "N/A";
  let summary = "";

  try {
    const res = await fetch(`${API_BASE}/api/articles?status=Published&category=भिडियो ग्यालरी`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.articles)) {
        const dbDoc = data.articles.find((a) => a.videoId === id);
        if (dbDoc) {
          if (dbDoc.title) title = dbDoc.title;
          if (dbDoc.summary) summary = dbDoc.summary;
        }
      }
    }
  } catch (e) {}

  try {
    const oembedRes = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`, { next: { revalidate: 3600 } });
    if (oembedRes.ok) {
      const oembedData = await oembedRes.json();
      if (!title || title === fallbackTitle) {
        title = oembedData.title || fallbackTitle;
      }
    }
  } catch (err) {}

  return { title, views, date, summary };
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const video = await getYoutubeData(id, "भिडियो समाचार");
  const title = `${video.title} | स्मार्टसञ्चार`;
  const description = video.summary || "स्मार्ट सञ्चार भिडियो ग्यालरी - ताजा, निष्पक्ष र भरपर्दो भिडियो समाचार।";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.smartsanchar.com";
  const pageUrl = `${siteUrl}/videos/${id}`;
  const videoThumbnail = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "स्मार्टसञ्चार",
      images: [
        {
          url: videoThumbnail,
          width: 480,
          height: 360,
          alt: video.title || "भिडियो थम्बनेल",
        },
      ],
      locale: "ne_NP",
      type: "video.other",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [videoThumbnail],
    },
  };
}

export default async function VideoDetailPage({ params }) {
  const { id } = await params;
  const video = await getYoutubeData(id, "Video News");

  let otherVideos = [];
  try {
    const res = await fetch(`${API_BASE}/api/articles?status=Published&category=भिडियो ग्यालरी`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.articles)) {
        const dbVideos = data.articles.filter((a) => a.videoId && a.videoId !== id);
        otherVideos = await Promise.all(
          dbVideos.slice(0, 6).map(async (doc) => {
            const vData = await getYoutubeData(doc.videoId, doc.title || "Video News");
            return { id: doc.videoId, ...vData };
          })
        );
      }
    }
  } catch (err) {}
  const sideVideos = otherVideos;

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Video Section */}
          <div className="lg:col-span-8">
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-md">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${id}?autoplay=1`}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
            <div className="mt-6 bg-white p-5 sm:p-6 rounded-xl shadow-xs border border-gray-200">
              <div className="inline-block bg-red-600 text-white text-xs font-extrabold px-3 py-1 rounded mb-3">
                भिडियो ग्यालरी
              </div>
              <h1 className="text-xl sm:text-3xl font-extrabold text-gray-900 mb-3 leading-snug">{video.title}</h1>
              {video.summary && (
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  {video.summary}
                </p>
              )}
              <div className="flex items-center text-xs sm:text-sm text-gray-500 gap-6 pt-3 border-t border-gray-100 font-medium">
                <span className="flex items-center gap-2 font-semibold">
                  <Clock size={16} className="text-red-600" /> 
                  {video.date}
                </span>
                <span className="flex items-center gap-2 font-semibold">
                  <Eye size={16} className="text-gray-600" /> 
                  {video.views}
                </span>
              </div>
            </div>
          </div>

          {/* Sidebar Videos */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <h2 className="text-xl font-bold text-gray-900 border-b-2 border-red-600 pb-2 inline-block">अन्य भिडियोहरू</h2>
            <div className="flex flex-col gap-4">
              {sideVideos.map((item, idx) => (
                <div key={idx} className="flex gap-4 group cursor-pointer bg-white p-3 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <Link href={`/videos/${item.id}`} className="relative w-40 aspect-video shrink-0 rounded-lg overflow-hidden bg-gray-200 block group-hover:opacity-90 transition-opacity">
                    <img
                      className="w-full h-full object-cover"
                      src={`https://img.youtube.com/vi/${item.id}/mqdefault.jpg`}
                      alt={item.title}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 bg-black/60 rounded-full flex items-center justify-center group-hover:bg-red-600 transition-colors">
                        <PlayCircle className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </Link>
                  <div className="flex flex-col py-1 pr-2">
                    <Link href={`/videos/${item.id}`} className="block">
                      <h4 className="font-semibold text-sm leading-snug group-hover:text-blue-600 line-clamp-3 mb-1.5 text-gray-900 transition-colors">
                        {item.title}
                      </h4>
                    </Link>
                    <div className="text-[11px] text-gray-500 flex flex-wrap items-center gap-x-3 gap-y-1 mt-auto font-medium">
                      <span className="flex items-center gap-1"><Clock size={12} className="text-blue-500"/> {item.date}</span>
                      <span className="flex items-center gap-1"><Eye size={12} className="text-green-500"/> {item.views}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      
    </div>
  );
}
