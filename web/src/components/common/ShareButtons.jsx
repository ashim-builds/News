"use client";

import { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";

export default function ShareButtons({ articleTitle, articleId }) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/samachar/${articleId}`;
    }
    return "";
  };

  const handleCopyLink = async () => {
    const url = getShareUrl();
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.warn("Clipboard copy failed:", err);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    const url = getShareUrl();
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: articleTitle || "स्मार्टसञ्चार समाचार",
          url: url,
        });
        return;
      } catch (err) {
        // Fallback to copy link if user cancelled
      }
    }
    handleCopyLink();
  };

  const shareUrl = getShareUrl();

  return (
    <div className="flex items-center gap-2 flex-wrap py-2">
      {/* Native Share on Mobile / Supported devices */}
      {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
        <button
          onClick={handleNativeShare}
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          title="Share Article"
        >
          <Share2 size={14} />
          <span>शेयर गर्नुहोस्</span>
        </button>
      )}

      {/* Copy Link Button (Always visible on mobile & desktop) */}
      <button
        onClick={handleCopyLink}
        type="button"
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
          copied
            ? "bg-green-50 text-green-700 border-green-300"
            : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200 shadow-2xs"
        }`}
        title="Copy Link to Clipboard"
      >
        {copied ? (
          <>
            <Check size={14} className="text-green-600" />
            <span>कपि भयो!</span>
          </>
        ) : (
          <>
            <Copy size={14} className="text-gray-500" />
            <span>लिङ्क कपि</span>
          </>
        )}
      </button>

      {/* WhatsApp Share */}
      <a
        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
          (articleTitle || "समाचार") + " " + shareUrl
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-green-50 hover:border-green-200 text-gray-600 hover:text-green-600 text-xs font-bold transition-all cursor-pointer shadow-2xs"
        title="WhatsApp मा शेयर गर्नुहोस्"
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.197 1.451 4.836 1.452 5.438 0 9.862-4.425 9.866-9.864.002-2.634-1.02-5.11-2.88-6.973C16.55 1.904 14.072.88 11.442.879 6.002.879 1.579 5.305 1.575 10.744c-.001 1.706.449 3.373 1.304 4.837L1.892 21.05l5.755-1.51l-.99.584z" />
        </svg>
        <span>WhatsApp</span>
      </a>

      {/* Facebook Share */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareUrl
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-blue-50 hover:border-blue-200 text-gray-600 hover:text-blue-600 text-xs font-bold transition-all cursor-pointer shadow-2xs"
        title="Facebook मा शेयर गर्नुहोस्"
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        <span>Facebook</span>
      </a>
    </div>
  );
}
