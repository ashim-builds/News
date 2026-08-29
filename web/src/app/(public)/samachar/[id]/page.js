import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  Eye,
  User,
  Share2,
  ChevronRight,
  Sparkles,
  Newspaper,
  ArrowLeft,
} from "lucide-react";
import { getRelativeTimeNepali } from "@/lib/dateUtils";

export const dynamic = "force-dynamic";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  try {
    const res = await fetch(`${API_BASE}/api/articles/${id}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.article) {
        const title = `${data.article.title} | स्मार्टसञ्चार`;
        const description = data.article.summary || data.article.content?.slice(0, 150) || "";
        const imageUrl = data.article.imageUrl;
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.smartsanchar.com";
        const pageUrl = `${siteUrl}/samachar/${id}`;

        let ogImages = [];
        if (imageUrl) {
          if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
            ogImages.push({
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: data.article.title || "समाचार इमेज",
            });
          } else {
            const cleanImage = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
            ogImages.push({
              url: `${siteUrl}${cleanImage}`,
              width: 1200,
              height: 630,
              alt: data.article.title || "समाचार इमेज",
            });
          }
        } else {
          ogImages.push({
            url: `${siteUrl}/logo.jpg`,
            width: 1200,
            height: 630,
            alt: "स्मार्टसञ्चार",
          });
        }

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
            type: "article",
          },
          twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ogImages.map((img) => img.url),
          },
        };
      }
    }
  } catch (err) {
    console.error("Error generating metadata for article:", err);
  }
  return { title: "समाचार विवरण | स्मार्टसञ्चार" };
}

export default async function NewsDetailPage({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  let article = null;
  let suggestions = [];

  try {
    const res = await fetch(`${API_BASE}/api/articles/${id}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.article) {
        article = data.article;
      }
    }

    if (!article) {
      return notFound();
    }

    const suggRes = await fetch(`${API_BASE}/api/articles?status=Published&limit=6`, { cache: "no-store" });
    if (suggRes.ok) {
      const suggData = await suggRes.json();
      if (suggData.success && Array.isArray(suggData.articles)) {
        suggestions = suggData.articles.filter((a) => a._id !== id).slice(0, 4);
      }
    }
  } catch (apiError) {
    console.warn("News detail API fetch error:", apiError.message);
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Top Banner / Breadcrumb */}
      <div className="bg-white border-b border-gray-200 py-4 px-4 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-medium overflow-hidden text-ellipsis whitespace-nowrap">
            <Link href="/" className="hover:text-red-600 transition flex items-center gap-1">
              गृह
            </Link>
            <ChevronRight size={14} />
            <Link href="/samachar" className="hover:text-red-600 transition">
              समाचार
            </Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-bold truncate max-w-[200px] sm:max-w-md">
              {article.title}
            </span>
          </div>

          <Link
            href="/samachar"
            className="flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-red-600 transition shrink-0 bg-gray-100 px-3 py-1.5 rounded-lg"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">सबै समाचार</span>
          </Link>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main News Content Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6 bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-gray-200">
            
            {/* Category & Province Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-red-600 text-white text-xs font-extrabold px-3 py-1 rounded-md shadow-2xs uppercase tracking-wider">
                {article.category || "समाचार"}
              </span>
              {article.province && (
                <span className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1 rounded-md border border-gray-200">
                  {article.province}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl font-black text-gray-900 leading-snug sm:leading-tight">
              {article.title}
            </h1>

            {/* Metadata Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-gray-100 text-xs sm:text-sm text-gray-500 font-medium">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 font-bold text-gray-800">
                  <User size={15} className="text-red-600" />
                  {article.author || "स्मार्ट सञ्चार संवाददाता"}
                </span>
                <span className="flex items-center gap-1 text-gray-500 font-semibold">
                  <Clock size={14} className="text-red-500" />
                  {getRelativeTimeNepali(article.createdAt)}
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full text-gray-700 font-mono font-bold text-xs">
                <Eye size={14} className="text-gray-500" />
                <span>{(article.views || 0).toLocaleString()} हेराई</span>
              </div>
            </div>

            {/* Main Featured Image */}
            {article.imageUrl ? (
              <div className="w-full aspect-16/10 rounded-2xl overflow-hidden border border-gray-200 shadow-xs bg-gray-100">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-64 bg-gradient-to-r from-red-50 to-gray-100 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-400 font-bold text-base">
                <Newspaper size={48} className="text-red-400 opacity-40 mr-3" />
                <span>स्मार्ट सञ्चार समाचार</span>
              </div>
            )}

            {/* Summary Lead Block */}
            {article.summary && (
              <div className="p-5 bg-red-50/70 border-l-4 border-red-600 rounded-r-xl text-gray-900 font-semibold text-base sm:text-lg leading-relaxed">
                {article.summary}
              </div>
            )}

            {/* Main Article Body Text */}
            <div className="prose prose-base sm:prose-lg max-w-none text-gray-800 leading-relaxed font-normal space-y-4 whitespace-pre-line pt-2">
              {article.content ? (
                article.content
              ) : (
                <p className="text-gray-500 italic">
                  यो समाचारको विस्तृत विवरण छिट्टै अपडेट गरिनेछ।
                </p>
              )}
            </div>

            {/* Footer Tag */}
            <div className="pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400 font-medium">
              <span>प्रकाशित: {getRelativeTimeNepali(article.createdAt)} {article.createdAt ? `(${new Date(article.createdAt).toLocaleDateString("ne-NP")})` : ""}</span>
              <span className="text-red-600 font-bold">स्मार्टसञ्चार मिडिया नेटवर्क</span>
            </div>

          </div>

          {/* Sidebar Recommendations Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-200 sticky top-4">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
                <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                  <Sparkles size={18} className="text-red-600" />
                  <span>अन्य मुख्य समाचारहरू</span>
                </h3>
                <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                  ताजा सिफारिस
                </span>
              </div>

              {suggestions.length === 0 ? (
                <p className="text-xs text-gray-400">अन्य कुनै समाचार उपलब्ध छैन।</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {suggestions.map((item) => (
                    <Link
                      key={item._id}
                      href={`/samachar/${item._id}`}
                      className="group flex gap-3 p-2 rounded-xl hover:bg-red-50/50 transition-all border border-transparent hover:border-red-100"
                    >
                      <div className="w-24 h-18 rounded-lg overflow-hidden shrink-0 bg-gray-100 relative border border-gray-200">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px]">
                            नो इमेज
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-extrabold text-red-600 uppercase tracking-wider block mb-0.5">
                          {item.category || "समाचार"}
                        </span>
                        <h4 className="font-bold text-gray-900 text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-red-600 transition-colors">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-1 font-medium">
                          <span>{getRelativeTimeNepali(item.createdAt)}</span>
                          <span>•</span>
                          <span>{(item.views || 0).toLocaleString()} हेराई</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
