"use client";

import { useState, useRef } from "react";
import { UploadCloud, Image as ImageIcon, X, CheckCircle2, RefreshCw } from "lucide-react";

export default function ImageDropzone({ value, onChange, label = "तस्वीर अपलोड गर्नुहोस् (Drag & Drop Image)" }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);

  const handleUploadFile = async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      setUploadError("Please provide a valid image file (JPG, PNG, WEBP).");
      return;
    }

    setUploadError("");
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setIsUploading(false);

      if (data.success && data.url) {
        onChange(data.url);
      } else {
        setUploadError(data.message || "Failed to upload image to Cloudinary.");
      }
    } catch (err) {
      setIsUploading(false);
      setUploadError("Network error during Cloudinary upload.");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleUploadFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
        {label}
      </label>

      {/* Hidden input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />

      {value ? (
        /* Image Preview Box */
        <div className="relative w-full h-44 rounded-xl border border-gray-200 overflow-hidden group bg-gray-100 shadow-xs">
          <img src={value} alt="Uploaded preview" className="w-full h-full object-cover" />
          
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-white text-gray-900 text-xs font-bold px-3.5 py-2 rounded-lg hover:bg-gray-100 transition-colors shadow-sm flex items-center gap-1.5"
            >
              <RefreshCw size={14} />
              <span>Change Image</span>
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="bg-red-600 text-white text-xs font-bold px-3.5 py-2 rounded-lg hover:bg-red-700 transition-colors shadow-sm flex items-center gap-1.5"
            >
              <X size={14} />
              <span>Remove</span>
            </button>
          </div>

          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1">
            <CheckCircle2 size={11} className="text-green-400" />
            <span>Cloudinary Hosted</span>
          </div>
        </div>
      ) : (
        /* Drag and Drop Zone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`w-full h-40 rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center p-4 text-center ${
            isDragging
              ? "border-red-600 bg-red-50/60 scale-[1.01]"
              : "border-gray-300 bg-gray-50/50 hover:bg-gray-100/70 hover:border-red-400"
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 text-red-600">
              <RefreshCw className="animate-spin" size={28} />
              <span className="text-xs font-bold">Cloudinary मा अपलोड हुँदैछ...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-1">
                <UploadCloud size={24} />
              </div>
              <p className="text-xs font-bold text-gray-800">
                तस्वीर तानेर यहाँ राख्नुहोस् (Drag & Drop Image Here)
              </p>
              <p className="text-[11px] text-gray-500">
                अथवा कम्प्युटरबाट छान्न यहाँ क्लिक गर्नुहोस् (JPG, PNG, WEBP)
              </p>
            </div>
          )}
        </div>
      )}

      {uploadError && (
        <p className="text-xs text-red-600 font-semibold mt-1.5 flex items-center gap-1">
          <X size={13} />
          {uploadError}
        </p>
      )}
    </div>
  );
}
