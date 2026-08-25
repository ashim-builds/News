"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, TrendingUp } from "lucide-react";
import NepaliDate from "nepali-date-converter";
import Link from "next/link";

function NepaliClock() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const toNepali = (n) =>
        String(n)
          .split("")
          .map((d) => "०१२३४५६७८९"[+d])
          .join("");

      const h = toNepali(String(now.getHours()).padStart(2, "0"));
      const m = toNepali(String(now.getMinutes()).padStart(2, "0"));
      const s = toNepali(String(now.getSeconds()).padStart(2, "0"));
      setTime(`${h} : ${m} : ${s}`);

      // Set real-time Nepali date and strip any trailing digits that the library might append
      const formattedDate = new NepaliDate().format("YYYY MMMM DD, dddd", "np");
      setDate(formattedDate.replace(/[०-९0-9]+$/, ""));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="flex items-center gap-1.5 text-base text-gray-900 font-bold">
      <Calendar size={18} className="text-blue-700" />
      <span>{date}</span>
      <span className="mx-2 text-gray-300 font-normal">|</span>
      <Clock size={18} className="text-blue-700" />
      <span className="font-mono tracking-wider">{time}</span>
    </span>
  );
}

export default function TopBar() {
  const [trendingArticles, setTrendingArticles] = useState([]);

  useEffect(() => {
    async function fetchTrending() {
      try {
        const res = await fetch("/api/articles?status=Published&limit=50");
        if (!res.ok) return;
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) return;
        const data = await res.json();
        if (data.success && Array.isArray(data.articles) && data.articles.length > 0) {
          // Shuffle published articles to match randomized home data
          const shuffled = [...data.articles].sort(() => 0.5 - Math.random());
          setTrendingArticles(shuffled);
        }
      } catch (err) {
        console.error("Error fetching trending articles for TopBar:", err);
      }
    }

    fetchTrending();

    // Listen for custom home shuffle event
    const handleCustomShuffle = () => {
      fetchTrending();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("home-articles-shuffled", handleCustomShuffle);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("home-articles-shuffled", handleCustomShuffle);
      }
    };
  }, []);

  return (
    <div className="w-full bg-gray-100 border-b border-gray-200">
      <div className="container mx-auto flex items-center justify-between min-h-9 py-1 px-4 gap-3">
        {/* Left: Date & Clock */}
        <div className="shrink-0 hidden sm:block">
          <NepaliClock />
        </div>

        {/* Center: Scrolling trending ticker */}
        <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
          <span className="shrink-0 flex items-center gap-1 bg-red-600 text-white text-xs font-bold px-2.5 py-0.5 rounded">
            <TrendingUp size={14} /> ट्रेन्डिङ
          </span>
          <div className="overflow-hidden flex-1">
            <div className="flex gap-5 animate-marquee whitespace-nowrap">
              {trendingArticles.length > 0 ? (
                [...trendingArticles, ...trendingArticles].map((art, i) => {
                  const isVideo = art.category === "भिडियो ग्यालरी" || !!art.videoId;
                  const tagText = art.title?.startsWith("#")
                    ? art.title
                    : (isVideo ? `#🎥 ${art.title}` : `#${art.title}`);

                  const href = art.videoId
                    ? `/videos/${art.videoId}`
                    : (art.category === "भिडियो ग्यालरी"
                      ? "/videos"
                      : (art._id ? `/samachar/${art._id}` : `/search?q=${encodeURIComponent(art.title || "")}`));

                  return (
                    <Link
                      key={`${art._id || i}-${i}`}
                      href={href}
                      className="text-sm text-gray-700 hover:text-blue-600 transition font-medium"
                    >
                      {tagText}
                    </Link>
                  );
                })
              ) : (
                <span className="text-sm text-gray-500 italic">ट्रेन्डिङ समाचार लोड हुँदैछ...</span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Social icons */}
        <div className="shrink-0 hidden md:flex items-center gap-3">
          <a href="https://www.facebook.com/smartsanchar" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-400 hover:text-blue-600 transition">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
          </a>
          <a href="https://www.youtube.com/@smartsanchar" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-gray-400 hover:text-red-600 transition">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" /></svg>
          </a>
        </div>
      </div>
    </div>
  );
}

