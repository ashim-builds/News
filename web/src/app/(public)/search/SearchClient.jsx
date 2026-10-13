"use client";

import { useState, useEffect, useTransition, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  X,
  PlayCircle,
  Clock,
  Eye,
  Filter,
  ArrowRight,
  Sparkles,
  Newspaper,
  Video,
  ChevronRight,
  TrendingUp,
  SlidersHorizontal,
} from "lucide-react";
import { getRelativeTimeNepali } from "@/lib/dateUtils";

// Helper to highlight matching search words
function HighlightText({ text, query }) {
  if (!text || !query || !query.trim()) return <span>{text}</span>;

  const words = query
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0)
    .map((w) => w.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"));

  if (words.length === 0) return <span>{text}</span>;

  try {
    const regex = new RegExp(`(${words.join("|")})`, "gi");
    const parts = text.split(regex);

    return (
      <span>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark
              key={i}
              className="bg-amber-100 text-red-700 px-0.5 rounded font-bold"
            >
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  } catch (e) {
    return <span>{text}</span>;
  }
}

const POPULAR_SEARCH_TAGS = [
  "राजनीति",
  "काठमाडौं",
  "अर्थ",
  "खेलकुद",
  "सूचना प्रविधि",
  "भिडियो",
  "सुनको मूल्य",
  "शिक्षा",
  "पर्यटन",
];

export default function SearchClient({
  initialQuery = "",
  initialArticles = [],
  initialCounts = { all: 0, news: 0, videos: 0 },
  recentArticles = [],
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchInput, setSearchInput] = useState(initialQuery);
  const [activeType, setActiveType] = useState("all"); // 'all' | 'news' | 'videos'
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest"); // 'latest' | 'views' | 'oldest'

  // Sync state when URL search param changes
  useEffect(() => {
    const q = searchParams.get("q") || "";
    setSearchInput(q);
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const clean = searchInput.trim();
    if (clean) {
      router.push(`/search?q=${encodeURIComponent(clean)}`);
    } else {
      router.push("/search");
    }
  };

  const handleTagClick = (tag) => {
    setSearchInput(tag);
    router.push(`/search?q=${encodeURIComponent(tag)}`);
  };

  const handleClear = () => {
    setSearchInput("");
    router.push("/search");
  };

  // Extract unique categories from search results
  const availableCategories = useMemo(() => {
    const cats = new Set();
    initialArticles.forEach((art) => {
      if (art.category && art.category !== "भिडियो ग्यालरी") {
        cats.add(art.category);
      }
    });
    return Array.from(cats);
  }, [initialArticles]);

  // Client-side filtering & sorting for smooth instant interaction
  const filteredArticles = useMemo(() => {
    let list = [...initialArticles];

    // Filter by type
    if (activeType === "videos") {
      list = list.filter((a) => a.isVideo);
    } else if (activeType === "news") {
      list = list.filter((a) => !a.isVideo);
    }

    // Filter by category
    if (selectedCategory !== "all") {
      list = list.filter((a) => a.category === selectedCategory);
    }

    // Sort
    if (sortBy === "views") {
      list.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (sortBy === "oldest") {
      list.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    } else {
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    return list;
  }, [initialArticles, activeType, selectedCategory, sortBy]);

  const newsItems = useMemo(
    () => filteredArticles.filter((a) => !a.isVideo),
    [filteredArticles]
  );
  const videoItems = useMemo(
    () => filteredArticles.filter((a) => a.isVideo),
    [filteredArticles]
  );

  return (
    <div className="bg-gray-50 min-h-screen py-6 sm:py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-red-600 transition">
            गृह
          </Link>
          <ChevronRight size={14} />
          <span className="font-bold text-gray-900">खोज</span>
          {initialQuery && (
            <>
              <ChevronRight size={14} />
              <span className="text-red-600 truncate max-w-xs">&quot;{initialQuery}&quot;</span>
            </>
          )}
        </div>

        {/* Hero Search Box Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-5 sm:p-8 mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
            स्मार्ट खोज (Search Portal)
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mb-6">
            नेपालका ताजा समाचार, लेख, भिडियो ग्यालरी र घटनाहरू खोज्नुहोस्।
          </p>

          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="समाचार, भिडियो, शीर्षक वा शब्द खोज्नुहोस्..."
                className="w-full h-12 sm:h-14 pl-11 pr-10 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-red-600 focus:ring-4 focus:ring-red-100 outline-none text-gray-900 text-sm sm:text-base font-medium transition-all"
              />
              <Search
                size={20}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700 transition"
                  title="हटाउनुहोस्"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="ml-3 h-12 sm:h-14 px-5 sm:px-8 bg-red-600 hover:bg-red-700 active:scale-98 text-white rounded-xl font-bold text-sm sm:text-base shadow-sm transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <span>खोज्नुहोस्</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Popular Search Tags */}
          <div className="flex items-center gap-2 flex-wrap mt-4 pt-4 border-t border-gray-100 text-xs">
            <span className="text-gray-400 font-semibold flex items-center gap-1 shrink-0">
              <TrendingUp size={13} className="text-red-500" />
              प्रचलित खोज:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {POPULAR_SEARCH_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  className={`px-2.5 py-1 rounded-full border transition cursor-pointer font-medium ${
                    initialQuery === tag
                      ? "bg-red-50 text-red-600 border-red-200 font-bold"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search Results Header & Tabs */}
        {initialQuery ? (
          <div>
            {/* Query Summary & Results Count */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
                  <span>&quot;{initialQuery}&quot;</span>
                  <span className="text-gray-400 text-base font-normal">को लागि नतिजाहरू</span>
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  कुल <span className="font-bold text-red-600">{initialArticles.length}</span> वटा नतिजा फेला पर्यो
                </p>
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs text-gray-500 font-semibold flex items-center gap-1">
                  <SlidersHorizontal size={13} />
                  क्रमबद्ध:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-gray-200 text-gray-800 text-xs font-semibold rounded-lg px-2.5 py-1.5 outline-none focus:border-red-500 cursor-pointer shadow-2xs"
                >
                  <option value="latest">नयाँ पहिले (Latest)</option>
                  <option value="views">धेरै हेरिएका (Most Popular)</option>
                  <option value="oldest">पुरानो पहिले (Oldest)</option>
                </select>
              </div>
            </div>

            {/* Filter Tabs Bar (All / News / Videos) */}
            <div className="bg-white p-2 rounded-xl border border-gray-200/90 shadow-2xs mb-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setActiveType("all")}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                    activeType === "all"
                      ? "bg-red-600 text-white shadow-2xs"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span>सबै</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[11px] ${
                      activeType === "all" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {initialArticles.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveType("news")}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                    activeType === "news"
                      ? "bg-red-600 text-white shadow-2xs"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Newspaper size={14} />
                  <span>समाचार तथा लेख</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[11px] ${
                      activeType === "news" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {initialCounts.news || initialArticles.filter((a) => !a.isVideo).length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveType("videos")}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                    activeType === "videos"
                      ? "bg-red-600 text-white shadow-2xs"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Video size={14} />
                  <span>भिडियो ग्यालरी</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[11px] ${
                      activeType === "videos" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {initialCounts.videos || initialArticles.filter((a) => a.isVideo).length}
                  </span>
                </button>
              </div>

              {/* Category Pills (if multiple categories available) */}
              {availableCategories.length > 0 && activeType !== "videos" && (
                <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
                  <span className="text-[11px] font-bold text-gray-400 shrink-0">विधा:</span>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("all")}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition shrink-0 cursor-pointer ${
                      selectedCategory === "all"
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    सबै
                  </button>
                  {availableCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition shrink-0 cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Results Output */}
            {filteredArticles.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center shadow-xs">
                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  कुनै नतिजा फेला परेन
                </h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
                  तपाईंले खोज्नुभएको &quot;{initialQuery}&quot; सँग मेल खाने कुनै पनि समाचार वा भिडियो भेटिएन। कृपया अर्को शब्द टाइप गर्नुहोस् वा तलका विषयहरू हेर्नुहोस्।
                </p>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {POPULAR_SEARCH_TAGS.slice(0, 5).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleTagClick(t)}
                      className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600 text-xs font-semibold transition cursor-pointer"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-10">
                {/* Videos Section (if activeType === 'all' or 'videos') */}
                {(activeType === "all" || activeType === "videos") && videoItems.length > 0 && (
                  <div>
                    {activeType === "all" && (
                      <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-4">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                          <Video size={18} className="text-red-600" />
                          <span>भिडियो नतिजाहरू ({videoItems.length})</span>
                        </h3>
                        <button
                          type="button"
                          onClick={() => setActiveType("videos")}
                          className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
                        >
                          सबै भिडियो हेर्नुहोस् <ArrowRight size={12} />
                        </button>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                      {videoItems.map((video) => {
                        const ytId = video.videoId || video._id;
                        const href = video.videoId
                          ? `/videos/${video.videoId}`
                          : `/samachar/${video._id}`;
                        const thumb = video.videoId
                          ? `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`
                          : video.imageUrl || "/logo.jpg";

                        return (
                          <div
                            key={video._id}
                            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col group"
                          >
                            <Link href={href} className="relative aspect-video bg-black overflow-hidden block">
                              <img
                                src={thumb}
                                alt={video.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-black/25 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                                  <PlayCircle size={24} />
                                </div>
                              </div>
                              <span className="absolute bottom-2 left-2 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                भिडियो
                              </span>
                            </Link>

                            <div className="p-4 flex-1 flex flex-col justify-between">
                              <Link href={href}>
                                <h4 className="font-bold text-gray-900 text-sm line-clamp-2 leading-snug group-hover:text-red-600 transition-colors mb-2">
                                  <HighlightText text={video.title} query={initialQuery} />
                                </h4>
                              </Link>

                              <div className="flex items-center justify-between text-xs text-gray-400 font-medium pt-2 border-t border-gray-100">
                                <span className="flex items-center gap-1">
                                  <Clock size={12} />
                                  {getRelativeTimeNepali(video.createdAt)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Eye size={12} />
                                  {(video.views || 0).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* News & Articles Section */}
                {(activeType === "all" || activeType === "news") && newsItems.length > 0 && (
                  <div>
                    {activeType === "all" && (
                      <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-4">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                          <Newspaper size={18} className="text-red-600" />
                          <span>समाचार तथा लेखहरू ({newsItems.length})</span>
                        </h3>
                        <button
                          type="button"
                          onClick={() => setActiveType("news")}
                          className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
                        >
                          सबै समाचार हेर्नुहोस् <ArrowRight size={12} />
                        </button>
                      </div>
                    )}

                    <div className="flex flex-col gap-4">
                      {newsItems.map((article) => (
                        <Link
                          key={article._id}
                          href={`/samachar/${article._id}`}
                          className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/90 shadow-2xs hover:shadow-md hover:border-red-200 transition-all flex flex-col sm:flex-row gap-4 sm:gap-5 group"
                        >
                          {/* Thumbnail */}
                          <div className="sm:w-48 sm:h-32 w-full aspect-16/10 sm:aspect-auto rounded-xl overflow-hidden bg-gray-100 shrink-0 relative border border-gray-100">
                            {article.imageUrl ? (
                              <img
                                src={article.imageUrl}
                                alt={article.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                                <Newspaper size={32} />
                              </div>
                            )}
                          </div>

                          {/* Content Details */}
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <span className="bg-red-50 text-red-600 text-xs font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                                  {article.category || "समाचार"}
                                </span>
                                {article.province && (
                                  <span className="bg-gray-100 text-gray-600 text-[11px] font-bold px-2 py-0.5 rounded">
                                    {article.province}
                                  </span>
                                )}
                                <span className="text-xs text-gray-400 flex items-center gap-1 ml-auto font-medium">
                                  <Clock size={12} className="text-red-500" />
                                  {getRelativeTimeNepali(article.createdAt)}
                                </span>
                              </div>

                              <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors leading-snug mb-2">
                                <HighlightText text={article.title} query={initialQuery} />
                              </h3>

                              <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                                <HighlightText
                                  text={article.summary || article.content || ""}
                                  query={initialQuery}
                                />
                              </p>
                            </div>

                            <div className="flex items-center justify-between text-xs text-gray-400 font-medium pt-3 mt-3 border-t border-gray-100">
                              <span className="text-gray-600 font-semibold truncate max-w-xs">
                                {article.author || "स्मार्ट सञ्चार संवाददाता"}
                              </span>
                              <span className="flex items-center gap-1 font-bold text-gray-700 bg-gray-50 px-2 py-0.5 rounded">
                                <Eye size={12} className="text-gray-400" />
                                {(article.views || 0).toLocaleString()} हेराई
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Zero Query / Empty Search View: Prompt & Trending Articles */
          <div>
            <div className="text-center py-6 mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                खोज्नको लागि कुनै शब्द टाइप गर्नुहोस्
              </h2>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                माथिको खोज बाकसमा समाचार, भिडियो वा लेखकको नाम टाइप गरेर तुरुन्तै खोज्नुहोस्।
              </p>
            </div>

            {/* Trending News Section */}
            {recentArticles.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
                  <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                    <Sparkles size={18} className="text-red-600" />
                    <span>ताजा तथा मुख्य समाचारहरू</span>
                  </h3>
                  <Link href="/samachar" className="text-xs font-bold text-red-600 hover:underline">
                    सबै समाचार →
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {recentArticles.map((art) => {
                    const isVid = art.isVideo;
                    const href = isVid && art.videoId ? `/videos/${art.videoId}` : `/samachar/${art._id}`;
                    return (
                      <Link
                        key={art._id}
                        href={href}
                        className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xs hover:shadow-md transition-all group flex flex-col"
                      >
                        <div className="aspect-16/10 bg-gray-100 relative overflow-hidden">
                          {art.imageUrl ? (
                            <img
                              src={art.imageUrl}
                              alt={art.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : art.videoId ? (
                            <img
                              src={`https://img.youtube.com/vi/${art.videoId}/hqdefault.jpg`}
                              alt={art.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <Newspaper size={32} />
                            </div>
                          )}
                          <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                            {art.category || "समाचार"}
                          </span>
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <h4 className="font-bold text-sm sm:text-base text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors mb-2">
                            {art.title}
                          </h4>
                          <div className="flex items-center justify-between text-xs text-gray-400 font-medium pt-2 border-t border-gray-100">
                            <span>{getRelativeTimeNepali(art.createdAt)}</span>
                            <span>{(art.views || 0).toLocaleString()} हेराई</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
