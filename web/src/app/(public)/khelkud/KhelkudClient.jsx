"use client";

import { useState, useEffect, useMemo } from "react";
import {
  LayoutGrid,
  List,
  Clock,
  Eye,
  ChevronLeft,
  ChevronRight,
  Trophy,
  RefreshCw,
  Search,
  Sparkles,
  Flame,
} from "lucide-react";
import Link from "next/link";
import { getRelativeTimeNepali } from "@/lib/dateUtils";

const ITEMS_PER_PAGE = 12;

const SPORTS_FILTERS = [
  "सबै खेल",
  "क्रिकेट",
  "फुटबल",
  "भलिबल",
  "अन्तर्राष्ट्रिय",
  "घरेलु खेल",
];

function SportsCardGrid({ news }) {
  return (
    <Link
      href={`/samachar/${news._id || news.id}`}
      className="group bg-white rounded-2xl shadow-xs overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col border border-gray-100/90"
    >
      <div className="relative overflow-hidden aspect-16/10 shrink-0 bg-gray-100">
        {news.imageUrl ? (
          <img
            src={news.imageUrl}
            alt={news.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 text-xs font-medium bg-gradient-to-br from-emerald-50 to-teal-100">
            <Trophy className="w-8 h-8 text-emerald-400/70 mb-1" />
            <span>खेलकुद तस्वीर</span>
          </div>
        )}
        <div className="absolute top-2.5 left-2.5 bg-emerald-600/90 backdrop-blur-xs text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md">
          {news.category || "खेलकुद"}
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

function SportsCardList({ news }) {
  return (
    <Link
      href={`/samachar/${news._id || news.id}`}
      className="group bg-white rounded-2xl shadow-xs overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex gap-3 sm:gap-4 p-3.5 border border-gray-100"
    >
      <div className="relative overflow-hidden w-32 sm:w-44 md:w-52 shrink-0 rounded-xl bg-gray-100 aspect-16/10">
        {news.imageUrl ? (
          <img
            src={news.imageUrl}
            alt={news.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 text-xs font-medium bg-gradient-to-br from-emerald-50 to-teal-100">
            <Trophy className="w-6 h-6 text-emerald-400/70" />
          </div>
        )}
        <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
          {news.category || "खेलकुद"}
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
              ? "bg-gradient-to-r from-emerald-700 to-teal-600 text-white shadow-md scale-105"
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

export default function KhelkudClient({ initialSportsNews = [] }) {
  const [articles, setArticles] = useState(initialSportsNews);
  const [isLoading, setIsLoading] = useState(initialSportsNews.length === 0);
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubFilter, setSelectedSubFilter] = useState("सबै खेल");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch or refresh sports news
  const fetchSportsNews = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/articles?status=Published&category=खेलकुद");
      const data = await res.json();
      if (data.success && Array.isArray(data.articles)) {
        setArticles(data.articles);
      }
    } catch (err) {
      console.error("Error fetching sports articles:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialSportsNews.length === 0) {
      queueMicrotask(() => {
        fetchSportsNews();
      });
    }
  }, [initialSportsNews]);

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const title = art.title || "";
      const summary = art.summary || "";
      const content = art.content || "";
      const category = art.category || "";

      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          title.toLowerCase().includes(q) ||
          summary.toLowerCase().includes(q) ||
          content.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // Sub-filter
      if (selectedSubFilter !== "सबै खेल") {
        const matchesSub =
          title.includes(selectedSubFilter) ||
          summary.includes(selectedSubFilter) ||
          category.includes(selectedSubFilter);
        if (!matchesSub) return false;
      }

      return true;
    });
  }, [articles, searchQuery, selectedSubFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / ITEMS_PER_PAGE));
  const paginated = filteredArticles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="bg-gray-50/50 min-h-screen pb-16">
      {/* Dynamic Header Banner */}
      <div className="w-full bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-800 py-10 px-4 relative overflow-hidden shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(52,211,153,0.15),transparent_60%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-200 mb-3">
            <Link href="/" className="hover:text-white transition flex items-center gap-1 font-medium">
              गृह
            </Link>
            <ChevronRight size={14} className="text-emerald-400" />
            <span className="text-white font-semibold">खेलकुद</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
                <span className="p-2.5 bg-emerald-800/80 rounded-2xl backdrop-blur-md border border-emerald-500/30 shadow-inner">
                  <Trophy className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-300" />
                </span>
                <span>खेलकुद समाचार (Sports Hub)</span>
              </h1>
              <p className="text-emerald-100/90 text-xs sm:text-sm mt-2 max-w-xl leading-relaxed">
                नेपाल तथा विश्वभरका ताजा खेलकुद गतिविधि, खेल परिणाम, खेलाडी प्रोफाइल र विश्लेषणहरू
              </p>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-center">
              {articles.length > 0 && (
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-2 text-center text-white shrink-0 shadow-inner">
                  <span className="block text-xl font-extrabold">{articles.length}</span>
                  <span className="text-[10px] text-emerald-200 uppercase tracking-wider font-semibold">कुल खेल समाचार</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Controls Toolbar: Search, Filter Pills & View Mode */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-200/80 mb-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Sub-Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {SPORTS_FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setSelectedSubFilter(filter);
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedSubFilter === filter
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-emerald-700"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Right: Search & View Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-60">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="खेलकुद समाचार खोज्नुहोस्..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-all text-gray-800"
              />
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            {/* View Mode Buttons */}
            <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200/80">
              <button
                onClick={() => setViewMode("grid")}
                aria-label="Grid View"
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white text-emerald-700 shadow-2xs font-bold"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                aria-label="List View"
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === "list"
                    ? "bg-white text-emerald-700 shadow-2xs font-bold"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <List size={16} />
              </button>
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchSportsNews}
              disabled={isLoading}
              title="Refresh"
              className="p-2 text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition cursor-pointer"
            >
              <RefreshCw size={16} className={isLoading ? "animate-spin text-emerald-600" : ""} />
            </button>
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="py-20 text-center text-gray-400">
            <RefreshCw size={36} className="animate-spin mx-auto text-emerald-600 mb-3" />
            <p className="text-sm font-semibold text-gray-700">खेलकुद समाचार लोड हुँदैछ...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-emerald-200 p-16 text-center max-w-lg mx-auto my-6 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-4 text-emerald-600">
              <Trophy size={32} />
            </div>
            <h3 className="text-lg font-extrabold text-gray-900 mb-1">
              कुनै खेलकुद समाचार उपलब्ध छैन
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-6">
              {searchQuery
                ? "तपाईंले खोज्नुभएको शब्दसँग मिल्ने कुनै खेलकुद समाचार भेटिएन।"
                : "अहिलेसम्म खेलकुद वर्गमा कुनै पनि समाचार प्रकाशित गरिएको छैन।"}
            </p>
            <Link
              href="/samachar"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition shadow-xs"
            >
              <span>सबै समाचारहरू हेर्नुहोस्</span>
            </Link>
          </div>
        ) : (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginated.map((news) => (
                  <SportsCardGrid key={news._id} news={news} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {paginated.map((news) => (
                  <SportsCardList key={news._id} news={news} />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 300, behavior: "smooth" });
                }}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
