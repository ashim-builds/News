"use client";

import { useState, useEffect } from "react";
import {
  LayoutGrid,
  List,
  Clock,
  Eye,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Wheat,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { getRelativeTimeNepali } from "@/lib/dateUtils";

const ITEMS_PER_PAGE = 12;

const categoryColors = {
  बजार: "bg-amber-600",
  बैंकिङ: "bg-blue-600",
  कृषि: "bg-emerald-600",
  "अर्थ / कृषि": "bg-emerald-700",
  शेयर: "bg-purple-600",
  व्यापार: "bg-teal-600",
  ऊर्जा: "bg-orange-600",
  अन्तर्राष्ट्रिय: "bg-indigo-600",
};

function NewsCardGrid({ news }) {
  return (
    <Link
      href={`/samachar/${news._id || news.id}`}
      className="group bg-white rounded-xl shadow-xs overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col border border-gray-100/80"
    >
      <div className="relative overflow-hidden aspect-[16/10] shrink-0 bg-gray-100">
        {news.imageUrl ? (
          <img
            src={news.imageUrl}
            alt={news.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-medium bg-gradient-to-br from-gray-50 to-gray-200">
            तस्वीर उपलब्ध छैन
          </div>
        )}
        <div
          className={`absolute top-2.5 left-2.5 ${
            categoryColors[news.category] || "bg-emerald-700"
          } text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md backdrop-blur-xs`}
        >
          {news.category || "अर्थ / कृषि"}
        </div>
        <div className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
          <Eye size={11} />
          {(news.views || 0).toLocaleString()}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1 bg-white">
        <h3 className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2 mb-2 text-sm sm:text-base leading-snug flex-1">
          {news.title}
        </h3>
        {news.summary && (
          <p className="text-gray-500 text-xs line-clamp-2 mb-3 leading-relaxed">
            {news.summary}
          </p>
        )}
        <div className="flex items-center justify-between text-[11px] text-gray-400 mt-auto pt-2.5 border-t border-gray-100">
          <span className="flex items-center gap-1 font-medium">
            <Clock size={12} className="text-emerald-600" />
            {getRelativeTimeNepali(news.createdAt)}
          </span>
          <span className="text-emerald-700 font-semibold text-[11px] group-hover:underline flex items-center gap-0.5">
            पढ्नुहोस् →
          </span>
        </div>
      </div>
    </Link>
  );
}

function NewsCardList({ news }) {
  return (
    <Link
      href={`/samachar/${news._id || news.id}`}
      className="group bg-white rounded-xl shadow-xs overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex gap-3 sm:gap-4 p-3.5 border border-gray-100"
    >
      <div className="relative overflow-hidden w-32 sm:w-44 md:w-52 shrink-0 rounded-lg bg-gray-100 aspect-[16/10]">
        {news.imageUrl ? (
          <img
            src={news.imageUrl}
            alt={news.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-medium bg-gradient-to-br from-gray-50 to-gray-200">
            तस्वीर उपलब्ध छैन
          </div>
        )}
        <div
          className={`absolute top-2 left-2 ${
            categoryColors[news.category] || "bg-emerald-700"
          } text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs`}
        >
          {news.category || "अर्थ / कृषि"}
        </div>
      </div>

      <div className="flex flex-col justify-between flex-1 py-0.5">
        <div>
          <h3 className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2 text-sm sm:text-base leading-snug mb-1.5">
            {news.title}
          </h3>
          {news.summary && (
            <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed hidden sm:block">
              {news.summary}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between text-[11px] text-gray-400 mt-2 pt-2 border-t border-gray-50">
          <span className="flex items-center gap-1 font-medium">
            <Clock size={12} className="text-emerald-600" />
            {getRelativeTimeNepali(news.createdAt)}
          </span>
          <span className="flex items-center gap-1 font-medium">
            <Eye size={12} />
            {(news.views || 0).toLocaleString()}
          </span>
        </div>
      </div>
    </Link>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex items-center justify-center gap-1.5 mt-10 flex-wrap">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
      >
        <ChevronLeft size={16} />
        <span>अघिल्लो</span>
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-9 h-9 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            page === currentPage
              ? "bg-gradient-to-r from-emerald-700 to-green-600 text-white shadow-md scale-105"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
      >
        <span>पछिल्लो</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

export default function ArthaClient() {
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchArthaArticles() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/articles?status=Published");
        const data = await res.json();
        if (data.success && Array.isArray(data.articles)) {
          const arthaNews = data.articles.filter((a) => {
            if (a.category === "भिडियो ग्यालरी") return false;
            return (
              a.category === "अर्थ / कृषि" ||
              a.category?.includes("अर्थ") ||
              a.category?.includes("कृषि") ||
              a.category?.includes("बजार") ||
              a.category?.includes("बैंकिङ") ||
              a.category?.includes("शेयर") ||
              a.category?.includes("व्यापार") ||
              a.category?.includes("ऊर्जा")
            );
          });
          setArticles(arthaNews);
        }
      } catch (err) {
        console.error("Error fetching artha news:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchArthaArticles();
  }, []);

  const totalPages = Math.max(1, Math.ceil(articles.length / ITEMS_PER_PAGE));
  const paginated = articles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="bg-gray-50/50 min-h-screen pb-12">
      {/* Page Header Banner */}
      <div className="w-full bg-gradient-to-r from-emerald-900 via-green-800 to-teal-800 py-8 px-4 relative overflow-hidden shadow-sm">
        {/* Background Decorative Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent_70%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-200 mb-2">
            <Link href="/" className="hover:text-white transition flex items-center gap-1">
              गृह
            </Link>
            <ChevronRight size={14} className="text-emerald-400" />
            <span className="text-white font-semibold">अर्थ / कृषि</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
                <span className="p-2 bg-emerald-700/60 rounded-xl backdrop-blur-md border border-emerald-500/30">
                  <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-300" />
                </span>
                <span>अर्थ / कृषि समाचार</span>
              </h1>
              <p className="text-emerald-100/90 text-xs sm:text-sm mt-2 max-w-xl">
                बजार भाउ, बैंकिङ, कृषि र अन्तर्राष्ट्रिय अर्थतन्त्रका ताजा तथा आधिकारिक समाचारहरू
              </p>
            </div>
            {articles.length > 0 && (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-2.5 text-center text-white shrink-0 self-start sm:self-center shadow-inner">
                <span className="block text-xl font-extrabold">{articles.length}</span>
                <span className="text-[11px] text-emerald-200 uppercase tracking-wider font-medium">कुल समाचार</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header & Controls Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200/80">
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-6 bg-emerald-600 rounded-full" />
            <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
              <span>ताजा अपडेटहरू</span>
              <Sparkles size={16} className="text-emerald-600" />
            </h2>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-xs">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-emerald-700 text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <LayoutGrid size={14} /> Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === "list"
                  ? "bg-emerald-700 text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <List size={14} /> List
            </button>
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="py-28 text-center text-gray-400 bg-white rounded-2xl border border-gray-100 shadow-xs">
            <RefreshCw size={36} className="animate-spin mx-auto mb-3 text-emerald-600" />
            <p className="text-sm font-semibold text-gray-700">अर्थ / कृषि समाचार लोड हुँदैछ...</p>
          </div>
        ) : paginated.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center text-gray-400 max-w-lg mx-auto my-12 shadow-xs">
            <Wheat size={48} className="mx-auto mb-3 opacity-40 text-emerald-700" />
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              कुनै अर्थ / कृषि समाचार उपलब्ध छैन
            </h3>
            <p className="text-xs text-gray-500">
              अहिलेसम्म यो क्याटगोरीमा कुनै पनि समाचार सामग्री अपलोड गरिएको छैन।
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {paginated.map((news) => (
              <NewsCardGrid key={news._id || news.id} news={news} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {paginated.map((news) => (
              <NewsCardList key={news._id || news.id} news={news} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => {
              setCurrentPage(p);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}
      </div>
    </div>
  );
}
