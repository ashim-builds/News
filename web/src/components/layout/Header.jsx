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
            <div className="h-20 sm:h-24 md:h-28 flex items-center justify-center">
              <img
                src="/logo.jpg"
                alt="Smart Sanchar Logo"
                className="h-full w-auto object-contain"
              />
            </div>
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
