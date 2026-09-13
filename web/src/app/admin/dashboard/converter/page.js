"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Copy,
  Check,
  ClipboardPaste,
  Trash2,
  Sparkles,
  BookOpen,
  Keyboard,
  FileText,
} from "lucide-react";
import {
  romanizedToUnicode,
  getTextStats,
} from "@/lib/nepaliConverter";

export default function UnicodeConverterPage() {
  const router = useRouter();

  // State
  const [romanInput, setRomanInput] = useState("");
  const [nepaliOutput, setNepaliOutput] = useState("");
  const [copied, setCopied] = useState(false);

  // Sample phrases for testing
  const samplePhrases = [
    { label: "नेपाल", text: "nepal hamro sundar desh ho." },
    { label: "समाचार", text: "smart sanchar taja samachar patrika." },
    { label: "काठमाडौं", text: "nepal ko rajdhani kathmandu ho." },
    { label: "नमस्ते", text: "namaste, tapaiko din subha rahos." },
  ];

  // Live conversion as the user types
  useEffect(() => {
    if (!romanInput) {
      setNepaliOutput("");
      return;
    }
    setNepaliOutput(romanizedToUnicode(romanInput));
  }, [romanInput]);

  // Copy helper
  const handleCopyText = async () => {
    if (!nepaliOutput) return;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(nepaliOutput);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = nepaliOutput;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.warn("Failed to copy:", err);
    }
  };

  // Paste helper
  const handlePaste = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setRomanInput((prev) => (prev ? prev + "\n" + text : text));
        }
      }
    } catch (err) {
      console.warn("Failed to read clipboard:", err);
    }
  };

  // Copy and redirect to News Creation
  const handleUseInNews = async () => {
    if (!nepaliOutput) return;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(nepaliOutput);
      }
    } catch (e) {
      // Ignore
    }
    router.push("/admin/dashboard/news");
  };

  const inStats = getTextStats(romanInput);
  const outStats = getTextStats(nepaliOutput);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Breadcrumb & Header Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 font-medium">
            <Link href="/" className="hover:text-red-600 transition-colors">
              गृह
            </Link>
            <ChevronRight size={12} className="text-gray-400" />
            <Link
              href="/admin/dashboard"
              className="hover:text-red-600 transition-colors"
            >
              प्रशासक नियन्त्रण कक्ष
            </Link>
            <ChevronRight size={12} className="text-gray-400" />
            <span className="text-gray-900 font-bold">युनिकोड कन्भर्टर</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <div className="w-3 h-8 bg-red-600 rounded-sm"></div>
            रोमन टु नेपाली युनिकोड कन्भर्टर (Roman to Nepali Unicode)
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            अङ्ग्रेजी (रोमन) मा टाइप गर्नुहोस् र तुरुन्त शुद्ध नेपाली युनिकोड अक्षर पाउनुहोस्।
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleUseInNews}
            disabled={!nepaliOutput}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            title="नतिजा कपि गरी नयाँ समाचारमा जानुहोस्"
          >
            <FileText size={15} />
            <span>समाचारमा प्रयोग गर्नुहोस् (Use in News)</span>
          </button>
        </div>
      </div>

      {/* Quick Sample Chips Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-2xs flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
            <Sparkles size={14} className="text-amber-500" />
            <span>छिटो नमूना (Samples):</span>
          </span>
          {samplePhrases.map((phrase, idx) => (
            <button
              key={idx}
              onClick={() => setRomanInput(phrase.text)}
              className="text-xs font-bold text-gray-700 bg-gray-100 hover:bg-red-50 hover:text-red-600 px-3 py-1 rounded-lg transition-colors cursor-pointer border border-gray-200"
            >
              {phrase.label}
            </button>
          ))}
        </div>

        {romanInput && (
          <button
            onClick={() => setRomanInput("")}
            className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Trash2 size={13} />
            <span>सबै मेटाउनुहोस् (Clear)</span>
          </button>
        )}
      </div>

      {/* Dual Textarea Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Roman Input Box */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs flex flex-col overflow-hidden">
          <div className="p-3.5 bg-gray-50/80 border-b border-gray-200 flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-extrabold text-gray-800 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              अङ्ग्रेजी इनपुट (Type in English / Roman)
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePaste}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors cursor-pointer border border-red-100"
                title="क्लिपबोर्डबाट पेस्ट गर्नुहोस्"
              >
                <ClipboardPaste size={12} />
                <span>पेस्ट (Paste)</span>
              </button>

              {romanInput && (
                <button
                  type="button"
                  onClick={() => setRomanInput("")}
                  className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-bold text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                  title="खाली गर्नुहोस्"
                >
                  <Trash2 size={12} />
                  <span>खाली</span>
                </button>
              )}
            </div>
          </div>

          <textarea
            value={romanInput}
            onChange={(e) => setRomanInput(e.target.value)}
            placeholder="यहाँ अङ्ग्रेजीमा टाइप गर्नुहोस् (e.g. nepal ma smart sanchar taja samachar patrika)..."
            rows={12}
            className="w-full p-4 text-sm text-black placeholder-gray-400 focus:outline-none resize-y font-mono leading-relaxed"
          ></textarea>

          <div className="px-4 py-2.5 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600 font-medium">
            <span>
              अक्षर: <b className="text-black">{inStats.chars}</b> | शब्द:{" "}
              <b className="text-black">{inStats.words}</b>
            </span>
            <span className="text-blue-600 font-bold">तुरुन्त अनुवाद हुँदैछ (Live)</span>
          </div>
        </div>

        {/* Nepali Unicode Output Box */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs flex flex-col overflow-hidden">
          <div className="p-3.5 bg-gray-50/80 border-b border-gray-200 flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-extrabold text-gray-800 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
              नेपाली युनिकोड (Nepali Unicode Output)
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCopyText}
                disabled={!nepaliOutput}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer border ${
                  copied
                    ? "bg-green-600 text-white border-green-600 shadow-xs"
                    : "bg-white text-gray-800 hover:bg-gray-100 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                }`}
                title="नतिजा कपि गर्नुहोस्"
              >
                {copied ? (
                  <>
                    <Check size={13} />
                    <span>कपि भयो!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>कपि गर्नुहोस् (Copy)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <textarea
            readOnly
            value={nepaliOutput}
            placeholder="नेपाली युनिकोड रूपान्तरण यहाँ स्वतः देखिनेछ..."
            rows={12}
            className="w-full p-4 text-base text-black bg-white placeholder-gray-400 focus:outline-none resize-y leading-relaxed font-sans font-medium"
          ></textarea>

          <div className="px-4 py-2.5 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600 font-medium">
            <span>
              अक्षर: <b className="text-black">{outStats.chars}</b> | शब्द:{" "}
              <b className="text-black">{outStats.words}</b>
            </span>
            {nepaliOutput && (
              <button
                onClick={handleUseInNews}
                className="text-red-600 hover:text-red-700 font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>समाचारमा प्रयोग गर्नुहोस्</span>
                <ChevronRight size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ROMAN TO NEPALI TYPING GUIDE (ALL TEXT IN SOLID BLACK) */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
        <div>
          <h3 className="text-base font-extrabold text-black flex items-center gap-2 mb-1">
            <BookOpen size={18} className="text-red-600" />
            <span>रोमन टु नेपाली टाइपिङ गाइड (Roman to Nepali Typing Guide)</span>
          </h3>
          <p className="text-xs text-gray-600">
            अङ्ग्रेजी अक्षरहरू टाइप गर्दा कुन नेपाली अक्षर बन्छ भन्ने जानकारी तल दिइएको छ।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs text-black">
          {/* Consonants Table */}
          <div className="border border-gray-300 rounded-xl overflow-hidden bg-white shadow-2xs">
            <div className="bg-gray-100 px-3.5 py-2.5 border-b border-gray-300 font-extrabold text-black text-xs uppercase tracking-wider">
              व्यञ्जन वर्ण (Consonants)
            </div>
            <div className="p-3.5 grid grid-cols-2 gap-2.5 text-black font-semibold">
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">k</kbd> <span className="text-black font-bold">= क</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">kh</kbd> <span className="text-black font-bold">= ख</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">g</kbd> <span className="text-black font-bold">= ग</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">gh</kbd> <span className="text-black font-bold">= घ</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">ng</kbd> <span className="text-black font-bold">= ङ</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">ch</kbd> <span className="text-black font-bold">= च</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">chh</kbd> <span className="text-black font-bold">= छ</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">j</kbd> <span className="text-black font-bold">= ज</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">jh</kbd> <span className="text-black font-bold">= झ</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">T</kbd> <span className="text-black font-bold">= ट</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">Th</kbd> <span className="text-black font-bold">= ठ</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">D</kbd> <span className="text-black font-bold">= ड</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">Dh</kbd> <span className="text-black font-bold">= ढ</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">N</kbd> <span className="text-black font-bold">= ण</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">t</kbd> <span className="text-black font-bold">= त</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">th</kbd> <span className="text-black font-bold">= थ</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">d</kbd> <span className="text-black font-bold">= द</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">dh</kbd> <span className="text-black font-bold">= ध</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">n</kbd> <span className="text-black font-bold">= न</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">p</kbd> <span className="text-black font-bold">= प</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">ph / f</kbd> <span className="text-black font-bold">= फ</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">b</kbd> <span className="text-black font-bold">= ब</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">bh</kbd> <span className="text-black font-bold">= भ</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">m</kbd> <span className="text-black font-bold">= म</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">y</kbd> <span className="text-black font-bold">= य</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">r</kbd> <span className="text-black font-bold">= र</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">l</kbd> <span className="text-black font-bold">= ल</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">w / v</kbd> <span className="text-black font-bold">= व</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">sh</kbd> <span className="text-black font-bold">= श</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">Sh</kbd> <span className="text-black font-bold">= ष</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">s</kbd> <span className="text-black font-bold">= स</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">h</kbd> <span className="text-black font-bold">= ह</span></div>
            </div>
          </div>

          {/* Vowels and Matras Table */}
          <div className="border border-gray-300 rounded-xl overflow-hidden bg-white shadow-2xs">
            <div className="bg-gray-100 px-3.5 py-2.5 border-b border-gray-300 font-extrabold text-black text-xs uppercase tracking-wider">
              स्वर तथा मात्रा (Vowels & Matras)
            </div>
            <div className="p-3.5 grid grid-cols-2 gap-2.5 text-black font-semibold">
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">a</kbd> <span className="text-black font-bold">= अ</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">aa / A</kbd> <span className="text-black font-bold">= आ / ा</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">i</kbd> <span className="text-black font-bold">= इ / ि</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">ee / I</kbd> <span className="text-black font-bold">= ई / ी</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">u</kbd> <span className="text-black font-bold">= उ / ु</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">oo / U</kbd> <span className="text-black font-bold">= ऊ / ू</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">e</kbd> <span className="text-black font-bold">= ए / े</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">ai</kbd> <span className="text-black font-bold">= ऐ / ै</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">o</kbd> <span className="text-black font-bold">= ओ / ो</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">au</kbd> <span className="text-black font-bold">= औ / ौ</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">am / an</kbd> <span className="text-black font-bold">= अं / ं</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">ah</kbd> <span className="text-black font-bold">= अः / ः</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">ri / Ri</kbd> <span className="text-black font-bold">= ऋ / ृ</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">0-9</kbd> <span className="text-black font-bold">= ०-९</span></div>
            </div>
          </div>

          {/* Special & Conjuncts Table */}
          <div className="border border-gray-300 rounded-xl overflow-hidden bg-white shadow-2xs">
            <div className="bg-gray-100 px-3.5 py-2.5 border-b border-gray-300 font-extrabold text-black text-xs uppercase tracking-wider">
              संयुक्त तथा विशेष वर्ण (Conjuncts)
            </div>
            <div className="p-3.5 grid grid-cols-2 gap-2.5 text-black font-semibold">
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">ksha</kbd> <span className="text-black font-bold">= क्ष</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">tra</kbd> <span className="text-black font-bold">= त्र</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">gya</kbd> <span className="text-black font-bold">= ज्ञ</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">shree</kbd> <span className="text-black font-bold">= श्री</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">smart</kbd> <span className="text-black font-bold">= स्मार्ट</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">namaste</kbd> <span className="text-black font-bold">= नमस्ते</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">pradesh</kbd> <span className="text-black font-bold">= प्रदेश</span></div>
              <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">bikas</kbd> <span className="text-black font-bold">= विकास</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
