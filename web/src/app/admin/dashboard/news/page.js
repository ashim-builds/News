"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Newspaper,
  Plus,
  ChevronRight,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Edit3,
  X,
  Image as ImageIcon,
  Inbox,
  RefreshCw,
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
];

const PROVINCE_OPTIONS = [
  "कोशी प्रदेश",
  "मधेश प्रदेश",
  "बागमती प्रदेश",
  "गण्डकी प्रदेश",
  "लुम्बिनी प्रदेश",
  "कर्णाली प्रदेश",
  "सुदूरपश्चिम प्रदेश",
];

export default function AdminNewsPage() {
  const [articles, setArticles] = useState([]);
  const [isFetchingArticles, setIsFetchingArticles] = useState(true);

  // Article Modal State (Create / Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState(null);
  const [articleForm, setArticleForm] = useState({
    title: "",
    category: "समाचार",
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

  // Fetch dynamic articles from MongoDB
  const fetchArticlesFromDB = async () => {
    setIsFetchingArticles(true);
    try {
      const res = await fetch("/api/articles");
      const data = await res.json();
      if (data.success && Array.isArray(data.articles)) {
        setArticles(data.articles);
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

  // Open Create Article Modal
  const handleOpenCreateModal = () => {
    setEditingArticleId(null);
    setArticleForm({
      title: "",
      category: "समाचार",
      province: "",
      summary: "",
      content: "",
      imageUrl: "",
      videoId: "",
      author: "स्मार्ट सञ्चार संवाददाता",
      status: "Published",
      isFeatured: false,
    });
    setErrorMessage("");
    setIsModalOpen(true);
  };

  // Open Edit Article Modal
  const handleOpenEditModal = (article) => {
    setEditingArticleId(article._id);
    setArticleForm({
      title: article.title || "",
      category: article.category || "समाचार",
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

  // Save Article (Create or Update) in MongoDB
  const handleSaveArticle = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!articleForm.title.trim() || !articleForm.category) {
      setErrorMessage("Please fill out the article Title and Category.");
      return;
    }

    setIsLoading(true);

    try {
      const url = editingArticleId
        ? `/api/articles/${editingArticleId}`
        : "/api/articles";
      const method = editingArticleId ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(articleForm),
      });

      const data = await res.json();
      setIsLoading(false);

      if (data.success) {
        setIsModalOpen(false);
        setSuccessMessage(
          editingArticleId
            ? "Article updated successfully in MongoDB!"
            : "New article uploaded dynamically to MongoDB!"
        );
        fetchArticlesFromDB();
      } else {
        setErrorMessage(data.message || "Failed to save article.");
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMessage("Network error saving article to MongoDB.");
    }
  };

  // Delete Article from MongoDB
  const handleDeleteArticle = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage(`Article "${title}" deleted from MongoDB.`);
        fetchArticlesFromDB();
      } else {
        setErrorMessage(data.message || "Failed to delete article.");
      }
    } catch (err) {
      setErrorMessage("Error deleting article.");
    }
  };

  const newsArticles = articles.filter(
    (a) => a.category !== "भिडियो ग्यालरी"
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
            <span className="text-gray-900 font-bold">समाचार व्यवस्थापन</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <div className="w-3 h-8 bg-red-600 rounded-sm"></div>
            सामग्री तथा समाचार व्यवस्थापन (Articles Management)
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
            onClick={handleOpenCreateModal}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
          >
            <Plus size={16} />
            <span>नयाँ समाचार थप्नुहोस् (Upload News)</span>
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

      {/* ARTICLES MANAGEMENT TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FileText className="text-red-600" size={20} />
            सबै समाचार प्रबन्ध तथा सूची ({newsArticles.length})
          </h2>
        </div>

        {isFetchingArticles ? (
          <div className="py-16 text-center text-gray-400">
            <RefreshCw
              className="animate-spin mx-auto mb-2 text-red-600"
              size={28}
            />
            <p className="text-xs font-medium">
              MongoDB बाट समाचारहरू लोड हुँदैछ...
            </p>
          </div>
        ) : newsArticles.length === 0 ? (
          <div className="py-16 px-4 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
            <Inbox className="mx-auto text-gray-400 mb-3" size={44} />
            <h3 className="text-base font-bold text-gray-800 mb-1">
              कुनै समाचार उपलब्ध छैन (Container Empty)
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mb-5">
              अहिलेसम्म यो क्याटगोरीमा कुनै पनि समाचार वा सामग्री अपलोड गरिएको छैन।
            </p>
            <button
              onClick={handleOpenCreateModal}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg inline-flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
            >
              <Plus size={16} />
              <span>पहिलो समाचार अपलोड गर्नुहोस् (Upload Article)</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-gray-100/70 text-gray-600 uppercase font-bold tracking-wider border-y border-gray-200">
                <tr>
                  <th className="py-3 px-4">शीर्षक (Title)</th>
                  <th className="py-3 px-4">वर्ग (Category)</th>
                  <th className="py-3 px-4">मिति (Date)</th>
                  <th className="py-3 px-4">हेराई (Views)</th>
                  <th className="py-3 px-4">स्थिति (Status)</th>
                  <th className="py-3 px-4 text-right">कार्य (Actions)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {newsArticles.map((article) => (
                  <tr
                    key={article._id}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-bold text-gray-900 max-w-md truncate flex items-center gap-3">
                      {article.imageUrl ? (
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
                    <td className="py-3.5 px-4 font-semibold text-blue-700 whitespace-nowrap">
                      {article.category}{" "}
                      {article.province ? `(${article.province})` : ""}
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">
                      {article.createdAt
                        ? new Date(article.createdAt).toLocaleDateString("ne-NP")
                        : "N/A"}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-800">
                      {(article.views || 0).toLocaleString()}
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
                          onClick={() => handleOpenEditModal(article)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Edit Article"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteArticle(article._id, article.title)
                          }
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete Article"
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

      {/* ARTICLE CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-gray-200 max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
                  <Newspaper size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {editingArticleId
                      ? "समाचार सम्पादन गर्नुहोस् (Edit Article)"
                      : "नयाँ समाचार थप्नुहोस् (Upload Article)"}
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
              onSubmit={handleSaveArticle}
              className="p-6 overflow-y-auto space-y-4 flex-1"
            >
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  समाचारको शीर्षक (Title){" "}
                  <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={articleForm.title}
                  onChange={(e) =>
                    setArticleForm({ ...articleForm, title: e.target.value })
                  }
                  placeholder="समाचारको मुख्य शीर्षक यहाँ लेख्नुहोस्..."
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100 transition-all font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    मुख्य वर्ग (Category){" "}
                    <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={articleForm.category}
                    onChange={(e) =>
                      setArticleForm({
                        ...articleForm,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-red-600 transition-all font-medium"
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    प्रदेश छनौट (Province)
                  </label>
                  <select
                    value={articleForm.province}
                    onChange={(e) =>
                      setArticleForm({
                        ...articleForm,
                        province: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-red-600 transition-all font-medium"
                  >
                    <option value="">-- प्रदेश छान्नुहोस् --</option>
                    {PROVINCE_OPTIONS.map((prov) => (
                      <option key={prov} value={prov}>
                        {prov}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <ImageDropzone
                  value={articleForm.imageUrl}
                  onChange={(url) =>
                    setArticleForm({ ...articleForm, imageUrl: url })
                  }
                  label="समाचारको तस्वीर (Cloudinary Drag & Drop Image)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  संक्षेप विवरण (Summary Excerpt)
                </label>
                <textarea
                  rows="2"
                  value={articleForm.summary}
                  onChange={(e) =>
                    setArticleForm({ ...articleForm, summary: e.target.value })
                  }
                  placeholder="समाचारको संक्षेप विवरण..."
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-red-600 transition-all"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  पूर्ण समाचार विवरण (Content)
                </label>
                <textarea
                  rows="4"
                  value={articleForm.content}
                  onChange={(e) =>
                    setArticleForm({ ...articleForm, content: e.target.value })
                  }
                  placeholder="समाचारको पूर्ण विवरण यहाँ लेख्नुहोस्..."
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-red-600 transition-all"
                ></textarea>
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
                      <span>
                        {editingArticleId
                          ? "सुरक्षित गर्नुहोस् (Update)"
                          : "अपलोड गर्नुहोस् (Upload)"}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
