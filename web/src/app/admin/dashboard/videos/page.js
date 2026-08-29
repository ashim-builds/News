"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Video,
  PlayCircle,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Edit3,
  X,
  Image as ImageIcon,
  RefreshCw,
  Clock,
  Eye,
  Search,
  Share2,
  Copy,
  Check,
} from "lucide-react";
import ImageDropzone from "@/components/common/ImageDropzone";

const CATEGORY_OPTIONS = [
  "समाचार",
  "मुख्य समाचार",
  "प्रदेश पाना",
  "अर्थ / कृषि",
  "अपराध गतिविधि",
  "सूचना प्रविधि",
  "हाम्रो समाजमा",
  "भिडियो ग्यालरी",
];

export default function AdminVideosPage() {
  const [articles, setArticles] = useState([]);
  const [isFetchingArticles, setIsFetchingArticles] = useState(true);

  // Video Uploader Modal State
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videoInputUrl, setVideoInputUrl] = useState("");
  const [videoPreview, setVideoPreview] = useState(null);
  const [isFetchingVideo, setIsFetchingVideo] = useState(false);

  // Edit Article Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState(null);
  const [articleForm, setArticleForm] = useState({
    title: "",
    category: "भिडियो ग्यालरी",
    province: "",
    summary: "",
    content: "",
    imageUrl: "",
    videoId: "",
    author: "स्मार्ट सञ्चार संवाददाता",
    status: "Published",
    isFeatured: false,
  });

  // Global UI State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Share Modal State
  const [sharingArticle, setSharingArticle] = useState(null);
  const [copied, setCopied] = useState(false);

  // Fetch dynamic articles & enrich videos with live YouTube data
  const fetchArticlesFromDB = async () => {
    setIsFetchingArticles(true);
    try {
      const res = await fetch("/api/articles");
      const data = await res.json();
      if (data.success && Array.isArray(data.articles)) {
        const enrichedArticles = await Promise.all(
          data.articles.map(async (article) => {
            if (article.category === "भिडियो ग्यालरी" && article.videoId) {
              try {
                const ytRes = await fetch(`/api/youtube?id=${article.videoId}`);
                const ytData = await ytRes.json();
                if (ytData.success) {
                  return {
                    ...article,
                    ytViews: ytData.data.views,
                    ytDate: ytData.data.date,
                  };
                }
              } catch (e) {
                console.error("Error fetching YT data for table", e);
              }
            }
            return article;
          })
        );
        setArticles(enrichedArticles);
      }
    } catch (err) {
      console.error("Error fetching dynamic articles:", err);
    } finally {
      setIsFetchingArticles(false);
    }
  };

  useEffect(() => {
    queueMicrotask(() => fetchArticlesFromDB());
  }, []);

  // Open Video Uploader Modal
  const handleOpenVideoModal = () => {
    setVideoInputUrl("");
    setVideoPreview(null);
    setErrorMessage("");
    setIsVideoModalOpen(true);
  };

  // Fetch YouTube Metadata Preview
  const handleFetchVideoPreview = async () => {
    if (!videoInputUrl.trim()) {
      setErrorMessage("Please enter a YouTube Video ID or URL.");
      return;
    }
    setIsFetchingVideo(true);
    setErrorMessage("");
    try {
      const res = await fetch(
        `/api/youtube?id=${encodeURIComponent(videoInputUrl.trim())}`
      );
      const data = await res.json();
      if (data.success && (data.data || data.videoId)) {
        setVideoPreview(data.data || { id: data.videoId, videoId: data.videoId, title: data.title });
      } else {
        setErrorMessage(data.message || data.error || "Failed to fetch video details.");
      }
    } catch (err) {
      setErrorMessage("An error occurred while fetching video details.");
    } finally {
      setIsFetchingVideo(false);
    }
  };

  // Save YouTube Video
  const handleSaveVideo = async () => {
    if (!videoPreview) return;
    setIsLoading(true);
    setErrorMessage("");
    try {
      const vId = videoPreview.id || videoPreview.videoId;
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: videoPreview.title || "Video News",
          category: "भिडियो ग्यालरी",
          videoId: vId,
          status: "Published",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage("Video saved successfully!");
        setIsVideoModalOpen(false);
        fetchArticlesFromDB();
      } else {
        setErrorMessage(data.message || data.error || "Failed to save video.");
      }
    } catch (err) {
      setErrorMessage("An error occurred while saving video.");
    } finally {
      setIsLoading(false);
    }
  };

  // Open Edit Article Modal
  const handleOpenEditModal = (article) => {
    setEditingArticleId(article._id);
    setArticleForm({
      title: article.title || "",
      category: article.category || "भिडियो ग्यालरी",
      province: article.province || "",
      summary: article.summary || "",
      content: article.content || "",
      imageUrl: article.imageUrl || "",
      videoId: article.videoId || "",
      author: article.author || "स्मार्ट सञ्चार संवाददाता",
      status: article.status || "Published",
      isFeatured: !!article.isFeatured,
    });
    setErrorMessage("");
    setIsModalOpen(true);
  };

  // Save edited video
  const handleSaveEditedVideo = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!articleForm.title.trim()) {
      setErrorMessage("Please enter a Video Title.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`/api/articles/${editingArticleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(articleForm),
      });

      const data = await res.json();
      setIsLoading(false);

      if (data.success) {
        setIsModalOpen(false);
        setSuccessMessage("Video details updated successfully!");
        fetchArticlesFromDB();
      } else {
        setErrorMessage(data.message || "Failed to update video.");
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMessage("Network error updating video.");
    }
  };

  // Delete Video Article
  const handleDeleteArticle = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete video "${title}"?`)) return;

    try {
      const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage(`Video "${title}" deleted from MongoDB.`);
        fetchArticlesFromDB();
      } else {
        setErrorMessage(data.message || "Failed to delete video.");
      }
    } catch (err) {
      setErrorMessage("Error deleting video.");
    }
  };

  const videoArticles = articles.filter(
    (a) => a.category === "भिडियो ग्यालरी"
  );

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 font-medium">
            <Link href="/" className="hover:text-red-600 transition-colors">
              गृह
            </Link>
            <ChevronRight size={12} className="text-gray-400" />
            <Link href="/admin/dashboard" className="hover:text-red-600 transition-colors">
              प्रशासक नियन्त्रण कक्ष
            </Link>
            <ChevronRight size={12} className="text-gray-400" />
            <span className="text-gray-900 font-bold">भिडियो ग्यालरी</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <div className="w-3 h-8 bg-red-600 rounded-sm"></div>
            भिडियो ग्यालरी व्यवस्थापन (Videos Gallery)
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchArticlesFromDB}
            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
            title="Refresh Data from MongoDB"
          >
            <RefreshCw
              size={14}
              className={isFetchingArticles ? "animate-spin text-red-600" : ""}
            />
            <span>रिफ्रेस (Refresh)</span>
          </button>

          <button
            onClick={handleOpenVideoModal}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
          >
            <PlayCircle size={16} />
            <span>भिडियो थप्नुहोस् (Upload Video)</span>
          </button>
        </div>
      </div>

      {/* Notifications / Alerts */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage("")}>
            <X size={14} />
          </button>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-green-600" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage("")}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* VIDEOS GALLERY TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Video className="text-red-600" size={20} />
            भिडियो ग्यालरी व्यवस्थापन ({videoArticles.length})
          </h2>
        </div>

        {isFetchingArticles ? (
          <div className="py-16 text-center text-gray-400">
            <RefreshCw
              className="animate-spin mx-auto mb-2 text-red-600"
              size={28}
            />
            <p className="text-xs font-medium">भिडियोहरू लोड हुँदैछ...</p>
          </div>
        ) : videoArticles.length === 0 ? (
          <div className="py-16 px-4 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
            <Video className="mx-auto text-gray-400 mb-3" size={44} />
            <h3 className="text-base font-bold text-gray-800 mb-1">
              कुनै भिडियो उपलब्ध छैन
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mb-5">
              अहिलेसम्म कुनै पनि युट्युब भिडियो अपलोड गरिएको छैन।
            </p>
            <button
              onClick={handleOpenVideoModal}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg inline-flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
            >
              <PlayCircle size={16} />
              <span>पहिलो भिडियो थप्नुहोस् (Upload Video)</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-gray-100/70 text-gray-600 uppercase font-bold tracking-wider border-y border-gray-200">
                <tr>
                  <th className="py-3 px-4">शीर्षक (Title)</th>
                  <th className="py-3 px-4">मिति (Date)</th>
                  <th className="py-3 px-4">हेराई (Views)</th>
                  <th className="py-3 px-4">स्थिति (Status)</th>
                  <th className="py-3 px-4 text-right">कार्य (Actions)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {videoArticles.map((article) => (
                  <tr
                    key={article._id}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-bold text-gray-900 max-w-md truncate flex items-center gap-3">
                      {article.videoId ? (
                        <img
                          src={`https://img.youtube.com/vi/${article.videoId}/hqdefault.jpg`}
                          alt=""
                          className="w-16 h-10 object-cover rounded-md shrink-0 border border-gray-200"
                        />
                      ) : article.imageUrl ? (
                        <img
                          src={article.imageUrl}
                          alt=""
                          className="w-9 h-9 object-cover rounded-md shrink-0 border border-gray-200"
                        />
                      ) : (
                        <div className="w-9 h-9 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center text-gray-400 shrink-0">
                          <ImageIcon size={16} />
                        </div>
                      )}
                      <span className="truncate">{article.title}</span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">
                      {article.ytDate
                        ? article.ytDate
                        : article.createdAt
                        ? new Date(article.createdAt).toLocaleDateString("ne-NP")
                        : "N/A"}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-800">
                      {article.ytViews ? article.ytViews : article.views || 0}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[11px] ${
                          article.status === "Published"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {article.status === "Published" ? (
                          <CheckCircle2 size={12} />
                        ) : (
                          <AlertTriangle size={12} />
                        )}
                        {article.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSharingArticle(article)}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                          title="Share Video"
                        >
                          <Share2 size={16} />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(article)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Edit Video"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteArticle(article._id, article.title)
                          }
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete Video"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DEDICATED YOUTUBE VIDEO UPLOADER MODAL */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl border border-gray-200 max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
                  <PlayCircle size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    युट्युब भिडियो थप्नुहोस् (Upload YouTube Video)
                  </h3>
                  <p className="text-xs text-gray-500">
                    Dynamic Metadata Fetch & Preview
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  युट्युब लिङ्क वा आइडी (YouTube Link or ID){" "}
                  <span className="text-red-600">*</span>
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={videoInputUrl}
                    onChange={(e) => setVideoInputUrl(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleFetchVideoPreview()
                    }
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100 transition-all font-medium"
                  />
                  <button
                    onClick={handleFetchVideoPreview}
                    disabled={isFetchingVideo || !videoInputUrl.trim()}
                    className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-2 disabled:opacity-70 cursor-pointer shrink-0"
                  >
                    {isFetchingVideo ? (
                      <RefreshCw className="animate-spin" size={16} />
                    ) : (
                      <Search size={16} />
                    )}
                    <span>खोज्नुहोस् (Fetch)</span>
                  </button>
                </div>
              </div>

              {/* Preview Card */}
              {videoPreview && (
                <div className="mt-6 bg-[#0a1128] rounded-xl p-4 sm:p-5 border border-gray-800 shadow-inner">
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg border border-gray-700/50 block group">
                    <img
                      className="w-full h-full object-cover"
                      src={`https://img.youtube.com/vi/${videoPreview.id}/hqdefault.jpg`}
                      alt={videoPreview.title}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors">
                      <PlayCircle
                        className="w-16 h-16 text-white/90 drop-shadow-md"
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>
                  <div className="mt-4 px-1">
                    <h2 className="text-xl md:text-2xl font-extrabold text-white leading-tight mb-3">
                      {videoPreview.title}
                    </h2>
                    <div className="flex items-center text-[13px] font-medium text-gray-400 gap-4">
                      <span className="flex items-center gap-1.5">
                        <Clock size={16} className="text-blue-500" />{" "}
                        {videoPreview.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Eye size={16} className="text-green-500" />{" "}
                        {videoPreview.views}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50">
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
              >
                रद्द गर्नुहोस् (Cancel)
              </button>
              <button
                onClick={handleSaveVideo}
                disabled={isLoading || !videoPreview}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2 disabled:opacity-70 cursor-pointer"
              >
                {isLoading ? (
                  <RefreshCw className="animate-spin" size={16} />
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    <span>सेभ गर्नुहोस् (Save Video)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT VIDEO MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-gray-200 max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
                  <PlayCircle size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    भिडियो सम्पादन गर्नुहोस् (Edit Video)
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form
              onSubmit={handleSaveEditedVideo}
              className="p-6 overflow-y-auto space-y-4 flex-1"
            >
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  भिडियो शीर्षक (Title) <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={articleForm.title}
                  onChange={(e) =>
                    setArticleForm({ ...articleForm, title: e.target.value })
                  }
                  placeholder="भिडियोको शीर्षक यहाँ लेख्नुहोस्..."
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100 transition-all font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  युट्युब भिडियो आइडी (YouTube Video ID) <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={articleForm.videoId}
                  onChange={(e) =>
                    setArticleForm({ ...articleForm, videoId: e.target.value })
                  }
                  placeholder="e.g. rz3mMny174A"
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-red-600 transition-all font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    लेखक / संवाददाता (Author)
                  </label>
                  <input
                    type="text"
                    value={articleForm.author}
                    onChange={(e) =>
                      setArticleForm({ ...articleForm, author: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    स्थिति (Status)
                  </label>
                  <select
                    value={articleForm.status}
                    onChange={(e) =>
                      setArticleForm({ ...articleForm, status: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 font-bold"
                  >
                    <option value="Published">Published (प्रकाशित)</option>
                    <option value="Draft">Draft (ड्राफ्ट)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  रद्द गर्नुहोस् (Cancel)
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow transition-all flex items-center gap-2 disabled:opacity-70 cursor-pointer"
                >
                  {isLoading ? (
                    <RefreshCw className="animate-spin" size={16} />
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      <span>सुरक्षित गर्नुहोस् (Update)</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SHARE MODAL */}
      {sharingArticle && (() => {
        const shareUrl = typeof window !== "undefined"
          ? `${window.location.origin}/videos/${sharingArticle._id}`
          : "";

        const handleCopyLink = () => {
          navigator.clipboard.writeText(shareUrl);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        };

        const handleNativeShare = async () => {
          if (navigator.share) {
            try {
              await navigator.share({
                title: sharingArticle.title,
                text: sharingArticle.summary || "",
                url: shareUrl,
              });
            } catch (err) {
              console.log("Error native share", err);
            }
          }
        };

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl border border-gray-200 max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 relative">
              <button
                onClick={() => setSharingArticle(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <Share2 size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">भिडियो साझा गर्नुहोस्</h3>
                  <p className="text-xs text-gray-500">Share video to social platforms</p>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs font-bold text-gray-800 line-clamp-2 mb-4 leading-relaxed">
                {sharingArticle.title}
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-xl border border-gray-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all font-bold text-xs gap-1.5 cursor-pointer text-gray-700"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Facebook</span>
                </a>

                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(sharingArticle.title + " " + shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-xl border border-gray-200 hover:bg-green-50 hover:border-green-200 hover:text-green-600 transition-all font-bold text-xs gap-1.5 cursor-pointer text-gray-700"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.197 1.451 4.836 1.452 5.438 0 9.862-4.425 9.866-9.864.002-2.634-1.02-5.11-2.88-6.973C16.55 1.904 14.072.88 11.442.879 6.002.879 1.579 5.305 1.575 10.744c-.001 1.706.449 3.373 1.304 4.837L1.892 21.05l5.755-1.51l-.99.584z" />
                  </svg>
                  <span>WhatsApp</span>
                </a>

                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(sharingArticle.title)}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:text-black transition-all font-bold text-xs gap-1.5 cursor-pointer text-gray-700"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span>Twitter / X</span>
                </a>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono select-all text-gray-600 focus:outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  type="button"
                  className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                    copied
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>

              {typeof navigator !== "undefined" && navigator.share && (
                <button
                  onClick={handleNativeShare}
                  type="button"
                  className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Share2 size={14} />
                  <span>Other Sharing Options</span>
                </button>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
