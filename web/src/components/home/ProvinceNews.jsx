"use client";

import { useState, useEffect } from "react";
import { ChevronRight, Clock, MapPin, Inbox } from "lucide-react";
import Link from "next/link";
import { getRelativeTimeNepali } from "@/lib/dateUtils";

const PROVINCES = [
  { id: "koshi", name: "कोशी" },
  { id: "madhesh", name: "मधेश" },
  { id: "bagmati", name: "बागमती" },
  { id: "gandaki", name: "गण्डकी" },
  { id: "lumbini", name: "लुम्बिनी" },
  { id: "karnali", name: "कर्णाली" },
  { id: "sudurpashchim", name: "सुदूरपश्चिम" },
];

export default function ProvinceNews() {
  const [activeTab, setActiveTab] = useState("bagmati");
  const [dbNews, setDbNews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const activeProvinceObj = PROVINCES.find((p) => p.id === activeTab) || PROVINCES[0];

  useEffect(() => {
    async function fetchProvinceNews() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/articles?status=Published&province=${encodeURIComponent(activeProvinceObj.name)}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.articles)) {
          setDbNews(data.articles.filter((a) => a.category !== "भिडियो ग्यालरी"));
        } else {
          setDbNews([]);
        }

      } catch (err) {
        console.error("Error fetching province news:", err);
        setDbNews([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProvinceNews();
  }, [activeTab, activeProvinceObj.name]);

  return (
    <section className="mb-10 bg-white p-6 rounded-xl shadow-xs border border-gray-200">
      <div className="flex items-center justify-between border-b-2 border-red-600 mb-6 pb-2">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <MapPin className="text-red-600" />
          प्रदेश समाचार ({activeProvinceObj.name} प्रदेश)
        </h2>
        <Link href={`/province/${activeTab}`} className="text-sm text-gray-500 hover:text-red-600 flex items-center font-medium">
          सबै <ChevronRight size={16} />
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-1/4 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
          {PROVINCES.map((province) => (
            <button
              key={province.id}
              onClick={() => setActiveTab(province.id)}
              className={`shrink-0 text-left px-4 py-3 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === province.id
                  ? "bg-red-600 text-white shadow-xs"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-transparent"
              }`}
            >
              {province.name} प्रदेश
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <div className="lg:w-3/4">
          {isLoading ? (
            <div className="py-16 text-center text-gray-400 text-xs font-semibold">
              {activeProvinceObj.name} प्रदेशका समाचारहरू लोड हुँदैछ...
            </div>
          ) : dbNews.length === 0 ? (
            /* CLEAN EMPTY CONTAINER STATE BEFORE ADMIN UPLOADS */
            <div className="py-12 px-4 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
              <Inbox className="mx-auto text-gray-400 mb-2" size={36} />
              <h4 className="text-sm font-bold text-gray-800 mb-1">
                {activeProvinceObj.name} प्रदेशमा हाल कुनै समाचार उपलब्ध छैन
              </h4>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                प्रशासकले {activeProvinceObj.name} प्रदेशका लागि समाचार प्रकाशित गरेपछि यहाँ देखिनेछन्।
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dbNews.slice(0, 4).map((news) => (
                <Link
                  href={`/samachar/${news._id}`}
                  key={news._id}
                  className="flex gap-4 group cursor-pointer bg-gray-50 hover:bg-red-50/50 p-3 rounded-lg transition-colors border border-gray-200"
                >
                  <div className="w-28 h-20 shrink-0 overflow-hidden rounded bg-gray-100">
                    {news.imageUrl ? (
                      <img
                        src={news.imageUrl}
                        alt={news.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        नो इमेज
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-center flex-1">
                    <h4 className="font-bold text-gray-800 text-sm md:text-base group-hover:text-red-600 line-clamp-2 mb-2 leading-snug">
                      {news.title}
                    </h4>
                    <div className="text-xs text-gray-500 flex items-center gap-1 font-medium mt-auto">
                      <Clock size={12} className="text-red-600" />
                      {getRelativeTimeNepali(news.createdAt)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <Link
              href={`/province/${activeTab}`}
              className="inline-flex items-center gap-2 bg-gray-900 hover:bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors"
            >
              {activeProvinceObj.name}को सबै समाचार हेर्नुहोस् <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
