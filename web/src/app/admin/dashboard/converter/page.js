"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Languages,
  ArrowRightLeft,
  Copy,
  Check,
  ClipboardPaste,
  Trash2,
  Sparkles,
  BookOpen,
  Keyboard,
  FileText,
  Send,
  HelpCircle,
  RotateCcw,
} from "lucide-react";
import {
  preetiToUnicode,
  unicodeToPreeti,
  romanizedToUnicode,
  getTextStats,
} from "@/lib/nepaliConverter";

export default function UnicodeConverterPage() {
  const router = useRouter();

  // Active Main Tab: "preeti" | "romanized" | "guide"
  const [activeTab, setActiveTab] = useState("preeti");

  // Preeti Tab State
  // mode: "preetiToUnicode" | "unicodeToPreeti"
  const [conversionMode, setConversionMode] = useState("preetiToUnicode");
  const [preetiInput, setPreetiInput] = useState("");
  const [preetiOutput, setPreetiOutput] = useState("");
  const [copiedPreeti, setCopiedPreeti] = useState(false);

  // Romanized Tab State
  const [romanInput, setRomanInput] = useState("");
  const [romanOutput, setRomanOutput] = useState("");
  const [copiedRoman, setCopiedRoman] = useState(false);

  // Sample texts for quick testing
  const samplePreeti = "d]/f] b]z g]kfn xf] . sf7df8f}+ g]kfnsf] /fhwfgL xf] . :df6{ ;~rf/ ;dfrf/ kf]6{n !";
  const sampleUnicode = "मेरो देश नेपाल हो । काठमाडौं नेपालको राजधानी हो । स्मार्ट सञ्चार समाचार पोर्टल !";
  const sampleRoman = "nepal hamro sundar desh ho. smart sanchar taja samachar patrika.";

  // Handle Preeti / Unicode live conversion
  useEffect(() => {
    if (!preetiInput) {
      setPreetiOutput("");
      return;
    }

    if (conversionMode === "preetiToUnicode") {
      setPreetiOutput(preetiToUnicode(preetiInput));
    } else {
      setPreetiOutput(unicodeToPreeti(preetiInput));
    }
  }, [preetiInput, conversionMode]);

  // Handle Romanized live conversion
  useEffect(() => {
    if (!romanInput) {
      setRomanOutput("");
      return;
    }
    setRomanOutput(romanizedToUnicode(romanInput));
  }, [romanInput]);

  // Swap Conversion Direction
  const handleSwapPreetiMode = () => {
    const newMode =
      conversionMode === "preetiToUnicode"
        ? "unicodeToPreeti"
        : "preetiToUnicode";
    setConversionMode(newMode);
    // Swap input and output text
    if (preetiOutput) {
      setPreetiInput(preetiOutput);
    }
  };

  // Copy helper
  const handleCopyText = async (text, setCopiedFn) => {
    if (!text) return;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopiedFn(true);
      setTimeout(() => setCopiedFn(false), 2000);
    } catch (err) {
      console.warn("Failed to copy:", err);
    }
  };

  // Paste helper
  const handlePasteTo = async (setTextFn) => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setTextFn((prev) => (prev ? prev + "\n" + text : text));
        }
      }
    } catch (err) {
      console.warn("Failed to read clipboard:", err);
    }
  };

  // Copy and redirect to News Creation
  const handleUseInNews = async (text) => {
    if (!text) return;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      }
    } catch (e) {
      // Ignore
    }
    router.push("/admin/dashboard/news");
  };

  const preetiInStats = getTextStats(preetiInput);
  const preetiOutStats = getTextStats(preetiOutput);
  const romanInStats = getTextStats(romanInput);
  const romanOutStats = getTextStats(romanOutput);

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
            नेपाली युनिकोड कन्भर्टर (Nepali Unicode Studio)
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            प्रिती फन्टलाई युनिकोडमा र अङ्ग्रेजी (रोमानिफाइड) लाई नेपालीमा तुरुन्त रूपान्तरण गर्नुहोस्।
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleUseInNews(preetiOutput || romanOutput)}
            disabled={!preetiOutput && !romanOutput}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            title="नतिजा कपि गरी नयाँ समाचारमा जानुहोस्"
          >
            <FileText size={15} />
            <span>समाचारमा प्रयोग गर्नुहोस् (Use in News)</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white p-1.5 rounded-2xl border border-gray-200 shadow-2xs flex flex-wrap gap-1.5">
        <button
          onClick={() => setActiveTab("preeti")}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === "preeti"
              ? "bg-red-600 text-white shadow-xs"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          <Languages size={16} />
          <span>प्रिती ⇄ युनिकोड (Preeti & Unicode)</span>
        </button>

        <button
          onClick={() => setActiveTab("romanized")}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === "romanized"
              ? "bg-red-600 text-white shadow-xs"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          <Keyboard size={16} />
          <span>रोमानिफाइड ➔ युनिकोड (English to Nepali)</span>
        </button>

        <button
          onClick={() => setActiveTab("guide")}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === "guide"
              ? "bg-red-600 text-white shadow-xs"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          <BookOpen size={16} />
          <span>किबोर्ड गाइड (Guide)</span>
        </button>
      </div>

      {/* TAB 1: PREETI <-> UNICODE */}
      {activeTab === "preeti" && (
        <div className="space-y-4">
          {/* Mode Switcher Bar */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                रूपान्तरण दिशा:
              </span>
              <div className="inline-flex p-1 bg-gray-100 rounded-xl">
                <button
                  onClick={() => setConversionMode("preetiToUnicode")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    conversionMode === "preetiToUnicode"
                      ? "bg-white text-red-600 shadow-2xs font-extrabold"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  प्रिती ➔ युनिकोड
                </button>
                <button
                  onClick={() => setConversionMode("unicodeToPreeti")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    conversionMode === "unicodeToPreeti"
                      ? "bg-white text-red-600 shadow-2xs font-extrabold"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  युनिकोड ➔ प्रिती
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleSwapPreetiMode}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                title="दिशा र पाठ साटासाट गर्नुहोस्"
              >
                <ArrowRightLeft size={14} className="text-red-600" />
                <span>साटासाट (Swap)</span>
              </button>

              <button
                onClick={() =>
                  setPreetiInput(
                    conversionMode === "preetiToUnicode"
                      ? samplePreeti
                      : sampleUnicode
                  )
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                title="नमूना पाठ लोड गर्नुहोस्"
              >
                <Sparkles size={14} className="text-amber-500" />
                <span>नमूना पाठ (Sample)</span>
              </button>
            </div>
          </div>

          {/* Dual Textarea Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Input Box */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs flex flex-col overflow-hidden">
              <div className="p-3.5 bg-gray-50/80 border-b border-gray-200 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <span className="text-xs font-extrabold text-gray-800 uppercase tracking-wider">
                    {conversionMode === "preetiToUnicode"
                      ? "प्रिती फन्ट इनपुट (Preeti Source)"
                      : "युनिकोड इनपुट (Unicode Source)"}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handlePasteTo(setPreetiInput)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors cursor-pointer"
                    title="क्लिपबोर्डबाट पेस्ट गर्नुहोस्"
                  >
                    <ClipboardPaste size={12} />
                    <span>पेस्ट (Paste)</span>
                  </button>

                  {preetiInput && (
                    <button
                      type="button"
                      onClick={() => setPreetiInput("")}
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
                value={preetiInput}
                onChange={(e) => setPreetiInput(e.target.value)}
                placeholder={
                  conversionMode === "preetiToUnicode"
                    ? "यहाँ प्रिती फन्टको पाठ पेस्ट गर्नुहोस् वा टाइप गर्नुहोस् (e.g. d]/f] b]z g]kfn)..."
                    : "यहाँ नेपाली युनिकोड पाठ पेस्ट गर्नुहोस् (e.g. मेरो देश नेपाल)..."
                }
                rows={12}
                className="w-full p-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none resize-y font-mono leading-relaxed"
              ></textarea>

              <div className="px-4 py-2 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 font-medium">
                <span>
                  अक्षर: <b>{preetiInStats.chars}</b> | शब्द:{" "}
                  <b>{preetiInStats.words}</b> | हरफ:{" "}
                  <b>{preetiInStats.lines}</b>
                </span>
                <span className="text-gray-400">लाइभ रूपान्तरण सक्रिय</span>
              </div>
            </div>

            {/* Output Box */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs flex flex-col overflow-hidden">
              <div className="p-3.5 bg-gray-50/80 border-b border-gray-200 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                  <span className="text-xs font-extrabold text-gray-800 uppercase tracking-wider">
                    {conversionMode === "preetiToUnicode"
                      ? "नेपाली युनिकोड नतिजा (Unicode Result)"
                      : "प्रिती फन्ट नतिजा (Preeti Result)"}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      handleCopyText(preetiOutput, setCopiedPreeti)
                    }
                    disabled={!preetiOutput}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer border ${
                      copiedPreeti
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-white text-gray-700 hover:bg-gray-100 border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    }`}
                    title="नतिजा कपि गर्नुहोस्"
                  >
                    {copiedPreeti ? (
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
                value={preetiOutput}
                placeholder="रूपान्तरित पाठ यहाँ देखिनेछ..."
                rows={12}
                className="w-full p-4 text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none resize-y leading-relaxed font-sans"
              ></textarea>

              <div className="px-4 py-2 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 font-medium">
                <span>
                  अक्षर: <b>{preetiOutStats.chars}</b> | शब्द:{" "}
                  <b>{preetiOutStats.words}</b> | हरफ:{" "}
                  <b>{preetiOutStats.lines}</b>
                </span>
                {preetiOutput && (
                  <button
                    onClick={() => handleUseInNews(preetiOutput)}
                    className="text-red-600 hover:text-red-700 font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>समाचारमा पठाउनुहोस्</span>
                    <ChevronRight size={12} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ROMANIZED ENGLISH TO NEPALI */}
      {activeTab === "romanized" && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Keyboard size={16} className="text-red-600" />
                <span>अङ्ग्रेजी टाइपिङबाट नेपाली युनिकोड (Phonetic Romanized Typing)</span>
              </h3>
              <p className="text-xs text-gray-500">
                अङ्ग्रेजी अक्षरमा उच्चारण अनुसार टाइप गर्नुहोस् (e.g. <b>nepal ma smart sanchar</b> ➔ <b>नेपाल मा स्मार्ट सञ्चार</b>)।
              </p>
            </div>

            <button
              onClick={() => setRomanInput(sampleRoman)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0"
              title="नमूना लोड गर्नुहोस्"
            >
              <Sparkles size={14} className="text-amber-500" />
              <span>नमूना वाक्य (Sample)</span>
            </button>
          </div>

          {/* Dual Textarea Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Romanized Input */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs flex flex-col overflow-hidden">
              <div className="p-3.5 bg-gray-50/80 border-b border-gray-200 flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-extrabold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                  अङ्ग्रेजी (Romanized English)
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handlePasteTo(setRomanInput)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors cursor-pointer"
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
                placeholder="यहाँ अङ्ग्रेजीमा टाइप गर्नुहोस् (e.g. namaste kathmandu ma samachar)..."
                rows={12}
                className="w-full p-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none resize-y font-mono leading-relaxed"
              ></textarea>

              <div className="px-4 py-2 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 font-medium">
                <span>
                  अक्षर: <b>{romanInStats.chars}</b> | शब्द:{" "}
                  <b>{romanInStats.words}</b>
                </span>
                <span className="text-gray-400">तुरुन्त अनुवाद हुँदैछ</span>
              </div>
            </div>

            {/* Unicode Output */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs flex flex-col overflow-hidden">
              <div className="p-3.5 bg-gray-50/80 border-b border-gray-200 flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-extrabold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                  नेपाली युनिकोड (Nepali Unicode)
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      handleCopyText(romanOutput, setCopiedRoman)
                    }
                    disabled={!romanOutput}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer border ${
                      copiedRoman
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-white text-gray-700 hover:bg-gray-100 border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    }`}
                    title="नतिजा कपि गर्नुहोस्"
                  >
                    {copiedRoman ? (
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
                value={romanOutput}
                placeholder="नेपाली रूपान्तरण यहाँ स्वतः देखिनेछ..."
                rows={12}
                className="w-full p-4 text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none resize-y leading-relaxed font-sans"
              ></textarea>

              <div className="px-4 py-2 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 font-medium">
                <span>
                  अक्षर: <b>{romanOutStats.chars}</b> | शब्द:{" "}
                  <b>{romanOutStats.words}</b>
                </span>
                {romanOutput && (
                  <button
                    onClick={() => handleUseInNews(romanOutput)}
                    className="text-red-600 hover:text-red-700 font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>समाचारमा प्रयोग गर्नुहोस्</span>
                    <ChevronRight size={12} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: KEYBOARD & SYMBOL GUIDE */}
      {activeTab === "guide" && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2 mb-1">
              <BookOpen size={18} className="text-red-600" />
              <span>प्रिती फन्ट र युनिकोड अक्षर सन्दर्भ तालिका (Keyboard Cheat Sheet)</span>
            </h3>
            <p className="text-xs text-gray-500">
              प्रिती फन्टमा कुन कुञ्जी (Key) दबाउँदा कुन नेपाली अक्षर बन्छ भन्ने जानकारी तल दिइएको छ।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs text-black">
            {/* Consonants Table */}
            <div className="border border-gray-300 rounded-xl overflow-hidden bg-white shadow-2xs">
              <div className="bg-gray-100 px-3.5 py-2.5 border-b border-gray-300 font-extrabold text-black text-xs uppercase tracking-wider">
                व्यञ्जन वर्ण (Consonants)
              </div>
              <div className="p-3.5 grid grid-cols-2 gap-2.5 text-black font-semibold">
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">s</kbd> <span className="text-black font-bold">= क</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">v</kbd> <span className="text-black font-bold">= ख</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">u</kbd> <span className="text-black font-bold">= ग</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">#</kbd> <span className="text-black font-bold">= घ</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">r</kbd> <span className="text-black font-bold">= च</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">%</kbd> <span className="text-black font-bold">= छ</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">h</kbd> <span className="text-black font-bold">= ज</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">^</kbd> <span className="text-black font-bold">= ट</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">&</kbd> <span className="text-black font-bold">= ठ</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">*</kbd> <span className="text-black font-bold">= ड</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">(</kbd> <span className="text-black font-bold">= ढ</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">)</kbd> <span className="text-black font-bold">= ण</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">t</kbd> <span className="text-black font-bold">= त</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">y</kbd> <span className="text-black font-bold">= थ</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">b</kbd> <span className="text-black font-bold">= द</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">w</kbd> <span className="text-black font-bold">= ध</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">g</kbd> <span className="text-black font-bold">= न</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">k</kbd> <span className="text-black font-bold">= प</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">m</kbd> <span className="text-black font-bold">= फ</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">a</kbd> <span className="text-black font-bold">= ब</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">e</kbd> <span className="text-black font-bold">= भ</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">d</kbd> <span className="text-black font-bold">= म</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">o</kbd> <span className="text-black font-bold">= य</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">/</kbd> <span className="text-black font-bold">= र</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">n</kbd> <span className="text-black font-bold">= ल</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">j</kbd> <span className="text-black font-bold">= व</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">z</kbd> <span className="text-black font-bold">= श</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">;</kbd> <span className="text-black font-bold">= स</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">x</kbd> <span className="text-black font-bold">= ह</span></div>
              </div>
            </div>

            {/* Matras Table */}
            <div className="border border-gray-300 rounded-xl overflow-hidden bg-white shadow-2xs">
              <div className="bg-gray-100 px-3.5 py-2.5 border-b border-gray-300 font-extrabold text-black text-xs uppercase tracking-wider">
                मात्रा तथा स्वर (Vowels & Matras)
              </div>
              <div className="p-3.5 grid grid-cols-2 gap-2.5 text-black font-semibold">
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">f</kbd> <span className="text-black font-bold">= ा (आकार)</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">l</kbd> <span className="text-black font-bold">= ि (ह्रस्व)</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">L</kbd> <span className="text-black font-bold">= ी (दीर्घ)</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">'</kbd> <span className="text-black font-bold">= ु (ह्रस्व)</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">"</kbd> <span className="text-black font-bold">= ू (दीर्घ)</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">]</kbd> <span className="text-black font-bold">= े (एकार)</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">&#125;</kbd> <span className="text-black font-bold">= ै (ऐकार)</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">f]</kbd> <span className="text-black font-bold">= ो (ओकार)</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">f&#125;</kbd> <span className="text-black font-bold">= ौ (औकार)</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">+</kbd> <span className="text-black font-bold">= ं (शिरविन्दु)</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">F</kbd> <span className="text-black font-bold">= ँ (चन्द्रविन्दु)</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">c</kbd> <span className="text-black font-bold">= अ</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">cf</kbd> <span className="text-black font-bold">= आ</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">O</kbd> <span className="text-black font-bold">= इ</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">O&#123;</kbd> <span className="text-black font-bold">= ई</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">p</kbd> <span className="text-black font-bold">= उ</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">P</kbd> <span className="text-black font-bold">= ए</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">cf]</kbd> <span className="text-black font-bold">= ओ</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">cf&#125;</kbd> <span className="text-black font-bold">= औ</span></div>
              </div>
            </div>

            {/* Special & Conjuncts */}
            <div className="border border-gray-300 rounded-xl overflow-hidden bg-white shadow-2xs">
              <div className="bg-gray-100 px-3.5 py-2.5 border-b border-gray-300 font-extrabold text-black text-xs uppercase tracking-wider">
                संयुक्त तथा विशेष वर्ण (Conjuncts)
              </div>
              <div className="p-3.5 grid grid-cols-2 gap-2.5 text-black font-semibold">
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">q</kbd> <span className="text-black font-bold">= त्र</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">!</kbd> <span className="text-black font-bold">= ज्ञ</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">I</kbd> <span className="text-black font-bold">= क्ष</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">&gt;</kbd> <span className="text-black font-bold">= श्र</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">&#123;</kbd> <span className="text-black font-bold">= र् (रेफ)</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">|</kbd> <span className="text-black font-bold">= ्र (रकार)</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">qm</kbd> <span className="text-black font-bold">= क्र</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">Q</kbd> <span className="text-black font-bold">= त्त</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">$</kbd> <span className="text-black font-bold">= द्ध</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">@</kbd> <span className="text-black font-bold">= द्द</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">B</kbd> <span className="text-black font-bold">= द्य</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">.</kbd> <span className="text-black font-bold">= । (पूर्णविराम)</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">?</kbd> <span className="text-black font-bold">= रु</span></div>
                <div className="flex items-center gap-1.5 text-black"><kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-black font-mono font-bold shadow-2xs">?n</kbd> <span className="text-black font-bold">= रू</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
