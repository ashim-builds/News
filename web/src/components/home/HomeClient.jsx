"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Clock,
  Eye,
  ChevronRight,
  PlayCircle,
  RefreshCw,
  TrendingUp,
  Newspaper,
  Flame,
  Monitor,
  Users,
  Radio,
  Layers,
} from "lucide-react";
import ProvinceNews from "./ProvinceNews";
import { getRelativeTimeNepali } from "@/lib/dateUtils";

const categoryColors = {
  "मुख्य समाचार": "bg-red-600",
  "समाचार": "bg-blue-600",
  "अर्थ / कृषि": "bg-emerald-600",
  "अपराध": "bg-rose-600",
  "अपराध गतिविधि": "bg-rose-600",
  "सूचना प्रविधि": "bg-indigo-600",
  "समाज": "bg-amber-600",
  "हाम्रो समाजमा": "bg-amber-600",
  "प्रदेश पाना": "bg-purple-600",
  "भिडियो ग्यालरी": "bg-red-700",
  "विशेष": "bg-blue-700",
};

function shuffleArray(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return [];
  const array = [...arr];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function SectionHeading({ title, icon: Icon, href = "#", color = "blue" }) {
  return (
    <div className="flex items-center justify-between border-b-2 border-gray-200 mb-6 pb-2.5">
      <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 flex items-center gap-2.5">
        <div className={`w-2 h-7 rounded-full ${color === "red" ? "bg-red-600" : color === "green" ? "bg-emerald-600" : color === "indigo" ? "bg-indigo-600" : color === "amber" ? "bg-amber-600" : "bg-blue-600"}`} />
        {Icon && <Icon className="w-5 h-5 text-gray-700" />}
        <span>{title}</span>
      </h2>
      <Link
        href={href}
        className="text-xs sm:text-sm font-semibold text-gray-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
      >
        सबै हेर्नुहोस् <ChevronRight size={16} />
      </Link>
    </div>
  );
}

export default function HomeClient({ initialArticles = [], initialVideos = [] }) {
  const [articles, setArticles] = useState(initialArticles);
  const [displayList, setDisplayList] = useState(() => shuffleArray(initialArticles));
  const [isShuffling, setIsShuffling] = useState(false);

  // Fetch published articles on mount if initial list is empty
  useEffect(() => {
    async function fetchAllArticles() {
      if (initialArticles && initialArticles.length > 0) return;
      try {
        const res = await fetch("/api/articles?status=Published&limit=200");
        const data = await res.json();
        if (data.success && Array.isArray(data.articles)) {
          setArticles(data.articles);
          setDisplayList(shuffleArray(data.articles));
        }
      } catch (err) {
        console.error("Error fetching homepage articles:", err);
      }
    }
    fetchAllArticles();
  }, [initialArticles]);

  const handleShuffle = () => {
    setIsShuffling(true);
    setTimeout(() => {
      setDisplayList(shuffleArray(articles));
      setIsShuffling(false);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("home-articles-shuffled"));
      }
    }, 250);
  };

  // Slice articles for different home sections
  const marqueeArticles = displayList.slice(0, 8);
  const heroMain = displayList[0];
  const heroSecondary = displayList.slice(1, 3);
  const heroGrid = displayList.slice(3, 7);
  const latestUpdates = displayList.slice(7, 15);

  // Category specific filter arrays from displayList
  const arthaNews = displayList.filter(
    (a) => a.category === "अर्थ / कृषि" || a.category?.includes("अर्थ") || a.category?.includes("कृषि")
  ).slice(0, 4);

  const techNews = displayList.filter(
    (a) => a.category === "सूचना प्रविधि" || a.category?.includes("प्रविधि")
  ).slice(0, 4);

  const samajNews = displayList.filter(
    (a) => a.category === "समाज" || a.category?.includes("समाज")
  ).slice(0, 4);

  const trendingNews = [...articles].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);

  return (
    <div className="bg-gray-50/60 min-h-screen pb-12">
      <main className="container mx-auto px-4 py-6 overflow-hidden">
        {/* Breaking News Marquee & Shuffle Control */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white border border-gray-200/80 mb-6 rounded-xl shadow-xs overflow-hidden">
          <div className="flex items-center justify-between bg-gradient-to-r from-red-700 to-red-600 text-white px-4 py-2.5 font-extrabold text-xs sm:text-sm tracking-wide shrink-0">
            <span className="flex items-center gap-1.5">
              <Radio size={16} className="animate-pulse" />
              ब्रेकिङ समाचार
            </span>
          </div>

          <div className="overflow-hidden flex-1 px-4 py-2 sm:py-0">
            {marqueeArticles.length > 0 ? (
              <div className="whitespace-nowrap overflow-hidden text-ellipsis flex items-center gap-4 text-xs sm:text-sm font-medium text-gray-800">
                {marqueeArticles.map((art, idx) => (
                  <Link
                    key={art._id || idx}
                    href={`/samachar/${art._id}`}
                    className="hover:text-blue-600 transition-colors inline-flex items-center gap-2 mr-4"
                  >
                    <span>• {art.title}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 italic">ताजा समाचार लोड हुँदैछ...</p>
            )}
          </div>

          {/* Randomize / Shuffle Button */}
          <button
            onClick={handleShuffle}
            disabled={isShuffling}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gray-900 hover:bg-blue-700 text-white text-xs font-extrabold transition-all cursor-pointer border-t sm:border-t-0 sm:border-l border-gray-100 shrink-0"
            title="समाचार फेरबदल (Randomize News)"
          >
            <RefreshCw size={14} className={isShuffling ? "animate-spin" : ""} />
            <span>ताजा फेरबदल</span>
          </button>
        </div>

        {/* Hero Featured Section */}
        <div className={`transition-opacity duration-300 ${isShuffling ? "opacity-40" : "opacity-100"}`}>
          {heroMain ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
              {/* Main Featured Left */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                <Link
                  href={`/samachar/${heroMain._id || heroMain.id}`}
                  className="group bg-white rounded-2xl shadow-xs overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200/80 flex flex-col"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                    {heroMain.imageUrl ? (
                      <img
                        src={heroMain.imageUrl}
                        alt={heroMain.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium text-sm bg-gradient-to-br from-gray-100 to-gray-200">
                        तस्वीर उपलब्ध छैन
                      </div>
                    )}
                    <div
                      className={`absolute top-4 left-4 ${
                        categoryColors[heroMain.category] || "bg-blue-600"
                      } text-white text-xs font-bold px-3 py-1 rounded-full shadow-md backdrop-blur-xs`}
                    >
                      {heroMain.category || "विशेष समाचार"}
                    </div>
                    {heroMain.views > 0 && (
                      <div className="absolute bottom-3 right-3 bg-black/65 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-medium backdrop-blur-xs">
                        <Eye size={12} />
                        {heroMain.views.toLocaleString()}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 group-hover:text-blue-600 transition-colors mb-3 leading-tight">
                      {heroMain.title}
                    </h1>
                    {heroMain.summary && (
                      <p className="text-gray-600 text-sm sm:text-base line-clamp-2 leading-relaxed mb-4">
                        {heroMain.summary}
                      </p>
                    )}
                    <div className="flex items-center text-xs text-gray-400 gap-4 pt-3 border-t border-gray-100 font-medium">
                      <span className="flex items-center gap-1 font-medium">
                        <Clock size={13} className="text-blue-600" />
                        {getRelativeTimeNepali(heroMain.createdAt)}
                      </span>
                      {heroMain.author && <span>लेखक: {heroMain.author}</span>}
                    </div>
                  </div>
                </Link>

                {/* Hero Grid 4 Cards */}
                {heroGrid.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {heroGrid.map((item) => (
                      <Link
                        key={item._id}
                        href={`/samachar/${item._id}`}
                        className="group bg-white rounded-xl shadow-xs overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200/80 flex flex-col justify-between"
                      >
                        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-medium">
                              तस्वीर उपलब्ध छैन
                            </div>
                          )}
                          <div
                            className={`absolute top-2.5 left-2.5 ${
                              categoryColors[item.category] || "bg-blue-600"
                            } text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs`}
                          >
                            {item.category || "समाचार"}
                          </div>
                        </div>
                        <div className="p-4 flex flex-col flex-1">
                          <h3 className="font-bold text-gray-900 text-sm sm:text-base group-hover:text-blue-600 transition-colors line-clamp-2 mb-2 leading-snug flex-1">
                            {item.title}
                          </h3>
                          <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-gray-100 mt-auto">
                            <span className="flex items-center gap-1 font-medium">
                              <Clock size={12} className="text-blue-500" />
                              {getRelativeTimeNepali(item.createdAt)}
                            </span>
                            <span className="text-blue-600 font-semibold">पढ्नुहोस् →</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Secondary Spotlight Right Side */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                {/* Secondary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                  {heroSecondary.map((post) => (
                    <Link
                      key={post._id}
                      href={`/samachar/${post._id}`}
                      className="group bg-white rounded-xl shadow-xs overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200/80"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                        {post.imageUrl ? (
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-medium">
                            तस्वीर उपलब्ध छैन
                          </div>
                        )}
                        <div
                          className={`absolute top-2.5 left-2.5 ${
                            categoryColors[post.category] || "bg-blue-600"
                          } text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs`}
                        >
                          {post.category || "समाचार"}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2 leading-snug">
                          {post.title}
                        </h3>
                        <div className="flex items-center text-[11px] text-gray-400 gap-1 pt-2 border-t border-gray-100 font-medium">
                          <Clock size={12} className="text-blue-500" />
                          {getRelativeTimeNepali(post.createdAt)}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Trending Feed */}
                {trendingNews.length > 0 && (
                  <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-200/80">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                      <h3 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
                        <Flame className="text-red-600 w-5 h-5 animate-bounce" />
                        <span>लोकप्रिय तथा चर्चित</span>
                      </h3>
                      <span className="text-xs text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded-full">Top 5</span>
                    </div>

                    <div className="flex flex-col gap-3.5 divide-y divide-gray-100">
                      {trendingNews.map((art, i) => (
                        <Link
                          key={art._id || i}
                          href={`/samachar/${art._id}`}
                          className="group pt-2.5 first:pt-0 flex items-start gap-3"
                        >
                          <span className="w-6 h-6 rounded-full bg-red-50 text-red-600 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <div className="flex-1">
                            <h4 className="text-xs sm:text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                              {art.title}
                            </h4>
                            <div className="flex items-center gap-3 text-[10px] text-gray-400 mt-1">
                              <span>{art.category || "समाचार"}</span>
                              {art.views > 0 && (
                                <span className="flex items-center gap-0.5">
                                  <Eye size={10} /> {art.views}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-16 text-center text-gray-400 border border-gray-200 my-8">
              <Newspaper size={48} className="mx-auto mb-3 opacity-30 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-800 mb-1">कुनै समाचार उपलब्ध छैन</h3>
              <p className="text-xs text-gray-500">अहिलेसम्म प्रणालीमा कुनै पनि समाचार प्रकाशित गरिएको छैन।</p>
            </div>
          )}

          {/* Video Section from DB if available */}
          {initialVideos.length > 0 && (
            <section className="mb-10 bg-gray-900 text-white p-6 rounded-2xl shadow-lg border border-gray-800">
              <div className="flex items-center justify-between border-b border-gray-800 mb-6 pb-3">
                <h2 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2.5">
                  <PlayCircle className="text-red-500 w-6 h-6 animate-pulse" />
                  <span>भिडियो समाचार</span>
                </h2>
                <Link
                  href="/videos"
                  className="text-xs sm:text-sm font-semibold text-gray-300 hover:text-white flex items-center gap-1 transition-colors"
                >
                  सबै भिडियोहरू <ChevronRight size={16} />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {initialVideos.map((vid, idx) => (
                  <Link
                    key={vid.id || idx}
                    href={`/videos/${vid.id}`}
                    className="group relative bg-gray-800 rounded-xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col border border-gray-700/60"
                  >
                    <div className="relative aspect-video bg-black overflow-hidden">
                      <img
                        src={`https://img.youtube.com/vi/${vid.id}/hqdefault.jpg`}
                        alt={vid.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-red-600/40 transition-colors">
                        <PlayCircle className="w-10 h-10 text-white group-hover:scale-110 transition-transform" />
                      </div>
                    </div>
                    <div className="p-3">
                      <h4 className="text-xs sm:text-sm font-bold text-gray-100 group-hover:text-red-400 transition-colors line-clamp-2 leading-snug">
                        {vid.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Artha / Economy Section */}
          {arthaNews.length > 0 && (
            <section className="mb-10">
              <SectionHeading title="अर्थ / कृषि समाचार" icon={TrendingUp} href="/artha" color="green" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {arthaNews.map((news) => (
                  <Link
                    key={news._id}
                    href={`/samachar/${news._id}`}
                    className="group bg-white rounded-xl shadow-xs overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col border border-gray-200/80"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                      {news.imageUrl ? (
                        <img
                          src={news.imageUrl}
                          alt={news.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          तस्वीर उपलब्ध छैन
                        </div>
                      )}
                      <div className="absolute top-2 left-2 bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                        {news.category || "अर्थ / कृषि"}
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2 mb-2 text-sm leading-snug flex-1">
                        {news.title}
                      </h3>
                      <div className="flex items-center text-[11px] text-gray-400 pt-2 border-t border-gray-100 mt-auto font-medium">
                        <Clock size={12} className="text-emerald-600" />
                        <span className="ml-1">
                          {getRelativeTimeNepali(news.createdAt)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Interactive Province News Section */}
          <ProvinceNews />

          {/* Technology & Society Grid Split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {/* Tech News */}
            {techNews.length > 0 && (
              <div>
                <SectionHeading title="सूचना प्रविधि" icon={Monitor} href="/it" color="indigo" />
                <div className="flex flex-col gap-3">
                  {techNews.map((news) => (
                    <Link
                      key={news._id}
                      href={`/samachar/${news._id}`}
                      className="group bg-white rounded-xl p-3 shadow-xs hover:shadow-md border border-gray-200/80 flex gap-3.5 transition-all"
                    >
                      <div className="relative w-24 sm:w-32 aspect-[16/10] shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        {news.imageUrl ? (
                          <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">तस्वीर छैन</div>
                        )}
                      </div>
                      <div className="flex flex-col justify-between flex-1 py-0.5">
                        <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 text-xs sm:text-sm leading-snug">
                          {news.title}
                        </h4>
                        <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-1 font-medium">
                          <Clock size={11} className="text-indigo-500" />
                          {getRelativeTimeNepali(news.createdAt)}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Society News */}
            {samajNews.length > 0 && (
              <div>
                <SectionHeading title="हाम्रो समाज" icon={Users} href="/samaj" color="amber" />
                <div className="flex flex-col gap-3">
                  {samajNews.map((news) => (
                    <Link
                      key={news._id}
                      href={`/samachar/${news._id}`}
                      className="group bg-white rounded-xl p-3 shadow-xs hover:shadow-md border border-gray-200/80 flex gap-3.5 transition-all"
                    >
                      <div className="relative w-24 sm:w-32 aspect-[16/10] shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        {news.imageUrl ? (
                          <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">तस्वीर छैन</div>
                        )}
                      </div>
                      <div className="flex flex-col justify-between flex-1 py-0.5">
                        <h4 className="font-bold text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-2 text-xs sm:text-sm leading-snug">
                          {news.title}
                        </h4>
                        <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-1 font-medium">
                          <Clock size={11} className="text-amber-500" />
                          {getRelativeTimeNepali(news.createdAt)}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Latest Articles Full Grid */}
          {latestUpdates.length > 0 && (
            <section className="mb-8">
              <SectionHeading title="अझ धेरै समाचारहरू" icon={Layers} href="/samachar" color="blue" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {latestUpdates.map((art) => (
                  <Link
                    key={art._id}
                    href={`/samachar/${art._id}`}
                    className="group bg-white rounded-xl shadow-xs overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200/80 flex flex-col"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                      {art.imageUrl ? (
                        <img
                          src={art.imageUrl}
                          alt={art.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          तस्वीर उपलब्ध छैन
                        </div>
                      )}
                      <div
                        className={`absolute top-2 left-2 ${
                          categoryColors[art.category] || "bg-blue-600"
                        } text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs`}
                      >
                        {art.category || "समाचार"}
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2 text-sm leading-snug flex-1">
                        {art.title}
                      </h3>
                      <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-gray-100 mt-auto">
                        <span className="flex items-center gap-1 font-medium">
                          <Clock size={12} className="text-blue-500" />
                          {getRelativeTimeNepali(art.createdAt)}
                        </span>
                        <span className="text-blue-600 font-semibold">पढ्नुहोस् →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
