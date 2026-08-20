import { Clock, Monitor, Eye } from "lucide-react";
import Link from "next/link";
import { getRelativeTimeNepali } from "@/lib/dateUtils";

export default function ITClient({ newsList }) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6 mb-8 flex items-center justify-between border-l-4 border-l-purple-600">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-3">
              <Monitor className="text-purple-600 w-8 h-8 shrink-0" />
              <span>सूचना प्रविधि समाचार</span>
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm mt-1 font-medium">
              प्रविधि, ग्याजेट, स्टार्टअप र डिजिटल नेपालका अपडेटहरू ({newsList.length} समाचार)
            </p>
          </div>
        </div>

        {/* News Grid */}
        {newsList.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center text-gray-400 max-w-xl mx-auto my-8">
            <Monitor className="w-16 h-16 mx-auto mb-4 text-purple-600 opacity-40" />
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              कुनै सूचना प्रविधि समाचार उपलब्ध छैन
            </h3>
            <p className="text-xs text-gray-500">
              अहिलेसम्म यो क्याटगोरीमा कुनै पनि समाचार सामग्री अपलोड गरिएको छैन।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {newsList.map((news) => (
              <Link
                key={news._id}
                href={`/samachar/${news._id}`}
                className="bg-white rounded-xl shadow-xs overflow-hidden group border border-gray-200 flex flex-col hover:border-purple-300 hover:shadow-md transition-all duration-300"
              >
                <div className="relative aspect-video overflow-hidden bg-gray-100">
                  {news.imageUrl ? (
                    <img
                      src={news.imageUrl}
                      alt={news.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-medium">
                      तस्वीर उपलब्ध छैन
                    </div>
                  )}
                  <div className="absolute top-2 left-2 bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                    {news.category || "प्रविधि"}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1">
                    <Eye size={10} />
                    {(news.views || 0).toLocaleString()}
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2 mb-2 text-sm leading-snug flex-1">
                    {news.title}
                  </h3>
                  {news.summary && (
                    <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-3">
                      {news.summary}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-[11px] text-gray-400 mt-auto pt-2 border-t border-gray-100 font-medium">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock size={12} />
                      {getRelativeTimeNepali(news.createdAt)}
                    </span>
                    <span className="text-gray-500 font-semibold">{news.author || "संवाददाता"}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
