"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import AdBanner from "@/components/common/AdBanner";

export default function Header() {
  return (
    <div className="w-full bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          {/* Logo mark */}
          <div className="relative shrink-0">
            <div className="w-20 h-20">
              <img
                src="/logo.jpg"
                alt="Smart Sanchar Logo"
                className="w-full h-full object-cover"
              />
            </div>
            {/* small book icon overlay */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center border-2 border-white">
              <BookOpen size={12} className="text-white" />
            </div>
          </div>

          {/* Wordmark */}
          <div className="flex flex-col">
            <span
              className="text-4xl font-black leading-none tracking-tight text-gray-900"
              style={{
                fontFamily: "'Mukta', 'Noto Sans Devanagari', sans-serif",
              }}
            >
              Smart Sanchar
            </span>
            <span className="text-[10px] text-gray-500 tracking-widest font-medium mt-0.5 uppercase">
              www.smartsanchar.com
            </span>
          </div>
        </Link>

        {/* Tagline (center) */}
        <div className="hidden lg:flex flex-col items-center">
          <p className="text-sm text-gray-500 italic font-medium">
            जहाँ पुग्छ आवाज, त्यहाँ हाम्रो समाचार
          </p>
        </div>

        {/* Ad banner */}
        <AdBanner position="header" />
      </div>
    </div>
  );
}
