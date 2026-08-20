"use client";

import { useState, useEffect } from "react";
import {
  X,
  Clock,
  Eye,
  User,
  Share2,
  Bookmark,
  ChevronRight,
  Sparkles,
  Newspaper,
} from "lucide-react";

export default function NewsDetailModal({ article, isOpen, onClose, onSelectArticle }) {
  const [currentArticle, setCurrentArticle] = useState(article);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setCurrentArticle(article));
  }, [article]);

  // Fetch random latest suggested news from MongoDB
  useEffect(() => {
    if (!isOpen) return;

    async function fetchSuggestions() {
      setIsLoadingSuggestions(true);
      try {
        const res = await fetch("/api/articles?status=Published");
        const data = await res.json();
        if (data.success && Array.isArray(data.articles)) {
          // Filter out current article and video gallery
          const filtered = data.articles.filter(
            (a) => a._id !== currentArticle?._id && a.category !== "भिडियो ग्यालरी"
          );
          // Shuffle array to get random latest news
          const shuffled = [...filtered].sort(() => 0.5 - Math.random());
          setSuggestions(shuffled.slice(0, 4));
        }
      } catch (err) {
        console.error("Error fetching news suggestions:", err);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }

    fetchSuggestions();
  }, [isOpen, currentArticle]);

  // Handle escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !currentArticle) return null;

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSelectSuggestion = (news) => {
    setCurrentArticle(news);
    if (onSelectArticle) {
      onSelectArticle(news);
    }
    // Scroll modal body to top
    const modalBody = document.getElementById("news-modal-body");
    if (modalBody) {
      modalBody.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-gray-200 relative animate-in zoom-in-95 duration-200 font-sans">
        
        {/* Sticky Modal Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-white shrink-0 z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-red-600 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-md shadow-xs uppercase tracking-wider">
              {currentArticle.category || "समाचार"}
            </span>
            {currentArticle.province && (
              <span className="bg-gray-100 text-gray-700 text-[11px] font-bold px-2.5 py-1 rounded-md border border-gray-200">
                {currentArticle.province}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-xs font-bold flex items-center gap-1.5"
              title="Share Link"
            >
              <Share2 size={16} />
              <span className="hidden sm:inline">{copied ? "कपि भयो!" : "शेयर"}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
              title="Close (Esc)"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div id="news-modal-body" className="p-4 sm:p-8 overflow-y-auto space-y-6 flex-1 bg-white">
          
          {/* Article Title */}
          <h1 className="text-xl sm:text-3xl font-extrabold text-gray-900 leading-snug sm:leading-tight">
            {currentArticle.title}
          </h1>

          {/* Article Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-gray-100 text-xs text-gray-500 font-medium">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-semibold text-gray-800">
                <User size={14} className="text-red-600" />
                {currentArticle.author || "स्मार्ट सञ्चार संवाददाता"}
              </span>
              <span className="flex items-center gap-1 text-gray-400">
                <Clock size={13} />
                {currentArticle.createdAt ? new Date(currentArticle.createdAt).toLocaleDateString("ne-NP") : ""}
              </span>
            </div>

            <div className="flex items-center gap-1 bg-gray-100 px-2.5 py-1 rounded-full text-gray-600 font-mono font-bold text-[11px]">
              <Eye size={12} className="text-gray-500" />
              <span>{(currentArticle.views || 0).toLocaleString()} हेराई</span>
            </div>
          </div>

          {/* Article Image Banner */}
          {currentArticle.imageUrl ? (
            <div className="w-full aspect-16/10 rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-100">
              <img
                src={currentArticle.imageUrl}
                alt={currentArticle.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-48 bg-linear-to-r from-red-50 to-gray-100 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 font-bold text-sm">
              <Newspaper size={36} className="text-red-400 opacity-40 mr-2" />
              <span>स्मार्ट सञ्चार समाचार</span>
            </div>
          )}

          {/* Summary Lead Box */}
          {currentArticle.summary && (
            <div className="p-4 sm:p-5 bg-red-50/60 border-l-4 border-red-600 rounded-r-xl text-gray-800 font-semibold text-sm sm:text-base leading-relaxed">
              {currentArticle.summary}
            </div>
          )}

          {/* Full Article Content */}
          <div className="prose prose-sm sm:prose-base max-w-none text-gray-800 leading-relaxed font-normal space-y-4 whitespace-pre-line">
            {currentArticle.content ? (
              currentArticle.content
            ) : (
              <p className="text-gray-500 italic">
                यो समाचारको थप विवरण छिट्टै उपलब्ध गराइनेछ।
              </p>
            )}
          </div>

          {/* ─────────────────────────────────────────────────────────────
              SUGGESTED / RANDOM LATEST NEWS SECTION
             ───────────────────────────────────────────────────────────── */}
          <div className="pt-8 border-t border-gray-200 mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-extrabold text-gray-900 flex items-center gap-2">
                <Sparkles size={18} className="text-red-600" />
                <span>अन्य सिफारिस समाचारहरू (Suggested News)</span>
              </h3>
              <span className="text-xs text-gray-400 font-medium">ताजा अपडेटहरू</span>
            </div>

            {isLoadingSuggestions ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-6">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : suggestions.length === 0 ? (
              <p className="text-xs text-gray-400 py-4">थप समाचारहरू लोड हुँदैछ...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {suggestions.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => handleSelectSuggestion(item)}
                    className="group bg-gray-50 hover:bg-red-50/50 p-3 rounded-xl border border-gray-200 hover:border-red-200 transition-all duration-200 cursor-pointer flex gap-3 items-center"
                  >
                    <div className="w-20 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-200 relative border border-gray-200">
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
                      <h4 className="font-bold text-gray-900 text-xs line-clamp-2 leading-snug group-hover:text-red-600 transition-colors">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-1">
                        <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString("ne-NP") : ""}</span>
                        <span>•</span>
                        <span>{(item.views || 0).toLocaleString()} हेराई</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 shrink-0">
          <div className="flex items-center gap-1.5 font-semibold text-gray-700">
            <Newspaper size={14} className="text-red-600" />
            <span>स्मार्ट सञ्चार डिजिटल पत्रिका</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-900 hover:bg-black text-white font-bold rounded-lg transition-colors cursor-pointer"
          >
            बन्द गर्नुहोस् (Close)
          </button>
        </div>

      </div>
    </div>
  );
}
