import { Clock, MapPin, Inbox, Eye } from "lucide-react";
import Link from "next/link";
import { getRelativeTimeNepali } from "@/lib/dateUtils";

export default function ProvinceClient({ provinceName, provinceNews }) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="container mx-auto px-4 py-8">
        {/* Province Header */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6 mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-3">
              <MapPin className="text-red-600 w-8 h-8 shrink-0" />
              <span>{provinceName} प्रदेश समाचार</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">
              ताजा र मुख्य समाचार अपडेटहरू ({provinceNews.length} समाचार)
            </p>
          </div>
        </div>

        {/* Dynamic News Grid or Clean Empty State */}
        {provinceNews.length === 0 ? (
          <div className="py-20 px-4 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-white shadow-xs my-8 max-w-xl mx-auto">
            <Inbox className="mx-auto text-gray-400 mb-3" size={48} />
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              यस प्रदेशका लागि हाल कुनै समाचार प्रकाशित गरिएको छैन
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              प्रशासकले नियन्त्रण कक्षबाट {provinceName} प्रदेशका लागि समाचार अपलोड गरेपछि यहाँ प्रदर्शित हुनेछन्।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {provinceNews.map((news) => (
              <Link
                key={news._id}
                href={`/samachar/${news._id}`}
                className="bg-white rounded-xl shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden group border border-gray-200 flex flex-col"
              >
                <div className="relative aspect-video overflow-hidden bg-gray-100">
                  {news.imageUrl ? (
                    <img
                      src={news.imageUrl}
                      alt={news.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm font-semibold uppercase">
                      {provinceName} प्रदेश
                    </div>
                  )}
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                    {provinceName}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1">
                    <Eye size={10} />
                    {(news.views || 0).toLocaleString()}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600 line-clamp-2 mb-2 leading-snug">
                    {news.title}
                  </h3>
                  <p className="text-gray-600 text-xs mb-4 line-clamp-3 leading-relaxed flex-1">
                    {news.summary || news.content}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-3 border-t border-gray-100">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock size={12} />
                      {getRelativeTimeNepali(news.createdAt)}
                    </span>
                    <span className="text-gray-500 font-medium">{news.author || "संवाददाता"}</span>
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
