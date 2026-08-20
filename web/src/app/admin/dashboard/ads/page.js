"use client";

import { useState, useEffect } from "react";
import {
  Megaphone,
  Plus,
  Trash2,
  Upload,
  ExternalLink,
  Eye,
  MousePointerClick,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";

export default function AdminAdsPage() {
  const [ads, setAds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [position, setPosition] = useState("header");
  const [status, setStatus] = useState("Active");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchAds();
  }, []);

  async function fetchAds() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/ads");
      const data = await res.json();
      if (data.success && Array.isArray(data.ads)) {
        setAds(data.ads);
      }
    } catch (err) {
      console.error("Failed to fetch ads:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setImageUrl(data.url);
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !imageUrl || !position) return;

    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          imageUrl,
          linkUrl,
          position,
          status,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: "विज्ञापन सफलतापूर्वक थपियो!" });
        setTitle("");
        setImageUrl("");
        setLinkUrl("");
        setPosition("header");
        setStatus("Active");
        fetchAds();
      } else {
        setMessage({ type: "error", text: data.message || "त्रुटि भयो।" });
      }
    } catch (err) {
      console.error("Ad submit error:", err);
      setMessage({ type: "error", text: "सर्भर त्रुटि भयो।" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (ad) => {
    const newStatus = ad.status === "Active" ? "Disabled" : "Active";
    try {
      const res = await fetch(`/api/ads/${ad._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) fetchAds();
    } catch (err) {
      console.error("Toggle status error:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("के तपाईं यो विज्ञापन हटाउन निश्चित हुनुहुन्छ?")) return;
    try {
      const res = await fetch(`/api/ads/${id}`, { method: "DELETE" });
      if (res.ok) fetchAds();
    } catch (err) {
      console.error("Delete ad error:", err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-gray-200">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2.5">
            <Megaphone className="text-red-600 w-7 h-7" />
            <span>विज्ञापन व्यवस्थापन (Ads Management)</span>
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            वेबसाइटका ब्यानर विज्ञापनहरू अपलोड र सञ्चालन गर्नुहोस्
          </p>
        </div>
        <div className="bg-red-50 text-red-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-red-100 self-start sm:self-auto">
          कुल विज्ञापनहरू: {ads.length}
        </div>
      </div>

      {/* Grid Layout: Add Form + Ads List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Create New Ad Form (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-xs border border-gray-200 space-y-5">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <Plus size={18} className="text-red-600" />
            <span>नयाँ विज्ञापन थप्नुहोस्</span>
          </h2>

          {message && (
            <div
              className={`p-3 rounded-xl text-xs font-bold ${
                message.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                विज्ञापन शीर्षक (Ad Title) *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="उदा. एनआईसी एशिया बैंक अफर"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 outline-hidden text-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                विज्ञापन स्थान (Placement Position) *
              </label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 outline-hidden bg-white text-black"
              >
                <option value="header">
                  हेडर ब्यानर (Header Banner 970x90)
                </option>
                <option value="sidebar">
                  साइडबार ब्यानर (Sidebar 300x250)
                </option>
                <option value="content">
                  सामग्री ब्यानर (Content Banner 970x90)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                गन्तव्य लिङ्क (Target Link URL)
              </label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 outline-hidden text-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                ब्यानर तस्वीर (Banner Image) *
              </label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 cursor-pointer transition-colors">
                  <Upload size={14} />
                  <span>
                    {isUploading ? "अपलोड हुँदैछ..." : "तस्वीर रोज्नुहोस्"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                {imageUrl && (
                  <span className="text-xs text-green-600 font-bold flex items-center gap-1">
                    <CheckCircle size={14} /> अपलोड भयो
                  </span>
                )}
              </div>
              {imageUrl && (
                <div className="mt-3 aspect-video max-h-32 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                  <img
                    src={imageUrl}
                    alt="Ad Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || isUploading || !imageUrl}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>राख्दैछ...</span>
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    <span>विज्ञापन प्रकाशित गर्नुहोस्</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Existing Ads Table (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-xs border border-gray-200 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <Megaphone size={18} className="text-gray-700" />
            <span>सक्रिय तथा हालका विज्ञापनहरू</span>
          </h2>

          {isLoading ? (
            <div className="py-16 text-center text-gray-400 text-xs font-semibold">
              <RefreshCw
                size={24}
                className="animate-spin mx-auto mb-2 text-red-600"
              />
              <span>विज्ञापनहरू लोड हुँदैछ...</span>
            </div>
          ) : ads.length === 0 ? (
            <div className="py-16 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
              <p className="text-sm font-bold text-gray-700">
                कुनै विज्ञापन थपिएको छैन
              </p>
              <p className="text-xs text-gray-400 mt-1">
                बायाँतर्फको फारमबाट नयाँ ब्यानर थप्नुहोस्।
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {ads.map((ad) => (
                <div
                  key={ad._id}
                  className="bg-gray-50/70 border border-gray-200 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                >
                  <div className="flex gap-3 items-center">
                    <div className="w-24 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-200 border border-gray-300">
                      <img
                        src={ad.imageUrl}
                        alt={ad.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">
                        {ad.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-1 font-medium">
                        <span className="bg-gray-200 px-2 py-0.5 rounded text-gray-800 font-bold uppercase">
                          {ad.position}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MousePointerClick
                            size={12}
                            className="text-blue-600"
                          />
                          {ad.clicks || 0} क्लिक
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => handleToggleStatus(ad)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                        ad.status === "Active"
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                      }`}
                    >
                      {ad.status === "Active" ? (
                        <>
                          <CheckCircle size={14} /> सक्रिय
                        </>
                      ) : (
                        <>
                          <XCircle size={14} /> निष्क्रिय
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDelete(ad._id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="हटाउनुहोस्"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
