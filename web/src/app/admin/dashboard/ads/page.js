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
  Image as ImageIcon,
  X,
} from "lucide-react";
import { authFetch } from "@/lib/auth";

const PLACEMENTS = {
  header: {
    label: "हेडर ब्यानर (Header Banner 970x90)",
    shortLabel: "Header Banner",
    size: "970 × 90 px",
    aspectRatio: "970 / 90",
    minHeight: "85px",
    description: "वेबसाइटको मुख्य हेडरमा देखिने ठूलो ब्यानर",
    badgeBg: "bg-blue-100 text-blue-800 border-blue-200",
  },
  sidebar: {
    label: "साइडबार ब्यानर (Sidebar 300x250)",
    shortLabel: "Sidebar Banner",
    size: "300 × 250 px",
    aspectRatio: "300 / 250",
    minHeight: "180px",
    description: "समाचार पृष्ठको दायाँपट्टी साइडबारमा देखिने ब्यानर",
    badgeBg: "bg-purple-100 text-purple-800 border-purple-200",
  },
  content: {
    label: "सामग्री ब्यानर (Content Banner 970x90)",
    shortLabel: "Content Banner",
    size: "970 × 90 px",
    aspectRatio: "970 / 90",
    minHeight: "85px",
    description: "समाचार सामग्रीको बीचमा देखिने ठूलो ब्यानर",
    badgeBg: "bg-amber-100 text-amber-800 border-amber-200",
  },
};

export default function AdminAdsPage() {
  const [ads, setAds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewModalAd, setPreviewModalAd] = useState(null);

  // Form State
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [position, setPosition] = useState("header");
  const [status, setStatus] = useState("Active");
  const [message, setMessage] = useState(null);

  const currentPlacement = PLACEMENTS[position] || PLACEMENTS.header;

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
      const res = await authFetch("/api/upload", {
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
      const res = await authFetch("/api/ads", {
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
      const res = await authFetch(`/api/ads/${ad._id}`, {
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
      const res = await authFetch(`/api/ads/${id}`, { method: "DELETE" });
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
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-gray-700">
                  ब्यानर तस्वीर (Banner Image) *
                </label>
                <span className="text-[11px] font-bold text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                  {currentPlacement.size}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 cursor-pointer transition-colors shadow-2xs">
                  <Upload size={14} />
                  <span>
                    {isUploading ? "अपलोड हुँदैछ..." : imageUrl ? "अर्को तस्वीर रोज्नुहोस्" : "तस्वीर रोज्नुहोस्"}
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

              {/* LIVE SKELETON / PLACEMENT PREVIEW (Fixed Display Size, Crops if larger) */}
              <div
                className={`w-full rounded-xl overflow-hidden border-2 transition-all relative flex items-center justify-center bg-gray-50/80 shadow-2xs shrink-0 ${
                  imageUrl ? "border-gray-300 bg-slate-900/5" : "border-dashed border-gray-300"
                }`}
                style={{
                  aspectRatio: currentPlacement.aspectRatio,
                  maxHeight: position === "sidebar" ? "220px" : "90px",
                }}
              >
                {isUploading ? (
                  // Uploading Skeleton
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-linear-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse text-gray-600 gap-2">
                    <RefreshCw size={22} className="animate-spin text-red-600" />
                    <span className="text-xs font-bold">
                      तस्वीर अपलोड हुँदैछ... ({currentPlacement.size})
                    </span>
                  </div>
                ) : imageUrl ? (
                  // Uploaded Image: object-cover fills fixed place and crops excess if image is larger
                  <div className="w-full h-full relative group flex items-center justify-center overflow-hidden">
                    <img
                      src={imageUrl}
                      alt="Ad Preview"
                      className="w-full h-full object-cover"
                    />
                    {/* Hover Overlay with Action Buttons */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewModalAd({
                            imageUrl,
                            title: title || "ब्यानर पूर्वावलोकन",
                            position,
                          })
                        }
                        className="px-3 py-1.5 bg-white text-gray-800 rounded-lg text-xs font-bold flex items-center gap-1 shadow-md hover:bg-gray-100 transition-transform hover:scale-105 cursor-pointer"
                      >
                        <Eye size={13} />
                        <span>वास्तविक फाइल हेर्नुहोस्</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageUrl("")}
                        className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-md hover:bg-red-700 transition-transform hover:scale-105 cursor-pointer"
                      >
                        <X size={13} />
                        <span>हटाउनुहोस्</span>
                      </button>
                    </div>
                    {/* Fixed Size Badge */}
                    <span className="absolute bottom-1.5 right-2 bg-black/75 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                      निश्चित आकार (Fixed Slot • ठूलो भए क्रप हुन्छ)
                    </span>
                  </div>
                ) : (
                  // Position-based Skeleton Placeholder matching selected placement size
                  <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-linear-to-b from-gray-50 to-gray-100/60 select-none">
                    <div className="flex items-center gap-2 text-gray-600 font-bold text-xs mb-1">
                      <ImageIcon size={18} className="text-gray-400" />
                      <span>{currentPlacement.shortLabel} स्थान ढाँचा</span>
                    </div>
                    <div className="text-[11px] font-semibold text-gray-500">
                      आकार:{" "}
                      <span className="font-bold text-gray-800 font-mono">
                        {currentPlacement.size}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">
                      तस्वीर अपलोड गर्दा यो आकारमा ठ्याक्कै फिट हुनेछ (कुनै भाग काटिने छैन)
                    </p>
                  </div>
                )}
              </div>
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
                    {/* Adaptive Uncropped Thumbnail matching banner ratio */}
                    <div
                      onClick={() => setPreviewModalAd(ad)}
                      className={`rounded-xl overflow-hidden shrink-0 bg-slate-900/5 border border-gray-300 p-0.5 flex items-center justify-center cursor-pointer hover:border-red-500 hover:shadow-xs transition-all group relative ${
                        ad.position === "sidebar"
                          ? "w-16 sm:w-20 h-14"
                          : "w-32 sm:w-44 h-11"
                      }`}
                      style={{
                        aspectRatio:
                          ad.position === "sidebar" ? "300 / 250" : "970 / 90",
                      }}
                      title="वास्तविक साइज हेर्न क्लिक गर्नुहोस्"
                    >
                      <img
                        src={ad.imageUrl}
                        alt={ad.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                        <Eye size={14} className="text-white drop-shadow-sm" />
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">
                        {ad.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-1 font-medium">
                        <span
                          className={`px-2 py-0.5 rounded-md font-bold uppercase text-[10px] border ${
                            PLACEMENTS[ad.position]?.badgeBg ||
                            "bg-gray-200 text-gray-800 border-gray-300"
                          }`}
                        >
                          {ad.position} ({PLACEMENTS[ad.position]?.size || ""})
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
                      onClick={() => setPreviewModalAd(ad)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      title="वास्तविक आकार हेर्नुहोस्"
                    >
                      <Eye size={16} />
                    </button>

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

      {/* FULL RESOLUTION / ACTUAL SIZE MODAL */}
      {previewModalAd && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setPreviewModalAd(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full p-5 space-y-4 shadow-2xl border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  {previewModalAd.title || "विज्ञापन पूर्वावलोकन"}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  स्थान:{" "}
                  <span className="font-bold text-gray-800 uppercase">
                    {previewModalAd.position}
                  </span>{" "}
                  ({PLACEMENTS[previewModalAd.position]?.size || "ब्यानर"}) • वास्तविक आकार पूर्वावलोकन
                </p>
              </div>
              <button
                onClick={() => setPreviewModalAd(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Uncropped Full Size Display */}
            <div className="bg-slate-900/5 rounded-xl border border-gray-200 p-3 overflow-auto max-h-[70vh] flex items-center justify-center">
              <img
                src={previewModalAd.imageUrl}
                alt={previewModalAd.title || "Ad"}
                className="max-w-full h-auto object-contain rounded"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
              <span className="text-green-700 font-medium">
                ✓ कुनै पनि भाग नकाटिएको पूर्ण विज्ञापन (Actual Size / No Crop)
              </span>
              <button
                onClick={() => setPreviewModalAd(null)}
                className="px-4 py-2 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-colors cursor-pointer text-xs"
              >
                बन्द गर्नुहोस्
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
