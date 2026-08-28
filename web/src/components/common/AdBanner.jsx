"use client";

import { useState, useEffect } from "react";
import GoogleAd from "./GoogleAd";

export default function AdBanner({ position = "header", adSlot, className = "" }) {
  const [ad, setAd] = useState(null);

  useEffect(() => {
    // If an explicit Google AdSense slot is passed as a prop, don't fetch custom banner
    if (adSlot) return;

    async function fetchAd() {
      try {
        const res = await fetch(`/api/ads?position=${position}&status=Active`);
        if (!res.ok) return;
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) return;
        const data = await res.json();
        if (data.success && Array.isArray(data.ads) && data.ads.length > 0) {
          setAd(data.ads[0]);
        }
      } catch (err) {
        console.error(`Error fetching ${position} ad:`, err);
      }
    }

    fetchAd();
  }, [position, adSlot]);

  // If explicit Google AdSlot is provided, render GoogleAd component
  if (adSlot) {
    return <GoogleAd adSlot={adSlot} className={className} />;
  }

  const handleClick = () => {
    if (ad && ad._id) {
      fetch(`/api/ads/${ad._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "click" }),
      }).catch((err) => console.error("Ad click record error:", err));
    }
  };

  if (!ad) {
    // If Google AdSense is configured globally, render the fallback AdSense unit
    const fallbackAdSlot = process.env.NEXT_PUBLIC_GOOGLE_AD_SLOT;
    const adSenseId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;

    if (adSenseId && fallbackAdSlot) {
      return <GoogleAd adSlot={fallbackAdSlot} className={className} />;
    }

    // Default placeholder state if no custom ad is active
    if (position === "header") {
      return (
        <div className={`hidden md:flex bg-gray-100 items-center justify-center h-20 w-[450px] lg:w-[600px] text-gray-400 border border-gray-200 rounded-lg text-xs font-semibold ${className}`}>
          <span>विज्ञापन स्थान (९७० x ९०)</span>
        </div>
      );
    }

    if (position === "sidebar") {
      return (
        <div className={`bg-gray-100 flex flex-col items-center justify-center h-60 w-full text-gray-400 border border-gray-200 rounded-xl text-xs font-semibold ${className}`}>
          <span>विज्ञापन स्थान</span>
          <span className="text-base font-bold text-gray-500 mt-1">३०० x २५०</span>
        </div>
      );
    }

    return (
      <div className={`w-full bg-gray-100 h-24 flex items-center justify-center text-gray-400 border border-gray-200 rounded-xl text-xs font-semibold ${className}`}>
        <span className="mr-2">विज्ञापन स्थान</span>
        <span className="text-base font-bold text-gray-500">९७० x ९०</span>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-xl shadow-xs border border-gray-200 ${className}`}>
      {ad.linkUrl ? (
        <a
          href={ad.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="block w-full h-full hover:opacity-95 transition-opacity"
        >
          <img
            src={ad.imageUrl}
            alt={ad.title || "Advertisement"}
            className="w-full h-full object-cover"
          />
        </a>
      ) : (
        <img
          src={ad.imageUrl}
          alt={ad.title || "Advertisement"}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
}
