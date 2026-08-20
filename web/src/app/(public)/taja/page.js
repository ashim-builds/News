"use client";

import { useState } from "react";
import { Bell, MoreHorizontal, CheckCircle2, Inbox, RefreshCw, X, Eye, Clock } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import Link from "next/link";
import { getRelativeTimeNepali } from "@/lib/dateUtils";

export default function TajaPage() {
  const { articles, unreadCount, unreadIds, markAsRead, markAllAsRead, isLoading } = useNotifications();
  const [filter, setFilter] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState(null);

  const displayList = filter === "unread"
    ? articles.filter((a) => unreadIds.includes(a._id))
    : articles;

  return (
    <div className="bg-gray-100 min-h-screen font-sans py-6">
      <main className="container mx-auto px-0 sm:px-4 py-4 sm:py-8 overflow-hidden">
        {/* Facebook Style Notifications Container */}
        <div className="max-w-2xl mx-auto bg-white sm:rounded-2xl shadow-xs border border-gray-200 overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 flex items-center gap-2">
              <span>ताजा अपडेटहरू (Latest News Updates)</span>
              {unreadCount > 0 && (
                <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {unreadCount}
                </span>
              )}
            </h1>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  <CheckCircle2 size={15} /> सबै पढेको मान्नुहोस्
                </button>
              )}
            </div>
          </div>

          {/* Sub Header Filter Tabs */}
          <div className="px-4 py-2.5 flex items-center gap-2 bg-gray-50/50 border-b border-gray-100">
            <button 
              onClick={() => setFilter("all")}
              className={`px-4 py-1.5 font-bold rounded-full text-xs transition-colors cursor-pointer ${
                filter === "all" ? "bg-red-600 text-white shadow-xs" : "hover:bg-gray-200/70 text-gray-700"
              }`}
            >
              सबै ({articles.length})
            </button>
            <button 
              onClick={() => setFilter("unread")}
              className={`px-4 py-1.5 font-bold rounded-full text-xs transition-colors cursor-pointer ${
                filter === "unread" ? "bg-red-600 text-white shadow-xs" : "hover:bg-gray-200/70 text-gray-700"
              }`}
            >
              नपढिएका ({unreadCount})
            </button>
          </div>

          {/* Dynamic Notifications List */}
          <div className="flex flex-col divide-y divide-gray-100">
            {isLoading ? (
              <div className="p-12 text-center text-gray-400">
                <RefreshCw className="animate-spin mx-auto mb-2 text-red-600" size={26} />
                <p className="text-xs font-medium">ताजा समाचार लोड हुँदैछ...</p>
              </div>
            ) : displayList.length === 0 ? (
              /* EMPTY CONTAINER STATE BEFORE ADMIN UPLOADS */
              <div className="p-12 text-center border-2 border-dashed border-gray-200 m-4 rounded-xl bg-gray-50/50">
                <Inbox className="mx-auto text-gray-400 mb-2" size={40} />
                <h3 className="text-sm font-bold text-gray-800 mb-1">
                  हाल कुनै ताजा अपडेट उपलब्ध छैन
                </h3>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  प्रशासकले नयाँ समाचार प्रकाशित गरेपछि ताजै खबरहरू यहाँ प्रदर्शित हुनेछन्।
                </p>
              </div>
            ) : (
              displayList.map((article) => {
                const isUnread = unreadIds.includes(article._id);
                return (
                  <div 
                    key={article._id} 
                    onClick={() => {
                      markAsRead(article._id);
                      setSelectedArticle(article);
                    }}
                    className={`flex items-start gap-3 sm:gap-4 p-3.5 sm:p-4 cursor-pointer transition-all relative ${
                      isUnread ? 'bg-red-50/30 hover:bg-red-50/60' : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="relative shrink-0">
                      {article.imageUrl ? (
                        <img 
                          src={article.imageUrl} 
                          alt="" 
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-gray-200 shadow-2xs"
                        />
                      ) : (
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-[10px] font-bold">
                          ताजा
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 bg-red-600 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center shadow-xs">
                        <Bell size={10} className="text-white" />
                      </div>
                    </div>

                    {/* Article Info */}
                    <div className="flex-1 min-w-0 pr-6">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-red-100 text-red-700 text-[10px] font-extrabold px-2 py-0.5 rounded">
                          {article.category}
                        </span>
                        {article.province && (
                          <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-1.5 py-0.5 rounded">
                            {article.province}
                          </span>
                        )}
                      </div>
                      <p className="text-[14px] sm:text-[15px] text-gray-900 leading-snug line-clamp-2">
                        <span className="font-bold">{article.title}</span>
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-1 mt-1 font-medium">
                        {article.summary || article.content}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-2 font-medium">
                        <span className="flex items-center gap-1">
                          <Clock size={11} className="text-red-600" />
                          {getRelativeTimeNepali(article.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye size={11} />
                          {(article.views || 0).toLocaleString()} हेराई
                        </span>
                      </div>
                    </div>

                    {/* Unread Dot Indicator */}
                    {isUnread && (
                      <div className="absolute right-4 top-4">
                        <div className="w-2.5 h-2.5 bg-red-600 rounded-full shadow-xs"></div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
        
        {/* Article Quick Preview Modal */}
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="flex justify-between items-center p-4 border-b border-gray-100">
                <h2 className="font-bold text-base text-gray-900 flex items-center gap-2">
                  <Bell size={18} className="text-red-600" />
                  <span>ताजा समाचार विवरण</span>
                </h2>
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-500 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-5 max-h-[80vh] overflow-y-auto space-y-4">
                {selectedArticle.imageUrl && (
                  <img 
                    src={selectedArticle.imageUrl} 
                    alt={selectedArticle.title} 
                    className="w-full h-48 sm:h-56 object-cover rounded-xl border border-gray-100 shadow-2xs"
                  />
                )}
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">{selectedArticle.title}</h3>
                <div className="flex items-center justify-between text-xs text-gray-500 border-y border-gray-100 py-2">
                  <span className="font-bold text-red-600">{selectedArticle.category}</span>
                  <span>{selectedArticle.createdAt ? new Date(selectedArticle.createdAt).toLocaleDateString("ne-NP") : ""}</span>
                </div>
                <div className="text-gray-700 leading-relaxed text-sm">
                  <p className="font-medium mb-3">{selectedArticle.summary}</p>
                  <p>{selectedArticle.content}</p>
                </div>
                <div className="pt-2">
                  <Link
                    href={`/samachar/${selectedArticle._id}`}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center transition-colors shadow-xs"
                  >
                    पूरा समाचार हेर्नुहोस् (Read Full Article)
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
