"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Heart, User } from "lucide-react";

const FOOTER_NAV = {
  "मुख्य विषयहरू": [
    { label: "ताजा समाचार", href: "/taja" },
    { label: "राजनीति", href: "/samachar" },
    { label: "अर्थतन्त्र", href: "/artha" },
    { label: "अपराध", href: "/apradh" },
    { label: "सूचना प्रविधि", href: "/it" },
    { label: "भिडियो ग्यालरी", href: "/videos" },
  ],
  "प्रदेश समाचार": [
    { label: "कोशी प्रदेश", href: "/province" },
    { label: "मधेश प्रदेश", href: "/province" },
    { label: "बागमती प्रदेश", href: "/province" },
    { label: "गण्डकी प्रदेश", href: "/province" },
    { label: "लुम्बिनी प्रदेश", href: "/province" },
    { label: "कर्णाली प्रदेश", href: "/province" },
    { label: "सुदूरपश्चिम", href: "/province" },
  ],
  "नेभिगेसन": [
    { label: "हाम्रो बारेमा", href: "#" },
    { label: "सम्पर्क", href: "#" },
    { label: "विज्ञापन", href: "#" },
    { label: "गोपनीयता नीति", href: "#" },
    { label: "सेवाका शर्तहरू", href: "#" },
  ],
};

export default function Footer() {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    async function loadPartners() {
      try {
        const res = await fetch("/api/partners");
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setPartners(data.data.filter((p) => p.status === "Active"));
        }
      } catch (err) {
        // Fallback silently if DB is connecting
      }
    }
    loadPartners();
  }, []);

  return (
    <footer className="w-full bg-linear-to-b from-gray-50 to-white border-t border-gray-200/80 mt-16 text-gray-700">
      {/* Top Main Section */}
      <div className="container mx-auto px-4 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand & About Column */}
          <div className="lg:col-span-2 flex flex-col items-start pr-2">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-gray-200/80 shadow-2xs group-hover:scale-105 transition-transform bg-white flex items-center justify-center p-1">
                <img
                  src="/logo.jpg"
                  alt="Smart Sanchar Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-gray-900 leading-none tracking-tight">
                  स्मार्ट सञ्चार
                </span>
                <span className="text-[11px] text-gray-400 font-semibold tracking-wider mt-0.5">
                  Smart Sanchar Media
                </span>
              </div>
            </Link>
            
            <p className="text-sm text-gray-600 leading-relaxed mb-6 max-w-md">
              जहाँ पुग्छ आवाज, त्यहाँ हाम्रो समाचार। नेपालको विश्वसनीय र उत्तरदायी डिजिटल समाचार माध्यम।
            </p>

            {/* Dynamic Partners / Team Pill Badge Display */}
            {partners.length > 0 && (
              <div className="w-full bg-white/80 border border-gray-200/60 rounded-2xl p-4 mb-6 shadow-2xs">
                <span className="text-xs font-bold text-gray-900 block mb-2.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  वर्किङ टिम तथा साझेदारहरू (Working Team & Partners)
                </span>
                <div className="flex flex-wrap gap-2">
                  {partners.map((p) => (
                    <span
                      key={p._id}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-800 text-xs font-medium rounded-full border border-blue-100/80"
                    >
                      {p.photoUrl && (p.photoUrl.startsWith("http") || p.photoUrl.startsWith("/") || p.photoUrl.startsWith("data:")) && (
                        <img
                          src={p.photoUrl}
                          alt={p.name}
                          className="w-4 h-4 rounded-full object-cover"
                        />
                      )}
                      <span>{p.name}</span>
                      {p.role && <span className="text-[10px] text-blue-500 font-normal">({p.role})</span>}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social Icons */}
            <div className="flex gap-2.5">
              <a
                href="https://www.facebook.com/smartsanchar"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-xl bg-white border border-gray-200/80 hover:bg-blue-600 hover:border-blue-600 hover:text-white flex items-center justify-center text-gray-600 shadow-2xs hover:scale-105 transition-all"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@smartsanchar"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-xl bg-white border border-gray-200/80 hover:bg-red-600 hover:border-red-600 hover:text-white flex items-center justify-center text-gray-600 shadow-2xs hover:scale-105 transition-all"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Link Columns */}
          {Object.entries(FOOTER_NAV).map(([heading, links]) => (
            <div key={heading} className="flex flex-col">
              <h3 className="text-gray-900 font-bold text-sm mb-4 pb-1.5 border-b border-gray-200/80 tracking-tight">
                {heading}
              </h3>
              <ul className="space-y-2.5 text-xs">
                {links.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1 group font-normal"
                    >
                      <ChevronRight
                        size={13}
                        className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform"
                      />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200/80 py-5 bg-white/70">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p className="flex items-center gap-1">
            © २०८३ स्मार्ट सञ्चार (Smart Sanchar)। सर्वाधिकार सुरक्षित।
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-gray-900 transition">
              गोपनीयता नीति
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="#" className="hover:text-gray-900 transition">
              सेवाका शर्तहरू
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href="/admin/login"
              title="एडमिन लगइन"
              aria-label="Admin Login"
              className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 font-bold transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
              <span>एडमिन पोर्टल</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}