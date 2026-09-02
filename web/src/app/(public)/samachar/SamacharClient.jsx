"use client";

import { useState, useEffect } from "react";
import {
  LayoutGrid,
  List,
  Clock,
  Eye,
  ChevronLeft,
  ChevronRight,
  Inbox,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { getRelativeTimeNepali } from "@/lib/dateUtils";

const CATEGORIES = [
  "सबै",
  "समाचार",
  "मुख्य समाचार",
  "खेलकुद",
  "प्रदेश पाना",
  "अर्थ / कृषि",
  "अपराध गतिविधि",
  "सूचना प्रविधि",
  "हाम्रो समाजमा",
];

const ITEMS_PER_PAGE = 8;

const categoryColors = {
  "समाचार": "bg-blue-600",
  "मुख्य समाचार": "bg-red-600",
  "खेलकुद": "bg-emerald-600",
  "प्रदेश पाना": "bg-emerald-600",
  "अर्थ / कृषि": "bg-orange-500",
  "अपराध गतिविधि": "bg-gray-800",
  "सूचना प्रविधि": "bg-purple-600",
  "हाम्रो समाजमा": "bg-teal-600",
};

function NewsCardGrid({ news }) {
  return (
    <Link
      href={`/samachar/${news._id}`}
      className="group bg-white rounded-lg shadow-xs overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col border border-gray-200"
    >
      <div className="relative overflow-hidden aspect-16/10 shrink-0 bg-gray-100">
        {news.imageUrl ? (
          <img
            src={news.imageUrl}
            alt={news.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
            नो इमेज
          </div>
        )}
        <div
          className={`absolute top-2 left-2 ${categoryColors[news.category] || "bg-blue-600"} text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs`}
        >
          {news.category}
        </div>
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1">
          <Eye size={10} />
          {(news.views || 0).toLocaleString()}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 mb-2 text-sm leading-snug flex-1">
          {news.title}
        </h3>
        <div className="flex items-center justify-between text-[11px] text-gray-400 mt-auto pt-2 border-t border-gray-100">
          <span className="flex items-center gap-1 font-medium">
            <Clock size={11} />
            {getRelativeTimeNepali(news.createdAt)}
          </span>
          <span className="text-gray-500 font-medium">{news.author || "संवाददाता"}</span>
        </div>
      </div>
    </Link>
  );
}

function NewsCardList({ news }) {
  return (
    <Link
      href={`/samachar/${news._id}`}
      className="group bg-white rounded-lg shadow-xs overflow-hidden hover:shadow-md transition-all duration-300 flex gap-3 sm:gap-4 p-3 border border-gray-200"
    >
      <div className="relative overflow-hidden w-28 sm:w-36 md:w-44 shrink-0 rounded-md bg-gray-100">
        {news.imageUrl ? (
          <img
            src={news.imageUrl}
            alt={news.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 aspect-16/10"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
            नो इमेज
          </div>
        )}
        <div
          className={`absolute top-1.5 left-1.5 ${categoryColors[news.category] || "bg-blue-600"} text-white text-[9px] font-bold px-1.5 py-0.5 rounded`}
        >
          {news.category}
        </div>
      </div>
      <div className="flex flex-col justify-between flex-1 py-0.5">
        <div>
          <h3 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 text-sm leading-snug mb-1.5">
            {news.title}
          </h3>
          <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed hidden sm:block">
            {news.summary || news.content}
          </p>
        </div>
        <div className="flex items-center justify-between text-[11px] text-gray-400 mt-2">
          <span className="flex items-center gap-1 font-medium">
            <Clock size={11} />
            {getRelativeTimeNepali(news.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            <Eye size={11} />
            {(news.views || 0).toLocaleString()}
          </span>
        </div>
      </div>
    </Link>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mt-8 flex-wrap">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
      >
        <ChevronLeft size={16} />
        <span className="hidden sm:inline">पछाडि</span>
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-9 h-9 rounded-lg text-sm font-bold transition cursor-pointer ${
            page === currentPage
              ? "bg-red-600 text-white shadow-2xs"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
      >
        <span className="hidden sm:inline">अगाडि</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

export default function SamacharPage() {
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("सबै");
  const [currentPage, setCurrentPage] = useState(1);

  // Dynamic MongoDB News State
  const [dbNews, setDbNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDynamicNews() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/articles?status=Published");
        const data = await res.json();
        if (data.success && Array.isArray(data.articles)) {
          setDbNews(data.articles.filter(a => a.category !== "भिडियो ग्यालरी"));
        }
      } catch (err) {
        console.error("Error fetching dynamic news:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDynamicNews();
  }, []);

  const filtered =
    selectedCategory === "सबै"
      ? dbNews
      : dbNews.filter((n) => n.category && n.category.includes(selectedCategory));

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  return (
    <div>
      {/* Page Header Banner */}
      <div className="w-full bg-gradient-to-r from-red-900 via-red-800 to-red-600 py-8 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-red-200 mb-2 font-medium">
            <Link href="/" className="hover:text-white transition">
              गृह
            </Link>
            <ChevronRight size={12} />
            <span className="text-white font-bold">समाचार</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            समाचार ग्यालरी
          </h1>
          <p className="text-red-100 text-xs sm:text-sm mt-1">
            ताजा, निष्पक्ष र भरपर्दो समाचार अपडेटहरू
          </p>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-1.5 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-red-600 text-white shadow-xs"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-red-300 hover:text-red-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shrink-0 self-start md:self-auto shadow-2xs">
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === "list"
                  ? "bg-red-600 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <List size={14} /> List
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition cursor-pointer ${
                viewMode === "grid"
                  ? "bg-red-600 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <LayoutGrid size={14} /> Grid
            </button>
          </div>
        </div>

        {/* Section Label */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-1.5 h-6 bg-red-600 rounded-full" />
          <h2 className="text-lg font-bold text-gray-900">
            {selectedCategory === "सबै" ? "सबै प्रकाशित समाचारहरू" : selectedCategory}
            <span className="ml-2 text-xs font-semibold text-gray-400">
              ({filtered.length} समाचार)
            </span>
          </h2>
        </div>

        {/* News Items Content / Loading / Empty Container */}
        {isLoading ? (
          <div className="py-20 text-center text-gray-400">
            <RefreshCw className="animate-spin mx-auto mb-2 text-red-600" size={28} />
            <p className="text-xs font-medium">समाचारहरू लोड हुँदैछ...</p>
          </div>
        ) : paginated.length === 0 ? (
          <div className="py-20 px-4 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 my-4 max-w-xl mx-auto">
            <Inbox className="mx-auto text-gray-400 mb-3" size={48} />
            <h3 className="text-base font-bold text-gray-800 mb-1">
              यस वर्गमा कुनै समाचार उपलब्ध छैन
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              प्रशासकले सामग्री अपलोड गरेपछि समाचारहरू यहाँ प्रदर्शित हुनेछन्।
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {paginated.map((news) => (
              <NewsCardGrid key={news._id} news={news} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {paginated.map((news) => (
              <NewsCardList key={news._id} news={news} />
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
