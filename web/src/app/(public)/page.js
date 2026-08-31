import ProvinceNews from "@/components/home/ProvinceNews";
import { Clock, ChevronRight, PlayCircle, Eye } from "lucide-react";
import Link from "next/link";
import { getRelativeTimeNepali } from "@/lib/dateUtils";
import AdBanner from "@/components/common/AdBanner";

export const dynamic = "force-dynamic";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function getYoutubeData(id, fallbackTitle) {
  let title = fallbackTitle;
  let views = "N/A";
  let date = "N/A";

  try {
    const oembedRes = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`,
      { next: { revalidate: 3600 } }
    );
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
          data.contents?.twoColumnWatchNextResults?.results?.results
            ?.contents?.[0]?.videoPrimaryInfoRenderer;

        if (
          videoDetails?.viewCount?.videoViewCountRenderer?.viewCount?.simpleText
        ) {
          views =
            videoDetails.viewCount.videoViewCountRenderer.viewCount.simpleText;
        } else if (
          videoDetails?.viewCount?.videoViewCountRenderer?.shortViewCount
            ?.simpleText
        ) {
          views =
            videoDetails.viewCount.videoViewCountRenderer.shortViewCount.simpleText;
        }

        if (videoDetails?.dateText?.simpleText) {
          date = videoDetails.dateText.simpleText;
        }
      }
    }
  } catch (err) {
    console.error("Error fetching YouTube data:", err);
  }

  return { title, views, date };
}

function shuffleArray(array) {
  if (!Array.isArray(array) || array.length === 0) return [];
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default async function Home() {
  let articles = [];
  let videoDocs = [];

  try {
    const res = await fetch(`${API_BASE}/api/articles?status=Published`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.articles)) {
        const nonVideoArticles = data.articles.filter((a) => a.category !== "भिडियो ग्यालरी");
        
        // Separate featured and regular articles to prioritize featured posts at the top
        const featuredArticles = nonVideoArticles.filter((a) => a.isFeatured);
        const regularArticles = nonVideoArticles.filter((a) => !a.isFeatured);
        
        articles = [...featuredArticles, ...regularArticles];
        videoDocs = data.articles.filter((a) => a.category === "भिडियो ग्यालरी" && a.videoId);
      }
    }
  } catch (apiError) {
    console.warn("Backend API notice (Express backend starting or offline):", apiError.message);
  }

  // Featured / Top Stories
  const featuredPost = articles[0] || null;
  const secondaryPosts = articles.slice(1, 3);
  const additionalGridNews = articles.slice(3, 7);
  const mainNewsList = articles.slice(7, 20);

  // Marquee breaking news string
  const breakingNewsText =
    articles.length > 0
      ? shuffleArray(articles).slice(0, 6).map((a) => a.title).join(" • ")
      : "स्मार्टसञ्चारमा स्वागत छ! ताजा र निष्पक्ष समाचारका लागि हामीलाई पछ्याउनुहोस्।";

  let mainVideo = null;
  let sideVideos = [];

  if (videoDocs.length > 0) {
    const shuffledVideos = shuffleArray(videoDocs);
    const mainVideoId = shuffledVideos[0].videoId;
    const mainVideoFallbackTitle = shuffledVideos[0].title || "Video News";
    mainVideo = await getYoutubeData(mainVideoId, mainVideoFallbackTitle);
    mainVideo.id = mainVideoId;
    if (mainVideo.views === "N/A" || !mainVideo.views) {
      mainVideo.views = `${(shuffledVideos[0].views || 0).toLocaleString()} हेराई`;
    }
    if (mainVideo.date === "N/A" || !mainVideo.date) {
      mainVideo.date = shuffledVideos[0].createdAt ? new Date(shuffledVideos[0].createdAt).toLocaleDateString("ne-NP") : "N/A";
    }

    const sideVideoDocs = shuffledVideos.slice(1, 5);
    sideVideos = await Promise.all(
      sideVideoDocs.map(async (doc) => {
        const data = await getYoutubeData(
          doc.videoId,
          doc.title || "Video News"
        );
        return { 
          id: doc.videoId, 
          title: data.title,
          views: data.views !== "N/A" ? data.views : `${(doc.views || 0).toLocaleString()} हेराई`,
          date: data.date !== "N/A" ? data.date : (doc.createdAt ? new Date(doc.createdAt).toLocaleDateString("ne-NP") : "N/A")
        };
      })
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="container mx-auto px-4 py-6 overflow-hidden">
        {/* Breaking News Marquee */}
        <div className="flex items-center bg-white border border-gray-200 mb-6 p-2 rounded shadow-xs">
          <div className="bg-red-600 text-white px-3 py-1 font-bold rounded-xs whitespace-nowrap text-sm">
            ताजा अपडेट
          </div>
          <div className="overflow-hidden ml-3 w-full">
            <p className="marquee whitespace-nowrap text-gray-800 font-medium text-sm">
              {breakingNewsText}
            </p>
          </div>
        </div>

        {/* Top Featured Section */}
        {featuredPost && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
            {/* Main Featured (Left side on desktop) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <Link
                href={`/samachar/${featuredPost._id}`}
                className="bg-white rounded-xl shadow-xs overflow-hidden group hover:shadow-md transition-shadow border border-gray-200"
              >
                <div className="relative aspect-video overflow-hidden bg-gray-100">
                  {featuredPost.imageUrl ? (
                    <img
                      src={featuredPost.imageUrl}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">
                      मुख्य समाचार
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 text-xs font-extrabold rounded shadow-xs uppercase">
                    {featuredPost.category || "विशेष"}
                  </div>
                </div>
                <div className="p-6">
                  <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3 group-hover:text-red-600 transition-colors leading-snug">
                    {featuredPost.title}
                  </h1>
                  {featuredPost.summary && (
                    <p className="text-gray-600 text-sm md:text-base mb-4 line-clamp-2 leading-relaxed">
                      {featuredPost.summary}
                    </p>
                  )}
                  <div className="flex items-center text-xs text-gray-500 gap-4 font-medium">
                    <span className="flex items-center gap-1.5 font-bold text-gray-700">
                      <Clock size={14} className="text-red-500" />
                      {getRelativeTimeNepali(featuredPost.createdAt)}
                    </span>
                    <span className="flex items-center gap-1 text-gray-400 font-bold">
                      <Eye size={13} />
                      {(featuredPost.views || 0).toLocaleString()} हेराई
                    </span>
                  </div>
                </div>
              </Link>

              {/* Additional News Grid below Featured */}
              {additionalGridNews.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {additionalGridNews.map((news) => (
                    <Link
                      key={news._id}
                      href={`/samachar/${news._id}`}
                      className="bg-white rounded-xl shadow-xs overflow-hidden group hover:shadow-md transition-shadow border border-gray-200 flex flex-col"
                    >
                      <div className="relative aspect-16/10 overflow-hidden bg-gray-100">
                        {news.imageUrl ? (
                          <img
                            src={news.imageUrl}
                            alt={news.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                            नो इमेज
                          </div>
                        )}
                        <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-0.5 text-[10px] font-bold rounded">
                          {news.category || "समाचार"}
                        </div>
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <h4 className="font-bold text-gray-900 text-sm sm:text-base group-hover:text-red-600 line-clamp-2 mb-2 leading-snug flex-1">
                          {news.title}
                        </h4>
                        <div className="text-xs text-gray-400 flex items-center gap-1 mt-auto pt-2 border-t border-gray-100 font-medium">
                          <Clock size={12} className="text-red-500" />
                          {getRelativeTimeNepali(news.createdAt)}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Secondary Posts (Right side on desktop) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="grid grid-cols-1 gap-4">
                {secondaryPosts.map((post) => (
                  <Link
                    key={post._id}
                    href={`/samachar/${post._id}`}
                    className="bg-white rounded-xl shadow-xs overflow-hidden group border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="relative aspect-16/10 overflow-hidden bg-gray-100">
                      {post.imageUrl ? (
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                          नो इमेज
                        </div>
                      )}
                      <div className="absolute top-2 left-2 bg-gray-900 text-white px-2 py-0.5 text-[10px] font-bold rounded">
                        {post.category || "ताजा"}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-base font-bold text-gray-900 group-hover:text-red-600 line-clamp-2 mb-2 leading-snug">
                        {post.title}
                      </h3>
                      <div className="flex items-center text-xs text-gray-400 gap-1 font-medium">
                        <Clock size={12} className="text-red-500" />
                        {getRelativeTimeNepali(post.createdAt)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Sidebar Ad Placement */}
              <AdBanner position="sidebar" />
            </div>
          </div>
        )}

        {/* Province News Section */}
        <ProvinceNews />

        {/* Main News Grid Section */}
        {mainNewsList.length > 0 && (
          <section className="mb-10 mt-8">
            <div className="flex items-center justify-between border-b-2 border-red-600 mb-6 pb-2">
              <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                <div className="w-2 h-6 bg-red-600 rounded-xs"></div>
                सबै समाचार
              </h2>
              <Link
                href="/samachar"
                className="text-xs sm:text-sm font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                सबै हेर्नुहोस् <ChevronRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mainNewsList.map((news) => (
                <Link
                  key={news._id}
                  href={`/samachar/${news._id}`}
                  className="bg-white rounded-xl shadow-xs overflow-hidden group border border-gray-200 hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="relative aspect-video overflow-hidden bg-gray-100">
                    {news.imageUrl ? (
                      <img
                        src={news.imageUrl}
                        alt={news.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                        नो इमेज
                      </div>
                    )}
                    <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-0.5 text-[10px] font-bold rounded">
                      {news.category || "समाचार"}
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-gray-900 group-hover:text-red-600 line-clamp-2 mb-2 text-sm leading-snug flex-1">
                      {news.title}
                    </h3>
                    <div className="flex items-center text-[11px] text-gray-400 gap-1 mt-auto pt-2 border-t border-gray-100 font-medium">
                      <Clock size={12} className="text-red-500" />
                      {getRelativeTimeNepali(news.createdAt)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Video Gallery Section - Render ONLY if videos exist in MongoDB */}
        {mainVideo && (
          <section className="mb-10 bg-gray-900 text-white p-6 sm:p-8 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-800 mb-6 pb-3">
              <h2 className="text-xl md:text-2xl font-extrabold flex items-center gap-3 text-white">
                <PlayCircle className="text-red-500 w-7 h-7" />
                <span>भिडियो समाचार (Video Gallery)</span>
              </h2>
              <Link
                href="/videos"
                className="text-xs sm:text-sm font-bold text-red-400 hover:text-red-300 flex items-center gap-1"
              >
                सबै भिडियोहरू <ChevronRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Main Featured Video (Left 7 cols) */}
              <div className="lg:col-span-7 flex flex-col">
                <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg border border-gray-800 bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${mainVideo.id}?autoplay=0&modestbranding=1&rel=0&iv_load_policy=3`}
                    title={mainVideo.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
                    {mainVideo.title}
                  </h3>
                  <div className="flex items-center text-xs text-gray-400 gap-3 mt-2 font-medium">
                    <span>{mainVideo.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-red-400 font-bold">
                      <Eye size={12} /> {mainVideo.views}
                    </span>
                  </div>
                </div>
              </div>

              {/* Side Videos Grid (Right 5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-3">
                {sideVideos.map((video) => (
                  <Link
                    key={video.id}
                    href={`/videos/${video.id}`}
                    className="flex gap-3 bg-gray-800/80 hover:bg-gray-800 p-2.5 rounded-xl border border-gray-700/60 hover:border-red-500/50 transition-all group"
                  >
                    <div className="w-28 h-18 rounded-lg overflow-hidden shrink-0 bg-black relative border border-gray-700">
                      <img
                        src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <PlayCircle className="w-6 h-6 text-white opacity-80 group-hover:opacity-100" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <h4 className="text-xs sm:text-sm font-bold text-gray-200 group-hover:text-white line-clamp-2 leading-snug">
                        {video.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-1">
                        <span>{video.date}</span>
                        <span>•</span>
                        <span className="text-red-400">{video.views}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
