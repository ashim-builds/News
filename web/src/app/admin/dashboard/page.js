"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ShieldAlert,
  Newspaper,
  Eye,
  TrendingUp,
  ChevronRight,
  CheckCircle2,
  Lock,
  Mail,
  KeyRound,
  EyeOff,
  Key,
  RotateCcw,
  Trash2,
  Edit3,
  X,
  Image as ImageIcon,
  FolderPlus,
  RefreshCw,
  Clock,
} from "lucide-react";
import ImageDropzone from "@/components/common/ImageDropzone";
import { authFetch, fetchAdminProfile } from "@/lib/auth";

const CATEGORY_OPTIONS = [
  "समाचार",
  "मुख्य समाचार",
  "खेलकुद",
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

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") === "settings" ? "settings" : "dashboard";

  const [adminEmail, setAdminEmail] = useState("");
  const [articles, setArticles] = useState([]);
  const [isFetchingArticles, setIsFetchingArticles] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0,
    views: 0,
  });

  // Edit Modal State
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

  // Settings Password Change State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  // Global UI State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch verified admin session directly from server (HttpOnly cookie)
  useEffect(() => {
    async function loadAdminEmail() {
      try {
        const profile = await fetchAdminProfile();
        if (profile?.email) {
          setAdminEmail(profile.email);
        }
      } catch (err) {
        console.error("Error loading admin profile:", err);
      }
    }
    loadAdminEmail();
  }, []);

  // Fetch dynamic articles from MongoDB
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

        const total = enrichedArticles.length;
        const published = enrichedArticles.filter(
          (a) => a.status === "Published"
        ).length;
        const drafts = enrichedArticles.filter(
          (a) => a.status === "Draft"
        ).length;
        const views = enrichedArticles.reduce(
          (acc, curr) => acc + (curr.views || 0),
          0
        );

        setStats({ total, published, drafts, views });
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

      const res = await authFetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(articleForm),
      });

      const data = await res.json();
      setIsLoading(false);

      if (data.success) {
        setIsModalOpen(false);
        setSuccessMessage("Article updated successfully in MongoDB!");
        fetchArticlesFromDB();
      } else {
        setErrorMessage(data.message || "Failed to save article.");
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMessage("Network error saving article to MongoDB.");
    }
  };

  const handleDeleteArticle = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await authFetch(`/api/articles/${id}`, { method: "DELETE" });
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

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!currentPassword) {
      setErrorMessage("Please enter your current password.");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setErrorMessage("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirm password do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await authFetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: adminEmail,
          currentPassword: currentPassword,
          newPassword: newPassword,
        }),
      });

      const data = await res.json();
      setIsLoading(false);

      if (data.success) {
        setSuccessMessage("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setOtp("");
      } else {
        setErrorMessage(data.message || "Invalid OTP code.");
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMessage("Failed to update password.");
    }
  };

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
            <span className="text-gray-900 font-bold">
              प्रशासक नियन्त्रण कक्ष
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <div className="w-3 h-8 bg-red-600 rounded-sm"></div>
            {activeTab === "settings"
              ? "प्रणाली सेटिङ तथा सुरक्षा (Settings)"
              : "मुख्य नियन्त्रण तथा विश्लेषक (Dashboard Analytics)"}
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

      {/* TAB 1: DASHBOARD STATS & REAL-TIME ANALYTICS */}
      {activeTab === "dashboard" && (
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  कुल समाचार (Total Articles)
                </span>
                <div className="p-2.5 rounded-xl bg-red-50 text-red-600 border border-red-100">
                  <Newspaper size={20} />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-gray-900 mb-1">
                {stats.total}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  प्रकाशित (Published)
                </span>
                <div className="p-2.5 rounded-xl bg-green-50 text-green-600 border border-green-100">
                  <CheckCircle2 size={20} />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-gray-900 mb-1">
                {stats.published}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  ड्राफ्टहरू (Drafts)
                </span>
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                  <FolderPlus size={20} />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-gray-900 mb-1">
                {stats.drafts}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  कुल हेराई (Total Views)
                </span>
                <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                  <Eye size={20} />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-gray-900 mb-1">
                {stats.views.toLocaleString()}
              </div>
            </div>
          </div>

          {/* RECENT TOP PERFORMING ARTICLES TABLE */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="text-red-600" size={20} />
                सर्वाधिक पढिएका समाचारहरू (Top Performing News)
              </h3>
              <Link
                href="/admin/dashboard/news"
                className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                <span>सबै समाचार प्रबन्ध हेर्नुहोस्</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            {articles.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-xs font-medium">
                अहिलेसम्म कुनै समाचार डेटा भेटिएन।
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
                      <th className="py-3 px-4 text-right">कार्य (Actions)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[...articles]
                      .sort((a, b) => (b.views || 0) - (a.views || 0))
                      .slice(0, 5)
                      .map((article) => (
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
                            ) : article.videoId ? (
                              <img
                                src={`https://img.youtube.com/vi/${article.videoId}/hqdefault.jpg`}
                                alt=""
                                className="w-12 h-9 object-cover rounded-md shrink-0 border border-gray-200"
                              />
                            ) : (
                              <div className="w-9 h-9 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center text-gray-400 shrink-0">
                                <ImageIcon size={16} />
                              </div>
                            )}
                            <span className="truncate">{article.title}</span>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-blue-700 whitespace-nowrap">
                            {article.category}
                          </td>
                          <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">
                            {article.ytDate
                              ? article.ytDate
                              : article.createdAt
                              ? new Date(article.createdAt).toLocaleDateString("ne-NP")
                              : "N/A"}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-gray-800">
                            {article.ytViews
                              ? article.ytViews
                              : (article.views || 0).toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEditModal(article)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                title="Edit"
                              >
                                <Edit3 size={16} />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteArticle(article._id, article.title)
                                }
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                title="Delete"
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
        </div>
      )}

      {/* TAB 4: SETTINGS (CHANGE PASSWORD) */}
      {activeTab === "settings" && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-xs p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
            <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0">
              <Lock size={26} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Admin Security Settings & Password Change
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Update your admin credentials securely in MongoDB
              </p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Current Password <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Key size={16} />
                </div>
                <input
                  type={showPass ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Current password"
                  className="w-full pl-10 pr-11 py-3 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                New Password <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <KeyRound size={16} />
                </div>
                <input
                  type={showPass ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password (min 6 chars)"
                  className="w-full pl-10 pr-11 py-3 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Confirm New Password <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <KeyRound size={16} />
                </div>
                <input
                  type={showPass ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full pl-10 pr-11 py-3 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100 transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-base rounded-xl shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* ARTICLE EDIT MODAL */}
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
                  समाचारको शीर्षक (Title) <span className="text-red-600">*</span>
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
                    मुख्य वर्ग (Category) <span className="text-red-600">*</span>
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

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-400 font-medium">Dashboard लोड हुँदैछ...</div>}>
      <AdminDashboardContent />
    </Suspense>
  );
}
