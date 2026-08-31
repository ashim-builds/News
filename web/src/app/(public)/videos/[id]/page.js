



import { Clock, Eye, Play } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function getYoutubeData(id, fallbackTitle) {
  let title = fallbackTitle;
  let views = "N/A";
  let date = "N/A";
  let summary = "";
  let imageUrl = "";
  let youtubeId = id;

  const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);

  if (isObjectId) {
    try {
      const res = await fetch(`${API_BASE}/api/articles/${id}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.article) {
          const dbDoc = data.article;
          if (dbDoc.title) title = dbDoc.title;
          if (dbDoc.summary) summary = dbDoc.summary;
          if (dbDoc.imageUrl) imageUrl = dbDoc.imageUrl;
          if (dbDoc.videoId) youtubeId = dbDoc.videoId;
          if (dbDoc.createdAt) date = new Date(dbDoc.createdAt).toLocaleDateString("ne-NP");
          if (dbDoc.views !== undefined) views = `${dbDoc.views.toLocaleString()} हेराई`;
        }
      }
    } catch (e) {
      console.error("Error fetching article by ObjectId:", e);
    }
  } else {
    try {
      const res = await fetch(`${API_BASE}/api/articles?status=Published&category=भिडियो ग्यालरी&videoId=${id}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.articles) && data.articles.length > 0) {
          const dbDoc = data.articles[0];
          if (dbDoc.title) title = dbDoc.title;
          if (dbDoc.summary) summary = dbDoc.summary;
          if (dbDoc.imageUrl) imageUrl = dbDoc.imageUrl;
          if (dbDoc.videoId) youtubeId = dbDoc.videoId;
          if (dbDoc.createdAt) date = new Date(dbDoc.createdAt).toLocaleDateString("ne-NP");
          if (dbDoc.views !== undefined) views = `${dbDoc.views.toLocaleString()} हेराई`;
        }
      }
    } catch (e) {
      console.error("Error fetching article by videoId:", e);
    }
  }

  try {
    const oembedRes = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`, { next: { revalidate: 3600 } });
    if (oembedRes.ok) {
      const oembedData = await oembedRes.json();
      if (!title || title === fallbackTitle) {
        title = oembedData.title || fallbackTitle;
      }
    }
  } catch (err) {}

  return { title, views, date, summary, imageUrl, youtubeId };
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const video = await getYoutubeData(id, "भिडियो समाचार");
  const title = `${video.title} | स्मार्टसञ्चार`;
  const description = video.summary || "स्मार्ट सञ्चार भिडियो ग्यालरी - ताजा, निष्पक्ष र भरपर्दो भिडियो समाचार।";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.smartsanchar.com";
  const pageUrl = `${siteUrl}/videos/${id}`;
  
  let ogImages = [];
  if (video.imageUrl) {
    ogImages.push({
      url: video.imageUrl,
      width: 1200,
      height: 630,
      alt: title,
    });
  }
  
  // Use guaranteed hqdefault as a fallback or primary to avoid 404s
  ogImages.push({
    url: `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`,
    width: 480,
    height: 360,
    alt: title,
  });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "स्मार्टसञ्चार",
      images: ogImages,
      locale: "ne_NP",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages.map(img => img.url),
    },
  };
}

export default async function VideoDetailPage({ params }) {
  const { id } = await params;
  const video = await getYoutubeData(id, "Video News");
  const youtubeId = video.youtubeId || id;

  let otherVideos = [];
  try {
    const res = await fetch(`${API_BASE}/api/articles?status=Published&category=भिडियो ग्यालरी`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.articles)) {
        const dbVideos = data.articles.filter((a) => a.videoId && a.videoId !== youtubeId);
        otherVideos = await Promise.all(
          dbVideos.slice(0, 6).map(async (doc) => {
            const vData = await getYoutubeData(doc.videoId, doc.title || "Video News");
            return { 
              id: doc.videoId, 
              title: vData.title,
              views: `${(doc.views || 0).toLocaleString()} हेराई`,
              date: doc.createdAt ? new Date(doc.createdAt).toLocaleDateString("ne-NP") : "N/A"
            };
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
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&modestbranding=1&rel=0&iv_load_policy=3`}
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
                      <div className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center border border-white/80 group-hover:scale-110 group-hover:bg-red-600 group-hover:border-red-600 transition-all duration-300">
                        <Play size={14} className="text-white fill-white translate-x-0.5" />
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
