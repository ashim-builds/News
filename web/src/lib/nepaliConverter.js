/**
 * Romanized English to Nepali Unicode Converter Library
 * SmartSanchar Admin Dashboard
 *
 * Pure phonetic transliteration: English (Roman) alphabet -> Nepali Devanagari Unicode
 * NO PREETI FONT - Pure Unicode Nepali letters (U+0900 - U+097F)
 */

// Common dictionary words for instant, high-accuracy transliteration
const commonWords = {
  // Postpositions & Small particles
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
  wa: "वा",
  va: "वा",
  pani: "पनि",
  ani: "अनि",
  tara: "तर",
  athawa: "अथवा",
  kina: "किन",
  kasari: "कसरी",
  kahile: "कहिले",
  kaha: "कहाँ",
  jati: "जति",
  kura: "कुरा",
  yo: "यो",
  tyo: "त्यो",
  sabai: "सबै",

  // Media & Brand
  smart: "स्मार्ट",
  sanchar: "सञ्चार",
  samachar: "समाचार",
  patrika: "पत्रिका",
  khabar: "खबर",
  sandesh: "सन्देश",
  sambad: "संवाद",
  taja: "ताजा",
  breaking: "ब्रेकिङ",
  update: "अपडेट",

  // Geography & Cities
  nepal: "नेपाल",
  nepali: "नेपाली",
  kathmandu: "काठमाडौं",
  ktm: "काठमाडौं",
  pokhara: "पोखरा",
  lalitpur: "ललितपुर",
  bhaktapur: "भक्तपुर",
  biratnagar: "विराटनगर",
  chitwan: "चितवन",
  butwal: "बुटवल",
  dharan: "धरान",
  nepalgunj: "नेपालगन्ज",
  janakpur: "जनकपुर",
  hetauda: "हेटौंडा",
  surkhet: "सुर्खेत",
  dhangadhi: "धनगढी",
  jhapa: "झापा",
  morang: "मोरङ",
  kaski: "कास्की",
  rupandehi: "रुपन्देही",
  desh: "देश",
  bidesh: "विदेश",
  pradesh: "प्रदेश",
  rajdhani: "राजधानी",
  jilla: "जिल्ला",
  palika: "पालिका",
  nagar: "नगर",
  gau: "गाउँ",

  // Greetings & Courtesies
  namaste: "नमस्ते",
  namaskar: "नमस्कार",
  dhanyabad: "धन्यवाद",
  hajur: "हजुर",
  subha: "शुभ",
  subhakamana: "शुभकामना",
  mero: "मेरो",
  hamro: "हाम्रो",
  tapai: "तपाईं",
  tapaiko: "तपाईंको",
  timi: "तिमी",
  timro: "तिम्रो",
  uha: "उहाँ",
  uhako: "उहाँको",

  // Time
  din: "दिन",
  aaja: "आज",
  aajako: "आजको",
  bholi: "भोलि",
  hijo: "हिजो",
  hijoko: "हिजोको",
  mahina: "महिना",
  barsa: "वर्ष",
  samaya: "समय",

  // Governance, Politics & Law
  sarkar: "सरकार",
  rajniti: "राजनीति",
  rajnaitik: "राजनीतिक",
  sambidhan: "संविधान",
  sambidhanik: "संवैधानिक",
  mantri: "मन्त्री",
  pradhanmantri: "प्रधानमन्त्री",
  rastrapati: "राष्ट्रपति",
  upaprathanmantri: "उपप्रधानमन्त्री",
  uparastrapati: "उपराष्ट्रपति",
  adalat: "अदालत",
  nyayalaya: "न्यायालय",
  prahari: "प्रहरी",
  kanun: "कानुन",
  bikas: "विकास",
  artha: "अर्थ",
  aarthik: "आर्थिक",
  budget: "बजेट",
  samaj: "समाज",
  samajik: "सामाजिक",
  shiksha: "शिक्षा",
  swasthya: "स्वास्थ्य",
  khelkud: "खेलकुद",
  bichar: "विचार",
  janata: "जनता",
  manis: "मानिस",
  manchhe: "मान्छे",
  shree: "श्री",
  shri: "श्री",
  kranti: "क्रान्ति",
  ram: "राम",
  ghar: "घर",
  bhat: "भात",

  // Common Verbs & Auxiliaries
  chha: "छ",
  chhan: "छन्",
  chhu: "छु",
  chhau: "छौ",
  hunchha: "हुन्छ",
  hunchhan: "हुन्छन्",
  hudaina: "हुँदैन",
  thiyo: "थियो",
  thie: "थिए",
  thiye: "थिए",
  bhayeko: "भएको",
  bhaneko: "भनेको",
  bhani: "भने",
  garne: "गर्ने",
  garnu: "गर्नु",
  gariyo: "गरियो",
  gareko: "गरेको",
  hune: "हुने",
  huna: "हुन",
  gayo: "गयो",
  aayo: "आयो",
  bhayo: "भयो",
  rahos: "रहोस्",
  khayo: "खायो",
  ho: "हो",
  hun: "हुन्",
};

// Base Consonants mapped to Halanta Devanagari form (ordered longest prefix first)
const consonants = [
  // Multi-letter conjuncts & special characters
  ["shree", "श्री"],
  ["shri", "श्री"],
  ["gyan", "ज्ञान"],
  ["ksha", "क्ष"],
  ["chha", "छ"],
  ["chh", "छ्"],
  ["ksh", "क्ष्"],
  ["tra", "त्र"],
  ["gya", "ज्ञ"],

  // Aspirated & 2-letter consonants
  ["kh", "ख्"],
  ["gh", "घ्"],
  ["ch", "च्"],
  ["jh", "झ्"],
  ["Th", "ठ्"],
  ["Dh", "ढ्"],
  ["th", "थ्"],
  ["dh", "ध्"],
  ["ph", "फ्"],
  ["bh", "भ्"],
  ["sh", "श्"],
  ["Sh", "ष्"],
  ["ng", "ङ्"],
  ["ny", "ञ्"],

  // Single consonants
  ["k", "क्"],
  ["g", "ग्"],
  ["c", "च्"],
  ["j", "ज्"],
  ["T", "ट्"],
  ["D", "ड्"],
  ["N", "ण्"],
  ["t", "त्"],
  ["d", "द्"],
  ["n", "न्"],
  ["p", "प्"],
  ["f", "फ्"],
  ["b", "ब्"],
  ["m", "म्"],
  ["y", "य्"],
  ["r", "र्"],
  ["l", "ल्"],
  ["w", "व्"],
  ["v", "व्"],
  ["s", "स्"],
  ["S", "ष्"],
  ["h", "ह्"],
];

// Vowel Matras applied when attached to a consonant with halanta
const vowelMatras = [
  ["aau", "ाउ"],
  ["aae", "ाए"],
  ["aai", "ाई"],
  ["aa", "ा"],
  ["A", "ा"],
  ["ee", "ी"],
  ["ii", "ी"],
  ["I", "ी"],
  ["oo", "ू"],
  ["uu", "ू"],
  ["U", "ू"],
  ["ai", "ै"],
  ["au", "ौ"],
  ["am", "ं"],
  ["i", "ि"],
  ["u", "ु"],
  ["e", "े"],
  ["o", "ो"],
  ["a", ""], // 'a' cancels halanta to make full consonant (e.g. क् + a = क)
];

// Standalone Initial Vowels (when not following a halanta consonant)
const initialVowels = [
  ["aau", "आउ"],
  ["aai", "आई"],
  ["aae", "आए"],
  ["aa", "आ"],
  ["A", "आ"],
  ["ee", "ई"],
  ["ii", "ई"],
  ["I", "ई"],
  ["oo", "ऊ"],
  ["uu", "ऊ"],
  ["U", "ऊ"],
  ["ai", "ऐ"],
  ["au", "औ"],
  ["am", "अं"],
  ["a", "अ"],
  ["i", "इ"],
  ["u", "उ"],
  ["e", "ए"],
  ["o", "ओ"],
];

// Nepali Numerals
const numberMap = {
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

/**
 * Transliterates a single Romanized word to Nepali Unicode
 * @param {string} word
 * @returns {string}
 */
function convertSingleWord(word) {
  if (!word) return "";

  // Check dictionary
  const lower = word.toLowerCase();
  if (commonWords[lower]) {
    return commonWords[lower];
  }

  let res = "";
  let i = 0;

  while (i < word.length) {
    let matched = false;

    // 1. If previous character is a consonant with halanta, try vowel matras first
    if (res.endsWith("्")) {
      for (const [key, val] of vowelMatras) {
        if (word.startsWith(key, i)) {
          res = res.slice(0, -1) + val;
          i += key.length;
          matched = true;
          break;
        }
      }
      if (matched) continue;
    }

    // 2. Try consonants
    for (const [key, val] of consonants) {
      if (word.startsWith(key, i)) {
        res += val;
        i += key.length;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    // 3. Try initial standalone vowels
    for (const [key, val] of initialVowels) {
      if (word.startsWith(key, i)) {
        res += val;
        i += key.length;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    // 4. Numbers
    if (numberMap[word[i]]) {
      res += numberMap[word[i]];
      i++;
      continue;
    }

    // 5. Fallback as-is
    res += word[i];
    i++;
  }

  // In natural Nepali typing, word-ending halanta is stripped unless explicit (e.g. 'ram' -> 'राम', 'nepal' -> 'नेपाल')
  if (res.endsWith("्") && !word.endsWith("_") && !word.endsWith("\\")) {
    res = res.slice(0, -1);
  }

  return res;
}

/**
 * Transliterates Romanized English text to pure Nepali Unicode
 * @param {string} input - English Romanized text (e.g. "nepal ma smart sanchar")
 * @returns {string} - Converted Nepali Unicode text (e.g. "नेपाल मा स्मार्ट सञ्चार")
 */
export function romanizedToUnicode(input) {
  if (!input) return "";

  // Tokenize by spaces, punctuation, linebreaks
  const tokens = input.split(/(\s+|[.,!?;:()\[\]"'`\/\\-]+)/);

  return tokens
    .map((token) => {
      // Retain whitespace & punctuation
      if (/^(\s+|[.,!?;:()\[\]"'`\/\\-]+)$/.test(token)) {
        return token;
      }
      return convertSingleWord(token);
    })
    .join("");
}

/**
 * Calculates text metrics (characters, words, lines)
 */
export function getTextStats(text) {
  if (!text) return { chars: 0, words: 0, lines: 0 };
  const chars = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text ? text.split("\n").length : 0;
  return { chars, words, lines };
}
