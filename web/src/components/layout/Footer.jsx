"use client";

import Link from "next/link";
import { ChevronRight, Newspaper, ShieldAlert } from "lucide-react";

const FOOTER_LINKS = {
  "समाचार": ["ताजा समाचार", "राजनीति", "अर्थतन्त्र", "खेलकुद", "मनोरञ्जन"],
  "प्रदेश": ["कोशी", "मधेश", "बागमती", "गण्डकी", "लुम्बिनी", "कर्णाली", "सुदूरपश्चिम"],
  "अन्य": ["हाम्रो बारेमा", "सम्पर्क", "विज्ञापन", "गोपनीयता नीति", "सेवाका शर्तहरू"],
};

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200 mt-12">
      {/* Top section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="md:col-span-1 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-gray-200 shadow-2xs">
                <img
                  src="/logo.jpg"
                  alt="Smart Sanchar Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-gray-900 leading-none">
                  स्मार्ट सञ्चार
                </span>
                <span className="text-[10px] text-gray-400 font-medium tracking-wider">
                  Smart Sanchar
                </span>
              </div>
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              जहाँ पुग्छ आवाज, त्यहाँ हाम्रो समाचार। नेपालको भरपर्दो अनलाइन समाचार पोर्टल।
            </p>
            {/* Social */}
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded bg-gray-100 hover:bg-blue-600 hover:text-white flex items-center justify-center text-gray-600 transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded bg-gray-100 hover:bg-gray-900 hover:text-white flex items-center justify-center text-gray-600 transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded bg-gray-100 hover:bg-red-600 hover:text-white flex items-center justify-center text-gray-600 transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" /></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded bg-gray-100 hover:bg-pink-600 hover:text-white flex items-center justify-center text-gray-600 transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" /></svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-gray-900 font-bold text-base mb-4 pb-2 border-b border-gray-200">
                {heading}
              </h3>
              <ul className="space-y-3">
                {links.map((l) => (
                  <li key={l}>
                    <Link href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1 group">
                      <ChevronRight size={14} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200 py-6 bg-gray-50">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © २०८३ स्मार्ट सञ्चार (Smart Sanchar)। सर्वाधिकार सुरक्षित।
          </p>
          <div className="flex items-center gap-5 text-sm text-gray-500">
            <Link href="#" className="hover:text-gray-900">गोपनीयता नीति</Link>
            <Link href="#" className="hover:text-gray-900">सेवाका शर्तहरू</Link>
            <Link
              href="/admin/login"
              title="एडमिन लगइन"
              aria-label="Admin Login"
              className="flex items-center justify-center p-1.5 rounded-lg hover:bg-red-50 transition-all text-red-600 hover:scale-110 ml-1"
            >
              <ShieldAlert className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}