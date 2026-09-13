/**
 * Nepali Unicode & Preeti Conversion Utility Library
 * For SmartSanchar Admin Dashboard
 */

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// -------------------------------------------------------------
// 1. PREETI TO UNICODE CONVERTER
// -------------------------------------------------------------
export function preetiToUnicode(input) {
  if (!input) return "";

  let text = input;

  // Pre-replacements for complex Preeti ligatures & multi-character groups
  const multiCharPreeti = [
    { p: "cf\\]", u: "औ" },
    { p: "cf\\}", u: "औ" },
    { p: "cf]", u: "ओ" },
    { p: "cf}", u: "औ" },
    { p: "cf", u: "आ" },
    { p: "c\\{", u: "ऋ" },
    { p: "c", u: "अ" },
    { p: "O{", u: "ई" },
    { p: "O", u: "इ" },
    { p: "P\\}", u: "ऐ" },
    { p: "P", u: "ए" },
    { p: "pm", u: "ऊ" },
    { p: "p", u: "उ" },
    { p: "f\\}", u: "ौ" },
    { p: "f\\'", u: "ो" },
    { p: "f]", u: "ो" },
    { p: "f}", u: "ौ" },
    { p: "f+", u: "ां" },
    { p: "fF", u: "ाँ" },
    { p: "?n", u: "रू" },
    { p: "?", u: "रु" },
    { p: "qm", u: "क्र" },
    { p: "Qm", u: "क्र" },
    { p: "Q", u: "त्त" },
    { p: "q", u: "त्र" },
    { p: "B", u: "द्य" },
    { p: "I", u: "क्ष" },
    { p: "!", u: "ज्ञ" },
    { p: "@", u: "द्द" },
    { p: "#", u: "घ" },
    { p: "$", u: "द्ध" },
    { p: "%", u: "छ" },
    { p: "^", u: "ट" },
    { p: "&", u: "ठ" },
    { p: "*", u: "ड" },
    { p: "(", u: "ढ" },
    { p: ")", u: "ण" },
    { p: ">", u: "श्र" },
    { p: "¡", u: "ज्ञ" },
    { p: "¢", u: "द्ध" },
    { p: "£", u: "घ" },
    { p: "¤", u: "झ" },
    { p: "¥", u: "छ" },
    { p: "¦", u: "ट" },
    { p: "§", u: "ठ" },
    { p: "©", u: "ण" },
    { p: "ª", u: "ङ" },
    { p: "µ", u: "क्त" },
    { p: "±", u: "ष्ट" },
    { p: "°", u: "त्त" },
    { p: "«", u: "“" },
    { p: "»", u: "”" },
    { p: "¿", u: "रु" },
  ];

  for (const item of multiCharPreeti) {
    text = text.replace(new RegExp(escapeRegex(item.p), "g"), item.u);
  }

  // Single character Preeti to Unicode map
  const singleMap = {
    "0": "०", "1": "१", "2": "२", "3": "३", "4": "४", "5": "५", "6": "६", "7": "७", "8": "८", "9": "९",
    a: "ब", b: "द", d: "म", e: "भ", f: "ा", g: "न", h: "ज", i: "ह", j: "व",
    k: "प", l: "ि", m: "फ", n: "ल", o: "य", r: "च", s: "क", t: "त", u: "ग",
    v: "ख", w: "ध", x: "ह", y: "थ", z: "श",
    A: "ब्", D: "म्", E: "भ्", F: "ँ", G: "न्", H: "ज्", J: "व्",
    K: "प्", L: "ी", M: "फ्", N: "ल्", R: "च्", S: "क्", T: "त्", U: "ग्",
    V: "ख्", W: "ध्", X: "ह्", Y: "थ्", Z: "श्",
    ":": "स्", ";": "स",
    "[": "ृ", "]": "े", "{": "र्", "}": "ै",
    "\\": "्", "|": "्र",
    "'": "ु", '"': "ू",
    ".": "।", "/": "र",
    "~": "ञ्", "`": "ञ",
    "+": "ं", "=": ".",
    _: ")", "-": "(",
  };

  let mapped = "";
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    mapped += singleMap[ch] !== undefined ? singleMap[ch] : ch;
  }

  // Reorder choto i-kar 'ि' (\u093f)
  // In Preeti, 'l' (ि) precedes the consonant/cluster. In Unicode, it succeeds it.
  mapped = mapped.replace(/ि((?:[\u0915-\u0939]\u094d)*[\u0915-\u0939])/g, "$1ि");

  // Reorder Reph 'र्' (\u0930\u094d)
  // In Preeti, '{' follows the consonant. In Unicode, it precedes it.
  mapped = mapped.replace(/((?:[\u0915-\u0939](?:\u094d[\u0915-\u0939])*)(?:[\u093e-\u094c\u0902\u0901])?)र्/g, "र्$1");

  return mapped;
}

// -------------------------------------------------------------
// 2. UNICODE TO PREETI CONVERTER
// -------------------------------------------------------------
export function unicodeToPreeti(input) {
  if (!input) return "";

  let text = input;

  // 1. Reorder Reph: 'र्' + consonant cluster -> consonant cluster + '{'
  text = text.replace(/र्((?:[\u0915-\u0939](?:\u094d[\u0915-\u0939])*)(?:[\u093e-\u094c\u0902\u0901])?)/g, "$1{");

  // 2. Reorder choto i-kar 'ि': consonant cluster + 'ि' -> 'l' + consonant cluster
  text = text.replace(/((?:[\u0915-\u0939]\u094d)*[\u0915-\u0939])ि/g, "l$1");

  const unicodeToPreetiMulti = [
    { u: "औ", p: "cf}" },
    { u: "ओ", p: "cf]" },
    { u: "आ", p: "cf" },
    { u: "अ", p: "c" },
    { u: "ई", p: "O{" },
    { u: "इ", p: "O" },
    { u: "ऐ", p: "P}" },
    { u: "ए", p: "P" },
    { u: "ऊ", p: "pm" },
    { u: "उ", p: "p" },
    { u: "ऋ", p: "c{" },
    { u: "ौ", p: "f}" },
    { u: "ो", p: "f]" },
    { u: "ाँ", p: "fF" },
    { u: "ां", p: "f+" },
    { u: "ा", p: "f" },
    { u: "ी", p: "L" },
    { u: "े", p: "]" },
    { u: "ै", p: "}" },
    { u: "ृ", p: "[" },
    { u: "ु", p: "'" },
    { u: "ू", p: '"' },
    { u: "ं", p: "+" },
    { u: "ँ", p: "F" },
    { u: "ः", p: ":" },
    { u: "्र", p: "|" },
    { u: "्", p: "\\" },
    { u: "।", p: "." },
    { u: "रू", p: "?n" },
    { u: "रु", p: "?" },
    { u: "क्र", p: "qm" },
    { u: "त्र", p: "q" },
    { u: "ज्ञ", p: "!" },
    { u: "क्ष", p: "I" },
    { u: "श्र", p: ">" },
    { u: "द्य", p: "B" },
    { u: "द्ध", p: "$" },
    { u: "द्द", p: "@" },
    { u: "त्त", p: "Q" },
    { u: "क्त", p: "µ" },
    { u: "ष्ट", p: "±" },
    { u: "ट्ट", p: "§" },
    { u: "ठ", p: "&" },
    { u: "ड", p: "*" },
    { u: "ढ", p: "(" },
    { u: "ण", p: ")" },
    { u: "ट", p: "^" },
    { u: "छ", p: "%" },
    { u: "घ", p: "#" },
    { u: "झ", p: "¤" },
    { u: "ङ", p: "ª" },
    { u: "ञ्", p: "~" },
    { u: "ञ", p: "`" },
    { u: "स", p: ";" },
    { u: "ह", p: "x" },
    { u: "श", p: "z" },
    { u: "क", p: "s" },
    { u: "ख", p: "v" },
    { u: "ग", p: "u" },
    { u: "च", p: "r" },
    { u: "ज", p: "h" },
    { u: "त", p: "t" },
    { u: "थ", p: "y" },
    { u: "द", p: "b" },
    { u: "ध", p: "w" },
    { u: "न", p: "g" },
    { u: "प", p: "k" },
    { u: "फ", p: "m" },
    { u: "ब", p: "a" },
    { u: "भ", p: "e" },
    { u: "म", p: "d" },
    { u: "य", p: "o" },
    { u: "र", p: "/" },
    { u: "ल", p: "n" },
    { u: "व", p: "j" },
    { u: "०", p: "0" },
    { u: "१", p: "1" },
    { u: "२", p: "2" },
    { u: "३", p: "3" },
    { u: "४", p: "4" },
    { u: "५", p: "5" },
    { u: "६", p: "6" },
    { u: "७", p: "7" },
    { u: "८", p: "8" },
    { u: "९", p: "9" },
    { u: "“", p: "«" },
    { u: "”", p: "»" },
  ];

  for (const item of unicodeToPreetiMulti) {
    text = text.replace(new RegExp(escapeRegex(item.u), "g"), item.p);
  }

  return text;
}

// -------------------------------------------------------------
// 3. ROMANIZED ENGLISH TO NEPALI UNICODE
// -------------------------------------------------------------
const romanMap = {
  chha: "छ", ksha: "क्ष", ch: "च", sh: "श", Sh: "ष",
  th: "थ", Th: "ठ", dh: "ध", Dh: "ढ", kh: "ख", gh: "घ", jh: "झ",
  ph: "फ", bh: "भ", ng: "ङ", gy: "ज्ञ", tr: "त्र",
  ka: "क", kha: "ख", ga: "ग", gha: "घ", nga: "ङ",
  cha: "च", ja: "ज", jha: "झ", nya: "ञ",
  Ta: "ट", Tha: "ठ", Da: "ड", Dha: "ढ", Na: "ण",
  ta: "त", tha: "थ", da: "द", dha: "ध", na: "न",
  pa: "प", pha: "फ", fa: "फ", ba: "ब", bha: "भ", ma: "म",
  ya: "य", ra: "र", la: "ल", wa: "व", va: "व",
  sha: "श", Sha: "ष", sa: "स", ha: "ह", tra: "त्र", gya: "ज्ञ",
  k: "क्", kh: "ख्", g: "ग्", gh: "घ्",
  c: "च्", j: "ज्", jh: "झ्",
  T: "ट्", Th: "ठ्", D: "ड्", Dh: "ढ्", N: "ण्",
  t: "त्", d: "द्", n: "न्",
  p: "प्", f: "फ्", b: "ब्", m: "म्",
  y: "य्", r: "र्", l: "ल्", w: "व्", v: "व्",
  s: "स्", S: "ष्", h: "ह्",
  aa: "आ", a: "अ", ee: "ई", ii: "ई", i: "इ",
  oo: "ऊ", uu: "ऊ", u: "उ",
  e: "ए", ai: "ऐ", o: "ओ", au: "औ",
  am: "अं", an: "अं", ah: "अः",
  "0": "०", "1": "१", "2": "२", "3": "३", "4": "४",
  "5": "५", "6": "६", "7": "७", "8": "८", "9": "९",
};

const commonWords = {
  nepal: "नेपाल",
  nepali: "नेपाली",
  namaste: "नमस्ते",
  dhanyabad: "धन्यवाद",
  kathmandu: "काठमाडौं",
  samachar: "समाचार",
  desh: "देश",
  mero: "मेरो",
  hamro: "हाम्रो",
  tapai: "तपाईं",
  hajur: "हजुर",
  khabar: "खबर",
  patrika: "पत्रिका",
  sarkar: "सरकार",
  mantri: "मन्त्री",
  pradhanmantri: "प्रधानमन्त्री",
  rastrapati: "राष्ट्रपति",
  smart: "स्मार्ट",
  sanchar: "सञ्चार",
  aaja: "आज",
  bholi: "भोलि",
  parsiko: "पर्सीको",
  pani: "पनि",
  chha: "छ",
  chhan: "छन्",
  hunchha: "हुन्छ",
  thiyo: "थियो",
  thie: "थिए",
  bhayeko: "भएको",
  garne: "गर्ने",
  hune: "हुने",
  sabai: "सबै",
  ma: "मा",
  ko: "को",
  ka: "का",
  ki: "की",
  le: "ले",
  lai: "लाई",
  bata: "बाट",
  dekhi: "देखि",
  bhanda: "भन्दा",
  ra: "र",
  va: "वा",
};

export function romanizedToUnicode(input) {
  if (!input) return "";

  const words = input.split(/(\s+|[.,!?;:()\[\]"'`\/\\-]+)/);

  return words.map((chunk) => {
    if (/^(\s+|[.,!?;:()\[\]"'`\/\\-]+)$/.test(chunk)) {
      return chunk;
    }

    const lower = chunk.toLowerCase();
    if (commonWords[lower]) {
      return commonWords[lower];
    }

    let res = "";
    let i = 0;
    while (i < chunk.length) {
      let matched = false;
      for (let len = 4; len >= 1; len--) {
        if (i + len <= chunk.length) {
          const sub = chunk.substr(i, len);
          if (romanMap[sub]) {
            if (res.endsWith("्") && len <= 2) {
              const matras = {
                a: "",
                aa: "ा", A: "ा",
                i: "ि", I: "ी", ee: "ी",
                u: "ु", U: "ू", oo: "ू",
                e: "े", ai: "ै",
                o: "ो", au: "ौ",
                am: "ं", an: "ं",
              };
              if (matras[sub] !== undefined) {
                res = res.slice(0, -1) + matras[sub];
                i += len;
                matched = true;
                break;
              }
            }
            res += romanMap[sub];
            i += len;
            matched = true;
            break;
          }
        }
      }
      if (!matched) {
        res += chunk[i];
        i++;
      }
    }
    return res;
  }).join("");
}

export function getTextStats(text) {
  if (!text) return { chars: 0, words: 0, lines: 0 };
  const chars = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text ? text.split("\n").length : 0;
  return { chars, words, lines };
}
