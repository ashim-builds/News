/**
 * Romanized English to Nepali Unicode Converter Library
 * SmartSanchar Admin Dashboard
 */

// Mapping of Roman phonetic combinations to Nepali Unicode
const romanMap = {
  // 4-letter clusters
  chha: "छ",
  ksha: "क्ष",
  shre: "श्रे",
  gyan: "ज्ञान",

  // 3-letter clusters
  chh: "छ्",
  ksh: "क्ष्",
  tra: "त्र",
  gya: "ज्ञ",
  dha: "ध",
  tha: "थ",
  bha: "भ",
  pha: "फ",
  gha: "घ",
  kha: "ख",
  jha: "झ",
  nga: "ङ",
  nya: "ञ",
  Tha: "ठ",
  Dha: "ढ",
  sha: "श",
  Sha: "ष",
  rhi: "ऋ",

  // 2-letter clusters
  ka: "क",
  ga: "ग",
  cha: "च",
  ja: "ज",
  Ta: "ट",
  Da: "ड",
  Na: "ण",
  ta: "त",
  da: "द",
  na: "न",
  pa: "प",
  fa: "फ",
  ba: "ब",
  ma: "म",
  ya: "य",
  ra: "र",
  la: "ल",
  wa: "व",
  va: "व",
  sa: "स",
  ha: "ह",

  // Halanta consonants
  kh: "ख्",
  gh: "घ्",
  ch: "च्",
  jh: "झ्",
  Th: "ठ्",
  Dh: "ढ्",
  th: "थ्",
  dh: "ध्",
  ph: "फ्",
  bh: "भ्",
  sh: "श्",
  Sh: "ष्",
  ng: "ङ्",
  ny: "ञ्",
  tr: "त्र्",
  gy: "ज्ञ्",

  // Single consonants
  k: "क्",
  g: "ग्",
  c: "च्",
  j: "ज्",
  T: "ट्",
  D: "ड्",
  N: "ण्",
  t: "त्",
  d: "द्",
  n: "न्",
  p: "प्",
  f: "फ्",
  b: "ब्",
  m: "म्",
  y: "य्",
  r: "र्",
  l: "ल्",
  w: "व्",
  v: "व्",
  s: "स्",
  S: "ष्",
  h: "ह्",

  // Vowels
  aa: "आ",
  a: "अ",
  ii: "ई",
  ee: "ई",
  I: "ई",
  i: "इ",
  uu: "ऊ",
  oo: "ऊ",
  U: "ऊ",
  u: "उ",
  ai: "ऐ",
  e: "ए",
  au: "औ",
  o: "ओ",
  am: "अं",
  an: "अं",
  ah: "अः",
  ri: "ऋ",
  Ri: "ऋ",

  // Numbers
  "0": "०",
  "1": "१",
  "2": "२",
  "3": "३",
  "4": "४",
  "5": "५",
  "6": "६",
  "7": "७",
  "8": "८",
  "9": "९",
};

// Matras applied when following a halanta consonant
const vowelMatras = {
  a: "", // cancels halanta
  aa: "ा",
  A: "ा",
  i: "ि",
  I: "ी",
  ee: "ी",
  ii: "ी",
  u: "ु",
  U: "ू",
  oo: "ू",
  uu: "ू",
  e: "े",
  ai: "ै",
  o: "ो",
  au: "ौ",
  am: "ं",
  an: "ं",
  ah: "ः",
  ri: "ृ",
  Ri: "ृ",
};

// Common dictionary words for instant, high-accuracy transliteration
const commonWords = {
  nepal: "नेपाल",
  nepali: "नेपाली",
  namaste: "नमस्ते",
  namaskar: "नमस्कार",
  dhanyabad: "धन्यवाद",
  kathmandu: "काठमाडौं",
  ktm: "काठमाडौं",
  pokhara: "पोखरा",
  chitwan: "चितवन",
  butwal: "बुटवल",
  lalitpur: "ललितपुर",
  bhaktapur: "भक्तपुर",
  biratnagar: "विराटनगर",
  samachar: "समाचार",
  desh: "देश",
  bidesh: "विदेश",
  mero: "मेरो",
  hamro: "हाम्रो",
  tapai: "तपाईं",
  tapaiko: "तपाईंको",
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
  aajako: "आजको",
  bholi: "भोलि",
  hijoko: "हिजोको",
  hijo: "हिजो",
  pani: "पनि",
  chha: "छ",
  chhan: "छन्",
  chhu: "छु",
  chhau: "छौ",
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
  khelkud: "खेलकुद",
  artha: "अर्थ",
  samaj: "समाज",
  bichar: "विचार",
  pradesh: "प्रदेश",
  bikas: "विकास",
  shiksha: "शिक्षा",
  swasthya: "स्वास्थ्य",
  rajniti: "राजनीति",
};

/**
 * Transliterates Romanized English text to Nepali Unicode
 * @param {string} input - English Romanized text (e.g. "nepal ma smart sanchar")
 * @returns {string} - Converted Nepali Unicode text (e.g. "नेपाल मा स्मार्ट सञ्चार")
 */
export function romanizedToUnicode(input) {
  if (!input) return "";

  // Split text by whitespace, punctuation, and newlines
  const tokens = input.split(/(\s+|[.,!?;:()\[\]"'`\/\\-]+)/);

  return tokens
    .map((token) => {
      // Return punctuation and whitespace as-is
      if (/^(\s+|[.,!?;:()\[\]"'`\/\\-]+)$/.test(token)) {
        return token;
      }

      // Check dictionary match
      const lower = token.toLowerCase();
      if (commonWords[lower]) {
        return commonWords[lower];
      }

      let res = "";
      let i = 0;

      while (i < token.length) {
        let matched = false;

        // Try longest match first (4, 3, 2, 1 chars)
        for (let len = 4; len >= 1; len--) {
          if (i + len <= token.length) {
            const sub = token.substr(i, len);

            // Check vowel matra applied to previous halanta consonant
            if (res.endsWith("्") && len <= 2) {
              if (vowelMatras[sub] !== undefined) {
                res = res.slice(0, -1) + vowelMatras[sub];
                i += len;
                matched = true;
                break;
              }
            }

            // Check consonant or vowel match
            if (romanMap[sub]) {
              res += romanMap[sub];
              i += len;
              matched = true;
              break;
            }
          }
        }

        if (!matched) {
          res += token[i];
          i++;
        }
      }

      // In natural Nepali typing, if word ends with halanta, remove it (e.g. 'nepal' -> 'नेपाल', not 'नेपाल्')
      // Unless the original token ended with an underscore or slash
      if (res.endsWith("्") && !token.endsWith("_") && !token.endsWith("\\")) {
        res = res.slice(0, -1);
      }

      return res;
    })
    .join("");
}

/**
 * Calculates text metrics
 */
export function getTextStats(text) {
  if (!text) return { chars: 0, words: 0, lines: 0 };
  const chars = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text ? text.split("\n").length : 0;
  return { chars, words, lines };
}
