"use client";

import { useEffect, useRef } from "react";

export default function GoogleAd({
  adClient = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID || "ca-pub-XXXXXXXXXXXXXXXX",
  adSlot,
  adFormat = "auto",
  fullWidthResponsive = "true",
  className = "",
}) {
  const adRef = useRef(null);

  useEffect(() => {
    const handlePush = () => {
      try {
        if (typeof window !== "undefined" && adSlot && adRef.current) {
          // Skip if the element is currently hidden or has 0 width (avoids No slot size for availableWidth=0)
          const offsetWidth = adRef.current.offsetWidth;
          if (offsetWidth === 0) {
            console.warn(`AdSense skipped for slot ${adSlot} because container width is 0.`);
            return;
          }

          // Avoid pushing duplicate configurations if the tag was already processed
          if (adRef.current.getAttribute("data-adsbygoogle-status") === "done") {
            return;
          }

          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (err) {
        console.error("Google AdSense error:", err);
      }
    };

    // Use a short delay to allow Next.js to mount layouts and Tailwind to paint styling
    const timer = setTimeout(handlePush, 200);

    return () => clearTimeout(timer);
  }, [adSlot]);

  if (!adSlot) {
    return (
      <div className={`p-4 bg-gray-50 border border-dashed border-gray-300 rounded-xl text-center text-xs text-gray-400 font-mono ${className}`}>
        Google AdSense Unit (Set <code className="bg-gray-100 px-1 py-0.5 rounded text-red-500">adSlot</code> &amp; <code className="bg-gray-100 px-1 py-0.5 rounded text-red-500">NEXT_PUBLIC_GOOGLE_ADSENSE_ID</code>)
      </div>
    );
  }

  return (
    <div className={`overflow-hidden text-center my-4 w-full ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block", width: "100%", height: "100%" }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive}
      />
    </div>
  );
}
