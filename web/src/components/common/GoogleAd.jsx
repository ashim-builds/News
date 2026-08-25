"use client";

import { useEffect } from "react";

export default function GoogleAd({
  adClient = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID || "ca-pub-XXXXXXXXXXXXXXXX",
  adSlot,
  adFormat = "auto",
  fullWidthResponsive = "true",
  className = "",
}) {
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && adSlot) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error("Google AdSense error:", err);
    }
  }, [adSlot]);

  if (!adSlot) {
    return (
      <div className={`p-4 bg-gray-50 border border-dashed border-gray-300 rounded-xl text-center text-xs text-gray-400 font-mono ${className}`}>
        Google AdSense Unit (Set <code className="bg-gray-100 px-1 py-0.5 rounded text-red-500">adSlot</code> &amp; <code className="bg-gray-100 px-1 py-0.5 rounded text-red-500">NEXT_PUBLIC_GOOGLE_ADSENSE_ID</code>)
      </div>
    );
  }

  return (
    <div className={`overflow-hidden text-center my-4 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive}
      />
    </div>
  );
}
