// Generated from /home/dpshde/Developer/selah-tools/labs/route-bible-omarchy/src/qml-api.ts. Do not edit by hand.
.pragma library
function objectFromEntries(entries) {
  var obj = {};
  if (!entries) return obj;
  var list = [];
  if (typeof entries.length === "number") {
    for (var i = 0; i < entries.length; i++) list.push(entries[i]);
  } else if (entries.forEach) {
    entries.forEach(function(item) { list.push(item); });
  }
  for (var j = 0; j < list.length; j++) {
    var pair = list[j];
    if (pair) obj[pair[0]] = pair[1];
  }
  return obj;
}
var GrabBcvApi = (function() {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // src/qml-api.ts
  var qml_api_exports = {};
  __export(qml_api_exports, {
    bookCodes: () => bookCodes,
    bookName: () => bookName,
    chapterCount: () => chapterCount,
    plainPassage: () => plainPassage,
    resolveBook: () => resolveBook,
    suggest: () => suggest,
    tryParse: () => tryParse,
    verseCount: () => verseCount
  });

  // ../../packages/grab-bcv/dist/chunk-DDWKUFQF.js
  var OSIS_BOOK_CODES = Object.freeze([
    "GEN",
    "EXO",
    "LEV",
    "NUM",
    "DEU",
    "JOS",
    "JDG",
    "RUT",
    "1SA",
    "2SA",
    "1KI",
    "2KI",
    "1CH",
    "2CH",
    "EZR",
    "NEH",
    "EST",
    "JOB",
    "PSA",
    "PRO",
    "ECC",
    "SNG",
    "ISA",
    "JER",
    "LAM",
    "EZK",
    "DAN",
    "HOS",
    "JOL",
    "AMO",
    "OBA",
    "JON",
    "MIC",
    "NAM",
    "HAB",
    "ZEP",
    "HAG",
    "ZEC",
    "MAL",
    "MAT",
    "MRK",
    "LUK",
    "JHN",
    "ACT",
    "ROM",
    "1CO",
    "2CO",
    "GAL",
    "EPH",
    "PHP",
    "COL",
    "1TH",
    "2TH",
    "1TI",
    "2TI",
    "TIT",
    "PHM",
    "HEB",
    "JAS",
    "1PE",
    "2PE",
    "1JN",
    "2JN",
    "3JN",
    "JUD",
    "REV"
  ]);
  var OSIS_BOOK_CODE_SET_INTERNAL = new Set(OSIS_BOOK_CODES);
  var OSIS_BOOK_ORDER_INTERNAL = new Map(
    OSIS_BOOK_CODES.map((code, index) => [code, index])
  );
  var OSIS_BOOK_CODE_SET = new Set(OSIS_BOOK_CODE_SET_INTERNAL);
  var OSIS_BOOK_ORDER = new Map(OSIS_BOOK_ORDER_INTERNAL);
  var OSIS_BOOK_NAMES_INTERNAL = {
    GEN: "Genesis",
    EXO: "Exodus",
    LEV: "Leviticus",
    NUM: "Numbers",
    DEU: "Deuteronomy",
    JOS: "Joshua",
    JDG: "Judges",
    RUT: "Ruth",
    "1SA": "1 Samuel",
    "2SA": "2 Samuel",
    "1KI": "1 Kings",
    "2KI": "2 Kings",
    "1CH": "1 Chronicles",
    "2CH": "2 Chronicles",
    EZR: "Ezra",
    NEH: "Nehemiah",
    EST: "Esther",
    JOB: "Job",
    PSA: "Psalms",
    PRO: "Proverbs",
    ECC: "Ecclesiastes",
    SNG: "Song of Solomon",
    ISA: "Isaiah",
    JER: "Jeremiah",
    LAM: "Lamentations",
    EZK: "Ezekiel",
    DAN: "Daniel",
    HOS: "Hosea",
    JOL: "Joel",
    AMO: "Amos",
    OBA: "Obadiah",
    JON: "Jonah",
    MIC: "Micah",
    NAM: "Nahum",
    HAB: "Habakkuk",
    ZEP: "Zephaniah",
    HAG: "Haggai",
    ZEC: "Zechariah",
    MAL: "Malachi",
    MAT: "Matthew",
    MRK: "Mark",
    LUK: "Luke",
    JHN: "John",
    ACT: "Acts",
    ROM: "Romans",
    "1CO": "1 Corinthians",
    "2CO": "2 Corinthians",
    GAL: "Galatians",
    EPH: "Ephesians",
    PHP: "Philippians",
    COL: "Colossians",
    "1TH": "1 Thessalonians",
    "2TH": "2 Thessalonians",
    "1TI": "1 Timothy",
    "2TI": "2 Timothy",
    TIT: "Titus",
    PHM: "Philemon",
    HEB: "Hebrews",
    JAS: "James",
    "1PE": "1 Peter",
    "2PE": "2 Peter",
    "1JN": "1 John",
    "2JN": "2 John",
    "3JN": "3 John",
    JUD: "Jude",
    REV: "Revelation"
  };
  var OSIS_BOOK_NAMES = Object.freeze(__spreadValues({}, OSIS_BOOK_NAMES_INTERNAL));
  var BOOK_ALIAS_ENTRIES = [
    ["GEN", ["genesis", "gen", "ge", "gn"]],
    ["EXO", ["exodus", "exo", "exod", "ex"]],
    ["LEV", ["leviticus", "lev", "le", "lv"]],
    ["NUM", ["numbers", "num", "nu", "nm"]],
    ["DEU", ["deuteronomy", "deut", "de", "dt"]],
    ["JOS", ["joshua", "josh", "jos"]],
    ["JDG", ["judges", "judg", "jdg"]],
    ["RUT", ["ruth", "ru"]],
    ["1SA", ["1samuel", "1sam", "1sa"]],
    ["2SA", ["2samuel", "2sam", "2sa"]],
    ["1KI", ["1kings", "1kgs", "1ki"]],
    ["2KI", ["2kings", "2kgs", "2ki"]],
    ["1CH", ["1chronicles", "1chron", "1chr", "1ch"]],
    ["2CH", ["2chronicles", "2chron", "2chr", "2ch"]],
    ["EZR", ["ezra", "ezr", "ez"]],
    ["NEH", ["nehemiah", "neh", "ne"]],
    ["EST", ["esther", "est", "esth", "es"]],
    ["JOB", ["job", "jb"]],
    ["PSA", ["psalms", "psalm", "ps", "psa"]],
    ["PRO", ["proverbs", "prov", "pro", "pr"]],
    ["ECC", ["ecclesiastes", "eccles", "eccl", "ecc", "ec"]],
    ["SNG", ["songofsolomon", "songofsongs", "song", "sos", "ss", "canticles"]],
    ["ISA", ["isaiah", "isa", "is"]],
    ["JER", ["jeremiah", "jer", "je"]],
    ["LAM", ["lamentations", "lam", "la"]],
    ["EZK", ["ezekiel", "ezek", "eze", "ezk"]],
    ["DAN", ["daniel", "dan", "da"]],
    ["HOS", ["hosea", "hos", "ho"]],
    ["JOL", ["joel", "joe", "jl", "jol"]],
    ["AMO", ["amos", "am", "amo"]],
    ["OBA", ["obadiah", "obad", "ob", "oba"]],
    ["JON", ["jonah", "jon", "jnh", "jona"]],
    ["MIC", ["micah", "mic", "mc", "mi"]],
    ["NAM", ["nahum", "nah", "na", "nam"]],
    ["HAB", ["habakkuk", "hab", "hb"]],
    ["ZEP", ["zephaniah", "zeph", "zep"]],
    ["HAG", ["haggai", "hag", "hg"]],
    ["ZEC", ["zechariah", "zech", "zec"]],
    ["MAL", ["malachi", "mal", "ml"]],
    ["MAT", ["matthew", "matt", "mt", "mat"]],
    ["MRK", ["mark", "mrk", "mk", "mr"]],
    ["LUK", ["luke", "luk", "lk", "lu"]],
    ["JHN", ["john", "jhn", "jn", "joh"]],
    ["ACT", ["acts", "act", "ac"]],
    ["ROM", ["romans", "rom", "ro", "rm"]],
    ["1CO", ["1corinthians", "1cor", "1co"]],
    ["2CO", ["2corinthians", "2cor", "2co"]],
    ["GAL", ["galatians", "gal", "ga"]],
    ["EPH", ["ephesians", "eph", "ephes"]],
    ["PHP", ["philippians", "phil", "php"]],
    ["COL", ["colossians", "col", "co"]],
    ["1TH", ["1thessalonians", "1thess", "1thes", "1th"]],
    ["2TH", ["2thessalonians", "2thess", "2thes", "2th"]],
    ["1TI", ["1timothy", "1tim", "1ti"]],
    ["2TI", ["2timothy", "2tim", "2ti"]],
    ["TIT", ["titus", "tit"]],
    ["PHM", ["philemon", "phlm", "phm"]],
    ["HEB", ["hebrews", "heb", "he"]],
    ["JAS", ["james", "jas", "jm"]],
    ["1PE", ["1peter", "1pet", "1pe"]],
    ["2PE", ["2peter", "2pet", "2pe"]],
    ["1JN", ["1john", "1jn", "1jo"]],
    ["2JN", ["2john", "2jn", "2jo"]],
    ["3JN", ["3john", "3jn", "3jo"]],
    ["JUD", ["jude", "jud", "ju"]],
    ["REV", ["revelation", "rev", "re", "rv", "apocalypse"]]
  ];
  function toAliasKey(input) {
    return input.toLowerCase().replace(/[^a-z0-9]/g, "");
  }
  function isAliasFuzzyEligible(key) {
    if (key.length < 4) {
      return false;
    }
    return /[a-z]/.test(key);
  }
  function levenshteinDistance(a, b) {
    const aLen = a.length;
    const bLen = b.length;
    if (aLen === 0) {
      return bLen;
    }
    if (bLen === 0) {
      return aLen;
    }
    let prevRow = Array.from({ length: bLen + 1 }, (_, index) => index);
    let nextRow = new Array(bLen + 1).fill(0);
    for (let i = 1; i <= aLen; i += 1) {
      nextRow[0] = i;
      const aChar = a[i - 1];
      for (let j = 1; j <= bLen; j += 1) {
        const cost = aChar === b[j - 1] ? 0 : 1;
        const deletion = prevRow[j] + 1;
        const insertion = nextRow[j - 1] + 1;
        const substitution = prevRow[j - 1] + cost;
        nextRow[j] = Math.min(deletion, insertion, substitution);
      }
      const previous = prevRow;
      prevRow = nextRow;
      nextRow = previous;
    }
    return prevRow[bLen];
  }
  function getMaxFuzzyDistance(inputLength, candidateLength) {
    const maxLength = Math.max(inputLength, candidateLength);
    if (maxLength <= 4) {
      return 1;
    }
    if (maxLength <= 7) {
      return 2;
    }
    return 3;
  }
  var NUMBERED_PREFIX_EXPANSIONS = {
    "1": ["1", "1st", "first", "i"],
    "2": ["2", "2nd", "second", "ii"],
    "3": ["3", "3rd", "third", "iii"]
  };
  function expandNumberedAliasKey(aliasKey) {
    const match = aliasKey.match(/^([1-3])([a-z0-9]+)$/);
    if (!match) {
      return [aliasKey];
    }
    const digit = match[1];
    const tail = match[2];
    if (!tail) {
      return [aliasKey];
    }
    const prefixes = NUMBERED_PREFIX_EXPANSIONS[digit];
    const variants = /* @__PURE__ */ new Set([aliasKey]);
    for (const prefix of prefixes) {
      variants.add(`${prefix}${tail}`);
    }
    return [...variants];
  }
  function registerAlias(map, input, osis) {
    const key = toAliasKey(input);
    if (!key) {
      return;
    }
    for (const expanded of expandNumberedAliasKey(key)) {
      map.set(expanded, osis);
    }
  }
  var BOOK_ALIAS_TO_OSIS_INTERNAL = /* @__PURE__ */ new Map();
  for (const [osis, aliases] of BOOK_ALIAS_ENTRIES) {
    registerAlias(BOOK_ALIAS_TO_OSIS_INTERNAL, osis, osis);
    registerAlias(BOOK_ALIAS_TO_OSIS_INTERNAL, OSIS_BOOK_NAMES_INTERNAL[osis], osis);
    for (const alias of aliases) {
      registerAlias(BOOK_ALIAS_TO_OSIS_INTERNAL, alias, osis);
    }
  }
  var BOOK_ALIAS_TO_OSIS = new Map(BOOK_ALIAS_TO_OSIS_INTERNAL);
  var FUZZY_ALIAS_CANDIDATES = Array.from(BOOK_ALIAS_TO_OSIS_INTERNAL.entries()).filter(
    ([alias]) => isAliasFuzzyEligible(alias)
  );
  function resolveFuzzyBookAlias(key) {
    if (!isAliasFuzzyEligible(key)) {
      return null;
    }
    const inputStartsWithDigit = /^\d/.test(key);
    const byBook = /* @__PURE__ */ new Map();
    for (const [candidateKey, osis] of FUZZY_ALIAS_CANDIDATES) {
      if (key[0] !== candidateKey[0]) {
        continue;
      }
      const candidateStartsWithDigit = /^\d/.test(candidateKey);
      if (inputStartsWithDigit !== candidateStartsWithDigit) {
        continue;
      }
      const distance = levenshteinDistance(key, candidateKey);
      const maxDistance = getMaxFuzzyDistance(key.length, candidateKey.length);
      if (distance > maxDistance) {
        continue;
      }
      const relativeDistance = distance / Math.max(key.length, candidateKey.length);
      if (relativeDistance > 0.34) {
        continue;
      }
      const lengthDelta = Math.abs(key.length - candidateKey.length);
      const existing = byBook.get(osis);
      if (!existing || distance < existing.distance || distance === existing.distance && lengthDelta < existing.lengthDelta) {
        byBook.set(osis, { osis, distance, lengthDelta });
      }
    }
    if (byBook.size === 0) {
      return null;
    }
    const ranked = Array.from(byBook.values()).sort((left, right) => {
      if (left.distance !== right.distance) {
        return left.distance - right.distance;
      }
      return left.lengthDelta - right.lengthDelta;
    });
    const best = ranked[0];
    const secondBest = ranked[1];
    if (!best) {
      return null;
    }
    if (secondBest && secondBest.distance === best.distance && secondBest.lengthDelta === best.lengthDelta) {
      return null;
    }
    return best.osis;
  }
  var BOOK_CHAPTER_COUNTS_INTERNAL = {
    GEN: 50,
    EXO: 40,
    LEV: 27,
    NUM: 36,
    DEU: 34,
    JOS: 24,
    JDG: 21,
    RUT: 4,
    "1SA": 31,
    "2SA": 24,
    "1KI": 22,
    "2KI": 25,
    "1CH": 29,
    "2CH": 36,
    EZR: 10,
    NEH: 13,
    EST: 10,
    JOB: 42,
    PSA: 150,
    PRO: 31,
    ECC: 12,
    SNG: 8,
    ISA: 66,
    JER: 52,
    LAM: 5,
    EZK: 48,
    DAN: 12,
    HOS: 14,
    JOL: 3,
    AMO: 9,
    OBA: 1,
    JON: 4,
    MIC: 7,
    NAM: 3,
    HAB: 3,
    ZEP: 3,
    HAG: 2,
    ZEC: 14,
    MAL: 4,
    MAT: 28,
    MRK: 16,
    LUK: 24,
    JHN: 21,
    ACT: 28,
    ROM: 16,
    "1CO": 16,
    "2CO": 13,
    GAL: 6,
    EPH: 6,
    PHP: 4,
    COL: 4,
    "1TH": 5,
    "2TH": 3,
    "1TI": 6,
    "2TI": 4,
    TIT: 3,
    PHM: 1,
    HEB: 13,
    JAS: 5,
    "1PE": 5,
    "2PE": 3,
    "1JN": 5,
    "2JN": 1,
    "3JN": 1,
    JUD: 1,
    REV: 22
  };
  var BOOK_VERSE_COUNTS_INTERNAL = {
    GEN: { 1: 31, 2: 25, 3: 24, 4: 26, 5: 32, 6: 22, 7: 24, 8: 22, 9: 29, 10: 32, 11: 32, 12: 20, 13: 18, 14: 24, 15: 21, 16: 16, 17: 27, 18: 33, 19: 38, 20: 18, 21: 34, 22: 24, 23: 20, 24: 67, 25: 34, 26: 35, 27: 46, 28: 22, 29: 35, 30: 43, 31: 55, 32: 32, 33: 20, 34: 31, 35: 29, 36: 43, 37: 36, 38: 30, 39: 23, 40: 23, 41: 57, 42: 38, 43: 34, 44: 34, 45: 28, 46: 34, 47: 31, 48: 22, 49: 33, 50: 26 },
    EXO: { 1: 22, 2: 25, 3: 22, 4: 31, 5: 23, 6: 30, 7: 25, 8: 32, 9: 35, 10: 29, 11: 10, 12: 51, 13: 22, 14: 31, 15: 27, 16: 36, 17: 16, 18: 27, 19: 25, 20: 26, 21: 36, 22: 31, 23: 33, 24: 18, 25: 40, 26: 37, 27: 21, 28: 43, 29: 46, 30: 38, 31: 18, 32: 35, 33: 23, 34: 35, 35: 35, 36: 38, 37: 29, 38: 31, 39: 43, 40: 38 },
    LEV: { 1: 17, 2: 16, 3: 17, 4: 35, 5: 19, 6: 30, 7: 38, 8: 36, 9: 24, 10: 20, 11: 47, 12: 8, 13: 59, 14: 57, 15: 33, 16: 34, 17: 16, 18: 30, 19: 37, 20: 27, 21: 24, 22: 33, 23: 44, 24: 23, 25: 55, 26: 46, 27: 34 },
    NUM: { 1: 54, 2: 34, 3: 51, 4: 49, 5: 31, 6: 27, 7: 89, 8: 26, 9: 23, 10: 36, 11: 35, 12: 16, 13: 33, 14: 45, 15: 41, 16: 50, 17: 13, 18: 32, 19: 22, 20: 29, 21: 35, 22: 41, 23: 30, 24: 25, 25: 18, 26: 65, 27: 23, 28: 31, 29: 40, 30: 16, 31: 54, 32: 42, 33: 56, 34: 29, 35: 34, 36: 13 },
    DEU: { 1: 46, 2: 37, 3: 29, 4: 49, 5: 33, 6: 25, 7: 26, 8: 20, 9: 29, 10: 22, 11: 32, 12: 32, 13: 18, 14: 29, 15: 23, 16: 22, 17: 20, 18: 22, 19: 21, 20: 20, 21: 23, 22: 30, 23: 25, 24: 22, 25: 19, 26: 19, 27: 26, 28: 68, 29: 29, 30: 20, 31: 30, 32: 52, 33: 29, 34: 12 },
    JOS: { 1: 18, 2: 24, 3: 17, 4: 24, 5: 15, 6: 27, 7: 26, 8: 35, 9: 27, 10: 43, 11: 23, 12: 24, 13: 33, 14: 15, 15: 63, 16: 10, 17: 18, 18: 28, 19: 51, 20: 9, 21: 45, 22: 34, 23: 16, 24: 33 },
    JDG: { 1: 36, 2: 23, 3: 31, 4: 24, 5: 31, 6: 40, 7: 25, 8: 35, 9: 57, 10: 18, 11: 40, 12: 15, 13: 25, 14: 20, 15: 20, 16: 31, 17: 13, 18: 31, 19: 30, 20: 48, 21: 25 },
    RUT: { 1: 22, 2: 23, 3: 18, 4: 22 },
    "1SA": { 1: 28, 2: 36, 3: 21, 4: 22, 5: 12, 6: 21, 7: 17, 8: 22, 9: 27, 10: 27, 11: 15, 12: 25, 13: 23, 14: 52, 15: 35, 16: 23, 17: 58, 18: 30, 19: 24, 20: 42, 21: 15, 22: 23, 23: 29, 24: 22, 25: 44, 26: 25, 27: 12, 28: 25, 29: 11, 30: 31, 31: 13 },
    "2SA": { 1: 27, 2: 32, 3: 39, 4: 12, 5: 25, 6: 23, 7: 29, 8: 18, 9: 13, 10: 19, 11: 27, 12: 31, 13: 39, 14: 33, 15: 37, 16: 23, 17: 29, 18: 33, 19: 43, 20: 26, 21: 22, 22: 51, 23: 39, 24: 25 },
    "1KI": { 1: 53, 2: 46, 3: 28, 4: 34, 5: 18, 6: 38, 7: 51, 8: 66, 9: 28, 10: 29, 11: 43, 12: 33, 13: 34, 14: 31, 15: 34, 16: 34, 17: 24, 18: 46, 19: 21, 20: 43, 21: 29, 22: 53 },
    "2KI": { 1: 18, 2: 25, 3: 27, 4: 44, 5: 27, 6: 33, 7: 20, 8: 29, 9: 37, 10: 36, 11: 21, 12: 21, 13: 25, 14: 29, 15: 38, 16: 20, 17: 41, 18: 37, 19: 37, 20: 21, 21: 26, 22: 20, 23: 37, 24: 20, 25: 30 },
    "1CH": { 1: 54, 2: 55, 3: 24, 4: 43, 5: 26, 6: 81, 7: 40, 8: 40, 9: 44, 10: 14, 11: 47, 12: 40, 13: 14, 14: 17, 15: 29, 16: 43, 17: 27, 18: 17, 19: 19, 20: 8, 21: 30, 22: 19, 23: 32, 24: 31, 25: 31, 26: 32, 27: 34, 28: 21, 29: 30 },
    "2CH": { 1: 17, 2: 18, 3: 17, 4: 22, 5: 14, 6: 42, 7: 22, 8: 18, 9: 31, 10: 19, 11: 23, 12: 16, 13: 22, 14: 15, 15: 19, 16: 14, 17: 19, 18: 34, 19: 11, 20: 37, 21: 20, 22: 12, 23: 21, 24: 27, 25: 28, 26: 23, 27: 9, 28: 27, 29: 36, 30: 27, 31: 21, 32: 33, 33: 25, 34: 33, 35: 27, 36: 23 },
    EZR: { 1: 11, 2: 70, 3: 13, 4: 24, 5: 17, 6: 22, 7: 28, 8: 36, 9: 15, 10: 44 },
    NEH: { 1: 11, 2: 20, 3: 32, 4: 23, 5: 19, 6: 19, 7: 73, 8: 18, 9: 38, 10: 39, 11: 36, 12: 47, 13: 31 },
    EST: { 1: 22, 2: 23, 3: 15, 4: 17, 5: 14, 6: 14, 7: 10, 8: 17, 9: 32, 10: 3 },
    JOB: { 1: 22, 2: 13, 3: 26, 4: 21, 5: 27, 6: 30, 7: 21, 8: 22, 9: 35, 10: 22, 11: 20, 12: 25, 13: 28, 14: 22, 15: 35, 16: 22, 17: 16, 18: 21, 19: 29, 20: 29, 21: 34, 22: 30, 23: 17, 24: 25, 25: 6, 26: 14, 27: 23, 28: 28, 29: 25, 30: 31, 31: 40, 32: 22, 33: 33, 34: 37, 35: 16, 36: 33, 37: 24, 38: 41, 39: 30, 40: 24, 41: 34, 42: 17 },
    PSA: { 1: 6, 2: 12, 3: 8, 4: 8, 5: 12, 6: 10, 7: 17, 8: 9, 9: 20, 10: 18, 11: 7, 12: 8, 13: 6, 14: 7, 15: 5, 16: 11, 17: 15, 18: 50, 19: 14, 20: 9, 21: 13, 22: 31, 23: 6, 24: 10, 25: 22, 26: 12, 27: 14, 28: 9, 29: 11, 30: 12, 31: 24, 32: 11, 33: 22, 34: 22, 35: 28, 36: 12, 37: 40, 38: 22, 39: 13, 40: 17, 41: 13, 42: 11, 43: 5, 44: 26, 45: 17, 46: 11, 47: 9, 48: 14, 49: 20, 50: 23, 51: 19, 52: 9, 53: 6, 54: 7, 55: 23, 56: 13, 57: 11, 58: 11, 59: 17, 60: 12, 61: 8, 62: 12, 63: 11, 64: 10, 65: 13, 66: 20, 67: 7, 68: 35, 69: 36, 70: 5, 71: 24, 72: 20, 73: 28, 74: 23, 75: 10, 76: 12, 77: 20, 78: 72, 79: 13, 80: 19, 81: 16, 82: 8, 83: 18, 84: 12, 85: 13, 86: 17, 87: 7, 88: 18, 89: 52, 90: 17, 91: 16, 92: 15, 93: 5, 94: 23, 95: 11, 96: 13, 97: 12, 98: 9, 99: 9, 100: 5, 101: 8, 102: 28, 103: 22, 104: 35, 105: 45, 106: 48, 107: 43, 108: 13, 109: 31, 110: 7, 111: 10, 112: 10, 113: 9, 114: 8, 115: 18, 116: 19, 117: 2, 118: 29, 119: 176, 120: 7, 121: 8, 122: 9, 123: 4, 124: 8, 125: 5, 126: 6, 127: 5, 128: 6, 129: 8, 130: 8, 131: 3, 132: 18, 133: 3, 134: 3, 135: 21, 136: 26, 137: 9, 138: 8, 139: 24, 140: 13, 141: 10, 142: 7, 143: 12, 144: 15, 145: 21, 146: 10, 147: 20, 148: 14, 149: 9, 150: 6 },
    PRO: { 1: 33, 2: 22, 3: 35, 4: 27, 5: 23, 6: 35, 7: 27, 8: 36, 9: 18, 10: 32, 11: 31, 12: 28, 13: 25, 14: 35, 15: 33, 16: 33, 17: 28, 18: 24, 19: 29, 20: 30, 21: 31, 22: 29, 23: 35, 24: 34, 25: 28, 26: 28, 27: 27, 28: 28, 29: 27, 30: 33, 31: 31 },
    ECC: { 1: 18, 2: 26, 3: 22, 4: 16, 5: 20, 6: 12, 7: 29, 8: 17, 9: 18, 10: 20, 11: 10, 12: 14 },
    SNG: { 1: 17, 2: 17, 3: 11, 4: 16, 5: 16, 6: 13, 7: 13, 8: 14 },
    ISA: { 1: 31, 2: 22, 3: 26, 4: 6, 5: 30, 6: 13, 7: 25, 8: 22, 9: 21, 10: 34, 11: 16, 12: 6, 13: 22, 14: 32, 15: 9, 16: 14, 17: 14, 18: 7, 19: 25, 20: 6, 21: 17, 22: 25, 23: 18, 24: 23, 25: 12, 26: 21, 27: 13, 28: 29, 29: 24, 30: 33, 31: 9, 32: 20, 33: 24, 34: 17, 35: 10, 36: 22, 37: 38, 38: 22, 39: 8, 40: 31, 41: 29, 42: 25, 43: 28, 44: 28, 45: 25, 46: 13, 47: 15, 48: 22, 49: 26, 50: 11, 51: 23, 52: 15, 53: 12, 54: 17, 55: 13, 56: 12, 57: 21, 58: 14, 59: 21, 60: 22, 61: 11, 62: 12, 63: 19, 64: 12, 65: 25, 66: 24 },
    JER: { 1: 19, 2: 37, 3: 25, 4: 31, 5: 31, 6: 30, 7: 34, 8: 22, 9: 26, 10: 25, 11: 23, 12: 17, 13: 27, 14: 22, 15: 21, 16: 21, 17: 27, 18: 23, 19: 15, 20: 18, 21: 14, 22: 30, 23: 40, 24: 10, 25: 38, 26: 24, 27: 22, 28: 17, 29: 32, 30: 24, 31: 40, 32: 44, 33: 26, 34: 22, 35: 19, 36: 32, 37: 21, 38: 28, 39: 18, 40: 16, 41: 18, 42: 22, 43: 13, 44: 30, 45: 5, 46: 28, 47: 7, 48: 47, 49: 39, 50: 46, 51: 64, 52: 34 },
    LAM: { 1: 22, 2: 22, 3: 66, 4: 22, 5: 22 },
    EZK: { 1: 28, 2: 10, 3: 27, 4: 17, 5: 17, 6: 14, 7: 27, 8: 18, 9: 11, 10: 22, 11: 25, 12: 28, 13: 23, 14: 23, 15: 8, 16: 63, 17: 24, 18: 32, 19: 14, 20: 49, 21: 32, 22: 31, 23: 49, 24: 27, 25: 17, 26: 21, 27: 36, 28: 26, 29: 21, 30: 26, 31: 18, 32: 32, 33: 33, 34: 31, 35: 15, 36: 38, 37: 28, 38: 23, 39: 29, 40: 49, 41: 26, 42: 20, 43: 27, 44: 31, 45: 25, 46: 24, 47: 23, 48: 35 },
    DAN: { 1: 21, 2: 49, 3: 30, 4: 37, 5: 31, 6: 28, 7: 28, 8: 27, 9: 27, 10: 21, 11: 45, 12: 13 },
    HOS: { 1: 11, 2: 23, 3: 5, 4: 19, 5: 15, 6: 11, 7: 16, 8: 14, 9: 17, 10: 15, 11: 12, 12: 14, 13: 16, 14: 9 },
    JOL: { 1: 20, 2: 32, 3: 21 },
    AMO: { 1: 15, 2: 16, 3: 15, 4: 13, 5: 27, 6: 14, 7: 17, 8: 14, 9: 15 },
    OBA: { 1: 21 },
    JON: { 1: 17, 2: 10, 3: 10, 4: 11 },
    MIC: { 1: 16, 2: 13, 3: 12, 4: 13, 5: 15, 6: 16, 7: 20 },
    NAM: { 1: 15, 2: 13, 3: 19 },
    HAB: { 1: 17, 2: 20, 3: 19 },
    ZEP: { 1: 18, 2: 15, 3: 20 },
    HAG: { 1: 15, 2: 23 },
    ZEC: { 1: 21, 2: 13, 3: 10, 4: 14, 5: 11, 6: 15, 7: 14, 8: 23, 9: 17, 10: 12, 11: 17, 12: 14, 13: 9, 14: 21 },
    MAL: { 1: 14, 2: 17, 3: 18, 4: 6 },
    MAT: { 1: 25, 2: 23, 3: 17, 4: 25, 5: 48, 6: 34, 7: 29, 8: 34, 9: 38, 10: 42, 11: 30, 12: 49, 13: 58, 14: 36, 15: 39, 16: 28, 17: 27, 18: 35, 19: 30, 20: 34, 21: 46, 22: 46, 23: 39, 24: 51, 25: 46, 26: 75, 27: 66, 28: 20 },
    MRK: { 1: 45, 2: 28, 3: 35, 4: 41, 5: 43, 6: 56, 7: 37, 8: 38, 9: 50, 10: 52, 11: 33, 12: 44, 13: 37, 14: 72, 15: 47, 16: 20 },
    LUK: { 1: 80, 2: 52, 3: 38, 4: 44, 5: 39, 6: 49, 7: 50, 8: 56, 9: 62, 10: 42, 11: 54, 12: 59, 13: 35, 14: 35, 15: 32, 16: 31, 17: 37, 18: 43, 19: 48, 20: 47, 21: 38, 22: 71, 23: 56, 24: 53 },
    JHN: { 1: 51, 2: 25, 3: 36, 4: 54, 5: 47, 6: 71, 7: 53, 8: 59, 9: 41, 10: 42, 11: 57, 12: 50, 13: 38, 14: 31, 15: 27, 16: 33, 17: 26, 18: 40, 19: 42, 20: 31, 21: 25 },
    ACT: { 1: 26, 2: 47, 3: 26, 4: 37, 5: 42, 6: 15, 7: 60, 8: 40, 9: 43, 10: 48, 11: 30, 12: 25, 13: 52, 14: 28, 15: 41, 16: 40, 17: 34, 18: 28, 19: 41, 20: 38, 21: 40, 22: 30, 23: 35, 24: 27, 25: 27, 26: 32, 27: 44, 28: 31 },
    ROM: { 1: 32, 2: 29, 3: 31, 4: 25, 5: 21, 6: 23, 7: 25, 8: 39, 9: 33, 10: 21, 11: 36, 12: 21, 13: 14, 14: 23, 15: 33, 16: 27 },
    "1CO": { 1: 31, 2: 16, 3: 23, 4: 21, 5: 13, 6: 20, 7: 40, 8: 13, 9: 27, 10: 33, 11: 34, 12: 31, 13: 13, 14: 40, 15: 58, 16: 24 },
    "2CO": { 1: 24, 2: 17, 3: 18, 4: 18, 5: 21, 6: 18, 7: 16, 8: 24, 9: 15, 10: 18, 11: 33, 12: 21, 13: 14 },
    GAL: { 1: 24, 2: 21, 3: 29, 4: 31, 5: 26, 6: 18 },
    EPH: { 1: 23, 2: 22, 3: 21, 4: 32, 5: 33, 6: 24 },
    PHP: { 1: 30, 2: 30, 3: 21, 4: 23 },
    COL: { 1: 29, 2: 23, 3: 25, 4: 18 },
    "1TH": { 1: 10, 2: 20, 3: 13, 4: 18, 5: 28 },
    "2TH": { 1: 12, 2: 17, 3: 18 },
    "1TI": { 1: 20, 2: 15, 3: 16, 4: 16, 5: 25, 6: 21 },
    "2TI": { 1: 18, 2: 26, 3: 17, 4: 22 },
    TIT: { 1: 16, 2: 15, 3: 15 },
    PHM: { 1: 25 },
    HEB: { 1: 14, 2: 18, 3: 19, 4: 16, 5: 14, 6: 20, 7: 28, 8: 13, 9: 28, 10: 39, 11: 40, 12: 29, 13: 25 },
    JAS: { 1: 27, 2: 26, 3: 18, 4: 17, 5: 20 },
    "1PE": { 1: 25, 2: 25, 3: 22, 4: 19, 5: 14 },
    "2PE": { 1: 21, 2: 22, 3: 18 },
    "1JN": { 1: 10, 2: 29, 3: 24, 4: 21, 5: 21 },
    "2JN": { 1: 13 },
    "3JN": { 1: 14 },
    JUD: { 1: 25 },
    REV: { 1: 20, 2: 29, 3: 22, 4: 11, 5: 14, 6: 17, 7: 17, 8: 13, 9: 21, 10: 11, 11: 19, 12: 17, 13: 18, 14: 20, 15: 8, 16: 21, 17: 18, 18: 24, 19: 21, 20: 15, 21: 27, 22: 21 }
  };
  var BOOK_CHAPTER_COUNTS = Object.freeze(__spreadValues({}, BOOK_CHAPTER_COUNTS_INTERNAL));
  var BOOK_VERSE_COUNTS = Object.freeze(
    objectFromEntries(
      OSIS_BOOK_CODES.map((book) => [book, Object.freeze(__spreadValues({}, BOOK_VERSE_COUNTS_INTERNAL[book]))])
    )
  );
  function isOsisBookCode(input) {
    return OSIS_BOOK_CODE_SET_INTERNAL.has(input);
  }
  function getBookOrder(book) {
    return OSIS_BOOK_ORDER_INTERNAL.get(book);
  }
  function getChapterCount(book) {
    var _a;
    return (_a = BOOK_CHAPTER_COUNTS_INTERNAL[book]) != null ? _a : 1;
  }
  function getVerseCount(book, chapter) {
    var _a, _b;
    if (!Number.isInteger(chapter) || chapter <= 0) {
      return null;
    }
    return (_b = (_a = BOOK_VERSE_COUNTS_INTERNAL[book]) == null ? void 0 : _a[chapter]) != null ? _b : null;
  }
  function getMaxChapter(book) {
    return getChapterCount(book);
  }
  function getMaxVerse(book, chapter) {
    return getVerseCount(book, chapter);
  }
  function resolveBookAlias(input) {
    const key = toAliasKey(input);
    if (!key) {
      return null;
    }
    const exactMatch = BOOK_ALIAS_TO_OSIS_INTERNAL.get(key);
    if (exactMatch) {
      return exactMatch;
    }
    return resolveFuzzyBookAlias(key);
  }

  // ../../packages/grab-bcv/dist/chunk-7RCD6I7V.js
  var DEFAULT_LIMIT = 8;
  var MAX_LIMIT = 50;
  var BOOK_NAME_KEYS = Object.freeze(
    objectFromEntries(OSIS_BOOK_CODES.map((book) => {
      var _a;
      return [book, toLookupKey((_a = OSIS_BOOK_NAMES[book]) != null ? _a : book)];
    }))
  );
  var BOOK_ALIAS_KEYS_BY_BOOK = (() => {
    const buckets = /* @__PURE__ */ new Map();
    for (const [alias, book] of BOOK_ALIAS_TO_OSIS.entries()) {
      const existing = buckets.get(book);
      if (existing) {
        existing.add(alias);
        continue;
      }
      buckets.set(book, /* @__PURE__ */ new Set([alias]));
    }
    return new Map(
      OSIS_BOOK_CODES.map((book) => {
        const aliases = buckets.get(book);
        return [book, Object.freeze([...aliases != null ? aliases : []])];
      })
    );
  })();
  function toLookupKey(input) {
    return input.toLowerCase().replace(/[^a-z0-9]/g, "");
  }
  function normalizeInput(input) {
    return input.trim().replace(/[‐‑‒–—]/g, "-").replace(/\s+/g, " ");
  }
  function toPositiveIntegerOrNull(value) {
    if (!/^\d+$/.test(value)) {
      return null;
    }
    const parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return null;
    }
    return parsed;
  }
  function clampLimit(limit) {
    if (typeof limit !== "number" || !Number.isFinite(limit)) {
      return DEFAULT_LIMIT;
    }
    const rounded = Math.floor(limit);
    if (rounded <= 0) {
      return DEFAULT_LIMIT;
    }
    return Math.min(rounded, MAX_LIMIT);
  }
  function parseBookChapter(bookRaw, chapterRaw) {
    const book = resolveBookAlias(bookRaw);
    if (!book) {
      return null;
    }
    const chapter = toPositiveIntegerOrNull(chapterRaw);
    if (!chapter) {
      return null;
    }
    if (chapter > getChapterCount(book)) {
      return null;
    }
    return { book, chapter };
  }
  function parseVerseContext(input) {
    const patterns = [
      /^(.+?)\s+(\d+)\s*[:.]\s*(\d*)$/i,
      /^(.+?)\s*[./]\s*(\d+)\s*[:.]\s*(\d*)$/i,
      /^([1-3]?[a-zA-Z]+)(\d+)\s*[:.]\s*(\d*)$/i
    ];
    for (const pattern of patterns) {
      const match = input.match(pattern);
      if (!match) {
        continue;
      }
      const bookRaw = match[1];
      const chapterRaw = match[2];
      const versePrefix = match[3];
      if (typeof bookRaw !== "string" || typeof chapterRaw !== "string" || typeof versePrefix !== "string") {
        continue;
      }
      const parsed = parseBookChapter(bookRaw, chapterRaw);
      if (!parsed) {
        continue;
      }
      return __spreadProps(__spreadValues({}, parsed), {
        versePrefix
      });
    }
    return null;
  }
  function parseRangeContext(input) {
    var _a, _b;
    const rangeMatch = input.match(/^(.*?)-\s*(\d*)$/);
    if (!rangeMatch) {
      return null;
    }
    const leftRaw = (_a = rangeMatch[1]) == null ? void 0 : _a.trim();
    const endPrefix = (_b = rangeMatch[2]) != null ? _b : "";
    if (!leftRaw) {
      return null;
    }
    const left = parseVerseContext(leftRaw);
    if (!left || !left.versePrefix) {
      return null;
    }
    const startVerse = toPositiveIntegerOrNull(left.versePrefix);
    if (!startVerse) {
      return null;
    }
    const maxVerse = getVerseCount(left.book, left.chapter);
    if (maxVerse === null || startVerse > maxVerse) {
      return null;
    }
    if (endPrefix && toPositiveIntegerOrNull(endPrefix) === null) {
      return null;
    }
    return {
      book: left.book,
      chapter: left.chapter,
      startVerse,
      endPrefix
    };
  }
  function parseChapterContext(input) {
    const patterns = [/^(.+?)\s*[./]\s*(\d+)$/i, /^(.+?)\s+(\d+)$/i, /^([1-3]?[a-zA-Z]+)(\d+)$/i];
    for (const pattern of patterns) {
      const match = input.match(pattern);
      if (!match) {
        continue;
      }
      const bookRaw = match[1];
      const chapterRaw = match[2];
      if (typeof bookRaw !== "string" || typeof chapterRaw !== "string") {
        continue;
      }
      const parsed = parseBookChapter(bookRaw, chapterRaw);
      if (parsed) {
        return parsed;
      }
    }
    return null;
  }
  function makeSuggestion(kind, canonical, label) {
    return {
      kind,
      canonical,
      label,
      insertText: label
    };
  }
  function suggestBooks(input, limit) {
    var _a, _b;
    const key = toLookupKey(input);
    if (!key) {
      return [];
    }
    const candidates = [];
    for (const book of OSIS_BOOK_CODES) {
      const display = (_a = OSIS_BOOK_NAMES[book]) != null ? _a : book;
      const nameKey = BOOK_NAME_KEYS[book];
      const aliasKeys = (_b = BOOK_ALIAS_KEYS_BY_BOOK.get(book)) != null ? _b : [];
      let score = Number.POSITIVE_INFINITY;
      let shortestMatchLength = Number.POSITIVE_INFINITY;
      if (nameKey === key) {
        score = 0;
        shortestMatchLength = nameKey.length;
      } else if (nameKey.startsWith(key)) {
        score = 1;
        shortestMatchLength = nameKey.length;
      } else {
        for (const aliasKey of aliasKeys) {
          if (!aliasKey.startsWith(key)) {
            continue;
          }
          score = 2;
          if (aliasKey.length < shortestMatchLength) {
            shortestMatchLength = aliasKey.length;
          }
        }
      }
      if (!Number.isFinite(score)) {
        continue;
      }
      candidates.push({ book, score, shortestMatchLength, display });
    }
    candidates.sort((left, right) => {
      if (left.score !== right.score) {
        return left.score - right.score;
      }
      if (left.shortestMatchLength !== right.shortestMatchLength) {
        return left.shortestMatchLength - right.shortestMatchLength;
      }
      return left.display.localeCompare(right.display);
    });
    return candidates.slice(0, limit).map((candidate) => makeSuggestion("book", candidate.book, candidate.display));
  }
  function suggestChapter(context) {
    var _a;
    const name = (_a = OSIS_BOOK_NAMES[context.book]) != null ? _a : context.book;
    const display = `${name} ${context.chapter}`;
    return [makeSuggestion("chapter", `${context.book}.${context.chapter}`, display)];
  }
  function suggestVerses(context, limit) {
    var _a;
    const maxVerse = getVerseCount(context.book, context.chapter);
    if (maxVerse === null) {
      return [];
    }
    const name = (_a = OSIS_BOOK_NAMES[context.book]) != null ? _a : context.book;
    const suggestions = [];
    for (let verse = 1; verse <= maxVerse; verse += 1) {
      const verseText = String(verse);
      if (context.versePrefix && !verseText.startsWith(context.versePrefix)) {
        continue;
      }
      const display = `${name} ${context.chapter}:${verseText}`;
      suggestions.push(makeSuggestion("verse", `${context.book}.${context.chapter}.${verseText}`, display));
      if (suggestions.length >= limit) {
        break;
      }
    }
    return suggestions;
  }
  function suggestRanges(context, limit) {
    var _a;
    const maxVerse = getVerseCount(context.book, context.chapter);
    if (maxVerse === null) {
      return [];
    }
    const name = (_a = OSIS_BOOK_NAMES[context.book]) != null ? _a : context.book;
    const minEnd = context.startVerse + 1;
    const suggestions = [];
    for (let verse = minEnd; verse <= maxVerse; verse += 1) {
      const verseText = String(verse);
      if (context.endPrefix && !verseText.startsWith(context.endPrefix)) {
        continue;
      }
      const display = `${name} ${context.chapter}:${context.startVerse}-${verseText}`;
      suggestions.push(makeSuggestion("range", `${context.book}.${context.chapter}.${context.startVerse}-${verseText}`, display));
      if (suggestions.length >= limit) {
        break;
      }
    }
    return suggestions;
  }
  function autocompletePassage(input, options = {}) {
    const normalized = normalizeInput(input);
    if (!normalized) {
      return [];
    }
    const limit = clampLimit(options.limit);
    const rangeContext = parseRangeContext(normalized);
    if (rangeContext) {
      return suggestRanges(rangeContext, limit);
    }
    const verseContext = parseVerseContext(normalized);
    if (verseContext) {
      return suggestVerses(verseContext, limit);
    }
    const chapterContext = parseChapterContext(normalized);
    if (chapterContext) {
      return suggestChapter(chapterContext);
    }
    return suggestBooks(normalized, limit);
  }

  // ../../packages/grab-bcv/dist/chunk-S3ACWDLD.js
  function hasVerse(part) {
    return typeof part.verse === "number" && Number.isFinite(part.verse);
  }
  function formatPart(part, includeBook) {
    var _a;
    const bookName2 = (_a = OSIS_BOOK_NAMES[part.book]) != null ? _a : part.book;
    const chapterVerse = hasVerse(part) ? `${part.chapter}:${part.verse}` : `${part.chapter}`;
    return includeBook ? `${bookName2} ${chapterVerse}` : chapterVerse;
  }
  function formatPassageForDisplay(parsed) {
    var _a;
    const start = parsed.start;
    const end = parsed.end;
    const startHasVerse = hasVerse(start);
    const endHasVerse = hasVerse(end);
    const sameBook = start.book === end.book;
    const sameChapter = sameBook && start.chapter === end.chapter;
    const bookName2 = (_a = OSIS_BOOK_NAMES[start.book]) != null ? _a : start.book;
    if (sameChapter && startHasVerse && endHasVerse && start.verse === end.verse) {
      return `${bookName2} ${start.chapter}:${start.verse}`;
    }
    if (sameChapter && !startHasVerse && !endHasVerse) {
      return `${bookName2} ${start.chapter}`;
    }
    if (sameChapter && startHasVerse && endHasVerse) {
      return `${bookName2} ${start.chapter}:${start.verse}-${end.verse}`;
    }
    if (sameBook && !startHasVerse && !endHasVerse) {
      return `${bookName2} ${start.chapter}-${end.chapter}`;
    }
    if (sameBook) {
      return `${bookName2} ${formatPart(start, false)}-${formatPart(end, false)}`;
    }
    return `${formatPart(start, true)}-${formatPart(end, true)}`;
  }
  var PassageParseError = class extends Error {
    constructor(code, message, details) {
      super(message);
      __publicField(this, "code");
      __publicField(this, "details");
      this.name = "PassageParseError";
      this.code = code;
      this.details = details;
    }
  };
  var INVISIBLE_FORMATTING_REGEX = /[\u061C\u200B-\u200D\u200E\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g;
  var FULL_WIDTH_PUNCTUATION_REGEX = /[：．／]/g;
  var DASH_VARIANT_REGEX = /[‐‑‒–—―−﹘﹣－]/g;
  function normalizeFullWidthPunctuation(value) {
    return value.replace(FULL_WIDTH_PUNCTUATION_REGEX, (character) => {
      switch (character) {
        case "\uFF1A":
          return ":";
        case "\uFF0E":
          return ".";
        case "\uFF0F":
          return "/";
        default:
          return character;
      }
    });
  }
  function normalizePassageIntakeText(input) {
    return normalizeFullWidthPunctuation(input.normalize("NFKC")).replace(INVISIBLE_FORMATTING_REGEX, "").replace(DASH_VARIANT_REGEX, "-");
  }
  var FULL_REFERENCE_REGEX = /^([1-3]?[A-Z]{2,})\.(\d+)\.(\d+)$/;
  var CHAPTER_REFERENCE_REGEX = /^([1-3]?[A-Z]{2,})\.(\d+)$/;
  var PASSAGE_FORMAT_ERROR_MESSAGE = "Use references like JHN.3, JHN.3.16, John 3:16-18, or JHN.3.16-JHN.4.2.";
  function normalizeToken(input) {
    return normalizePassageIntakeText(input).trim().replace(/\s+/g, "").replace(/:/g, ".").replace(/\.\.+/g, ".").toUpperCase();
  }
  function normalizeNaturalToken(input) {
    return normalizePassageIntakeText(input).trim().replace(/[,;]+/g, " ").replace(/\s+/g, " ");
  }
  function toPositiveIntegerOrNull2(value) {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return null;
    }
    return parsed;
  }
  function toPositiveInteger(value) {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      throw new PassageParseError("INVALID_NUMBER", "Chapter and verse must be positive integers.");
    }
    return parsed;
  }
  function hasVerse2(part) {
    return typeof part.verse === "number" && Number.isFinite(part.verse);
  }
  function formatPart2(part) {
    return hasVerse2(part) ? `${part.book}.${part.chapter}.${part.verse}` : `${part.book}.${part.chapter}`;
  }
  function formatBookName(book) {
    var _a;
    return (_a = OSIS_BOOK_NAMES[book]) != null ? _a : book;
  }
  function chapterCapMessage(book, maxChapter) {
    return `${formatBookName(book)} has ${maxChapter} chapter${maxChapter === 1 ? "" : "s"}.`;
  }
  function verseCapMessage(book, chapter, maxVerse) {
    return `${formatBookName(book)} ${chapter} has ${maxVerse} verse${maxVerse === 1 ? "" : "s"}.`;
  }
  function createChapterCapDetails(book, maxChapter, attemptedChapter) {
    return {
      kind: "chapter_cap",
      book,
      bookName: formatBookName(book),
      maxChapter,
      attemptedChapter
    };
  }
  function createVerseCapDetails(book, chapter, maxVerse, attemptedVerse) {
    return {
      kind: "verse_cap",
      book,
      bookName: formatBookName(book),
      chapter,
      maxVerse,
      attemptedVerse
    };
  }
  function toAliasKey2(input) {
    return input.toLowerCase().replace(/[^a-z0-9]/g, "");
  }
  function isSingleInsertionAway(shorter, longer) {
    if (longer.length !== shorter.length + 1) {
      return false;
    }
    let i = 0;
    let j = 0;
    let skipped = false;
    while (i < shorter.length && j < longer.length) {
      if (shorter[i] === longer[j]) {
        i += 1;
        j += 1;
        continue;
      }
      if (skipped) {
        return false;
      }
      skipped = true;
      j += 1;
    }
    return true;
  }
  function resolveChapterFallbackBookAlias(bookRaw, chapter, primaryBook) {
    const key = toAliasKey2(bookRaw);
    if (!key || key.length < 3) {
      return null;
    }
    const byBook = /* @__PURE__ */ new Map();
    for (const [aliasKey, osis] of BOOK_ALIAS_TO_OSIS.entries()) {
      if (osis === primaryBook) {
        continue;
      }
      const isPrefixMatch = aliasKey.startsWith(key) || key.startsWith(aliasKey);
      const isOneEditExpandedMatch = aliasKey.length >= 4 && isSingleInsertionAway(key, aliasKey) && aliasKey.slice(0, 2) === key.slice(0, 2);
      if (!isPrefixMatch && !isOneEditExpandedMatch) {
        continue;
      }
      if (chapter > getMaxChapter(osis)) {
        continue;
      }
      const next = {
        book: osis,
        lengthDelta: Math.abs(aliasKey.length - key.length)
      };
      const existing = byBook.get(osis);
      if (!existing || next.lengthDelta < existing.lengthDelta) {
        byBook.set(osis, next);
      }
    }
    const ranked = Array.from(byBook.values()).sort((left, right) => left.lengthDelta - right.lengthDelta);
    const best = ranked[0];
    const second = ranked[1];
    if (!best) {
      return null;
    }
    if (second && second.lengthDelta === best.lengthDelta) {
      return null;
    }
    return best.book;
  }
  function parseReferenceToken(token) {
    const fullMatch = token.match(FULL_REFERENCE_REGEX);
    if (fullMatch) {
      const rawBook = fullMatch[1];
      const chapterText = fullMatch[2];
      const verseText = fullMatch[3];
      if (!rawBook || !chapterText || !verseText) {
        throw new PassageParseError("INVALID_FORMAT", PASSAGE_FORMAT_ERROR_MESSAGE);
      }
      const book = rawBook.toUpperCase();
      if (!isOsisBookCode(book)) {
        throw new PassageParseError("INVALID_BOOK", `Unknown book code: ${rawBook}.`);
      }
      const chapter = toPositiveInteger(chapterText);
      const maxChapter = getMaxChapter(book);
      if (chapter > maxChapter) {
        throw new PassageParseError(
          "INVALID_FORMAT",
          chapterCapMessage(book, maxChapter),
          createChapterCapDetails(book, maxChapter, chapter)
        );
      }
      const verse = toPositiveInteger(verseText);
      const maxVerse = getMaxVerse(book, chapter);
      if (maxVerse !== null && verse > maxVerse) {
        throw new PassageParseError(
          "INVALID_FORMAT",
          verseCapMessage(book, chapter, maxVerse),
          createVerseCapDetails(book, chapter, maxVerse, verse)
        );
      }
      return {
        book,
        chapter,
        verse
      };
    }
    const chapterMatch = token.match(CHAPTER_REFERENCE_REGEX);
    if (chapterMatch) {
      const rawBook = chapterMatch[1];
      const chapterText = chapterMatch[2];
      if (!rawBook || !chapterText) {
        throw new PassageParseError("INVALID_FORMAT", PASSAGE_FORMAT_ERROR_MESSAGE);
      }
      const book = rawBook.toUpperCase();
      if (!isOsisBookCode(book)) {
        throw new PassageParseError("INVALID_BOOK", `Unknown book code: ${rawBook}.`);
      }
      const chapter = toPositiveInteger(chapterText);
      const maxChapter = getMaxChapter(book);
      if (chapter > maxChapter) {
        throw new PassageParseError(
          "INVALID_FORMAT",
          chapterCapMessage(book, maxChapter),
          createChapterCapDetails(book, maxChapter, chapter)
        );
      }
      return {
        book,
        chapter
      };
    }
    throw new PassageParseError("INVALID_FORMAT", PASSAGE_FORMAT_ERROR_MESSAGE);
  }
  function createNaturalPassagePart(bookRaw, chapterRaw, verseRaw) {
    const primaryBook = resolveBookAlias(bookRaw);
    if (!primaryBook) {
      return null;
    }
    const chapter = toPositiveIntegerOrNull2(chapterRaw);
    if (!chapter) {
      return null;
    }
    let book = primaryBook;
    const maxChapter = getMaxChapter(book);
    if (chapter > maxChapter) {
      const fallback = resolveChapterFallbackBookAlias(bookRaw, chapter, primaryBook);
      if (!fallback) {
        throw new PassageParseError(
          "INVALID_FORMAT",
          chapterCapMessage(book, maxChapter),
          createChapterCapDetails(book, maxChapter, chapter)
        );
      }
      book = fallback;
    }
    if (!verseRaw) {
      return {
        book,
        chapter
      };
    }
    const verse = toPositiveIntegerOrNull2(verseRaw);
    if (!verse) {
      return null;
    }
    const maxVerse = getMaxVerse(book, chapter);
    if (maxVerse !== null && verse > maxVerse) {
      throw new PassageParseError(
        "INVALID_FORMAT",
        verseCapMessage(book, chapter, maxVerse),
        createVerseCapDetails(book, chapter, maxVerse, verse)
      );
    }
    return {
      book,
      chapter,
      verse
    };
  }
  function parseNaturalReference(input) {
    const normalized = normalizeNaturalToken(input);
    if (!normalized) {
      return null;
    }
    const osisLikeVerse = normalized.match(/^(.+?)\s*[.]\s*(\d+)\s*[.]\s*(\d+)$/i);
    if (osisLikeVerse) {
      const bookRaw = osisLikeVerse[1];
      const chapterRaw = osisLikeVerse[2];
      const verseRaw = osisLikeVerse[3];
      if (bookRaw && chapterRaw && verseRaw) {
        return createNaturalPassagePart(bookRaw, chapterRaw, verseRaw);
      }
    }
    const pathLikeVerse = normalized.match(/^(.+?)\s*\/\s*(\d+)\s*[/:.]\s*(\d+)$/i);
    if (pathLikeVerse) {
      const bookRaw = pathLikeVerse[1];
      const chapterRaw = pathLikeVerse[2];
      const verseRaw = pathLikeVerse[3];
      if (bookRaw && chapterRaw && verseRaw) {
        return createNaturalPassagePart(bookRaw, chapterRaw, verseRaw);
      }
    }
    const chapterVerse = normalized.match(/^(.+?)\s*(\d+)\s*[:.]\s*(\d+)$/i);
    if (chapterVerse) {
      const bookRaw = chapterVerse[1];
      const chapterRaw = chapterVerse[2];
      const verseRaw = chapterVerse[3];
      if (bookRaw && chapterRaw && verseRaw) {
        return createNaturalPassagePart(bookRaw, chapterRaw, verseRaw);
      }
    }
    const spaceSeparatedVerse = normalized.match(/^(.+?)\s+(\d+)\s+(\d+)$/i);
    if (spaceSeparatedVerse) {
      const bookRaw = spaceSeparatedVerse[1];
      const chapterRaw = spaceSeparatedVerse[2];
      const verseRaw = spaceSeparatedVerse[3];
      if (bookRaw && chapterRaw && verseRaw) {
        return createNaturalPassagePart(bookRaw, chapterRaw, verseRaw);
      }
    }
    const compactVerse = normalized.match(/^([1-3]?[a-zA-Z]+)(\d+)[:.](\d+)$/i);
    if (compactVerse) {
      const bookRaw = compactVerse[1];
      const chapterRaw = compactVerse[2];
      const verseRaw = compactVerse[3];
      if (bookRaw && chapterRaw && verseRaw) {
        return createNaturalPassagePart(bookRaw, chapterRaw, verseRaw);
      }
    }
    const compactChapter = normalized.match(/^([1-3]?[a-zA-Z]+)(\d+)$/i);
    if (compactChapter) {
      const bookRaw = compactChapter[1];
      const chapterRaw = compactChapter[2];
      if (bookRaw && chapterRaw) {
        return createNaturalPassagePart(bookRaw, chapterRaw);
      }
    }
    const dottedOrPathChapter = normalized.match(/^(.+?)\s*[./]\s*(\d+)$/i);
    if (dottedOrPathChapter) {
      const bookRaw = dottedOrPathChapter[1];
      const chapterRaw = dottedOrPathChapter[2];
      if (bookRaw && chapterRaw) {
        return createNaturalPassagePart(bookRaw, chapterRaw);
      }
    }
    const chapterOnly = normalized.match(/^(.+?)\s+(\d+)$/i);
    if (chapterOnly) {
      const bookRaw = chapterOnly[1];
      const chapterRaw = chapterOnly[2];
      if (bookRaw && chapterRaw) {
        return createNaturalPassagePart(bookRaw, chapterRaw);
      }
    }
    return null;
  }
  function normalizeNaturalPassage(input) {
    const normalized = normalizeNaturalToken(input);
    if (!normalized) {
      return null;
    }
    const pieces = normalized.split(/\s*-\s*/);
    if (pieces.length === 2) {
      const leftRaw = pieces[0];
      const rightRaw = pieces[1];
      if (!leftRaw || !rightRaw) {
        return null;
      }
      const left = parseNaturalReference(leftRaw);
      if (!left) {
        return null;
      }
      const rightDigitsOnly = rightRaw.match(/^\d+$/);
      if (rightDigitsOnly) {
        if (hasVerse2(left)) {
          return `${left.book}.${left.chapter}.${left.verse}-${rightRaw}`;
        }
        return `${left.book}.${left.chapter}-${rightRaw}`;
      }
      const rightChapterVerse = rightRaw.match(/^(\d+)\s*[:.]\s*(\d+)$/);
      if (rightChapterVerse) {
        const rightChapterRaw = rightChapterVerse[1];
        const rightVerseRaw = rightChapterVerse[2];
        if (!rightChapterRaw || !rightVerseRaw) {
          return null;
        }
        const right2 = parseReferenceToken(`${left.book}.${rightChapterRaw}.${rightVerseRaw}`);
        if (left.book === right2.book && hasVerse2(left) && hasVerse2(right2) && left.chapter === right2.chapter) {
          return `${left.book}.${left.chapter}.${left.verse}-${right2.verse}`;
        }
        return `${formatPart2(left)}-${formatPart2(right2)}`;
      }
      const right = parseNaturalReference(rightRaw);
      if (!right) {
        return null;
      }
      if (left.book === right.book && hasVerse2(left) && hasVerse2(right) && left.chapter === right.chapter) {
        return `${left.book}.${left.chapter}.${left.verse}-${right.verse}`;
      }
      if (left.book === right.book && !hasVerse2(left) && !hasVerse2(right)) {
        return `${left.book}.${left.chapter}-${right.chapter}`;
      }
      return `${formatPart2(left)}-${formatPart2(right)}`;
    }
    if (pieces.length !== 1) {
      return null;
    }
    const singleRaw = pieces[0];
    if (!singleRaw) {
      return null;
    }
    const single = parseNaturalReference(singleRaw);
    if (!single) {
      return null;
    }
    return formatPart2(single);
  }
  function normalizePassageInput(input) {
    const naturalNormalized = normalizeNaturalPassage(input);
    if (naturalNormalized) {
      return normalizeToken(naturalNormalized);
    }
    return normalizeToken(input);
  }
  function compareForRange(start, end) {
    const startBookOrder = getBookOrder(start.book);
    const endBookOrder = getBookOrder(end.book);
    if (startBookOrder === void 0 || endBookOrder === void 0) {
      return 0;
    }
    if (startBookOrder !== endBookOrder) {
      return startBookOrder - endBookOrder;
    }
    if (start.chapter !== end.chapter) {
      return start.chapter - end.chapter;
    }
    const startVerse = hasVerse2(start) ? start.verse : 0;
    const endVerse = hasVerse2(end) ? end.verse : Number.MAX_SAFE_INTEGER;
    return startVerse - endVerse;
  }
  function canonicalize(start, end) {
    const sameBook = start.book === end.book;
    const sameChapter = sameBook && start.chapter === end.chapter;
    const startHasVerse = hasVerse2(start);
    const endHasVerse = hasVerse2(end);
    if (sameChapter && startHasVerse && endHasVerse && start.verse === end.verse) {
      return {
        canonical: `${start.book}.${start.chapter}.${start.verse}`,
        rangeType: "single"
      };
    }
    if (sameChapter && !startHasVerse && !endHasVerse) {
      return {
        canonical: `${start.book}.${start.chapter}`,
        rangeType: "chapter"
      };
    }
    if (sameChapter && startHasVerse && endHasVerse) {
      return {
        canonical: `${start.book}.${start.chapter}.${start.verse}-${end.verse}`,
        rangeType: "same_chapter"
      };
    }
    if (sameBook && !startHasVerse && !endHasVerse) {
      return {
        canonical: `${start.book}.${start.chapter}-${end.chapter}`,
        rangeType: "chapter_range"
      };
    }
    return {
      canonical: `${formatPart2(start)}-${formatPart2(end)}`,
      rangeType: "cross_reference"
    };
  }
  function parsePassage(input) {
    if (!(input == null ? void 0 : input.trim())) {
      throw new PassageParseError("EMPTY", "Passage is required.");
    }
    const normalized = normalizePassageInput(input);
    if (!normalized) {
      throw new PassageParseError("EMPTY", "Passage is required.");
    }
    const pieces = normalized.split("-");
    if (pieces.length > 2 || pieces.some((piece) => piece.length === 0)) {
      throw new PassageParseError("INVALID_FORMAT", PASSAGE_FORMAT_ERROR_MESSAGE);
    }
    const startToken = pieces[0];
    if (!startToken) {
      throw new PassageParseError("INVALID_FORMAT", PASSAGE_FORMAT_ERROR_MESSAGE);
    }
    const start = parseReferenceToken(startToken);
    const endToken = pieces[1];
    let end;
    if (!endToken) {
      end = start;
    } else if (/^\d+$/.test(endToken)) {
      if (hasVerse2(start)) {
        const endVerse = toPositiveInteger(endToken);
        const maxVerse = getMaxVerse(start.book, start.chapter);
        if (maxVerse !== null && endVerse > maxVerse) {
          throw new PassageParseError(
            "INVALID_FORMAT",
            verseCapMessage(start.book, start.chapter, maxVerse),
            createVerseCapDetails(start.book, start.chapter, maxVerse, endVerse)
          );
        }
        end = {
          book: start.book,
          chapter: start.chapter,
          verse: endVerse
        };
      } else {
        const endChapter = toPositiveInteger(endToken);
        const maxChapter = getMaxChapter(start.book);
        if (endChapter > maxChapter) {
          throw new PassageParseError(
            "INVALID_FORMAT",
            chapterCapMessage(start.book, maxChapter),
            createChapterCapDetails(start.book, maxChapter, endChapter)
          );
        }
        end = {
          book: start.book,
          chapter: endChapter
        };
      }
    } else {
      end = parseReferenceToken(endToken);
    }
    if (compareForRange(start, end) > 0) {
      throw new PassageParseError("REVERSED_RANGE", "Passage range end must be greater than or equal to start.");
    }
    const { canonical, rangeType } = canonicalize(start, end);
    return {
      input,
      canonical,
      start,
      end,
      rangeType
    };
  }
  var SHARE_QUERY_KEYS = ["reference", "passage", "search", "q", "ref", "scripture", "verse"];
  var LOGOS_NEW_TESTAMENT_OFFSET = 21;
  var URL_TOKEN_PATTERN = "(?:https?:\\/\\/|[a-z][a-z0-9+.-]*:\\/\\/|www\\.)[^\\s)]+";
  var REFERENCE_TOKEN_PATTERN = "[1-3]?[A-Za-z]{2,}\\.\\d+(?:\\.\\d+)?(?:-[1-3]?[A-Za-z]{2,}\\.\\d+\\.\\d+|-\\d+)?(?:\\.[A-Za-z0-9]{2,8})?|(?:[1-3]\\s*)?[A-Za-z]+(?:\\s+of\\s+[A-Za-z]+)?\\s+\\d+(?:(?::|\\s)\\d+(?:-\\d+)?)?";
  var LEADING_WRAPPER_REGEX = /^[([{"'`]+/;
  var TRAILING_WRAPPER_REGEX = /[)\]}",;.!?'`]+$/;
  var ENDURING_WORD_OVERRIDES = {
    PSA: "psalm",
    SNG: "song-of-solomon"
  };
  function toSlug(value) {
    return value.toLowerCase().replace(/['".,()]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }
  var ENDURING_WORD_SLUG_TO_BOOK = new Map(
    OSIS_BOOK_CODES.map((book) => {
      var _a;
      return [(_a = ENDURING_WORD_OVERRIDES[book]) != null ? _a : toSlug(OSIS_BOOK_NAMES[book]), book];
    })
  );
  function tryDecode(value) {
    try {
      return decodeURIComponent(value);
    } catch (e) {
      return value;
    }
  }
  function unique(values) {
    const seen = /* @__PURE__ */ new Set();
    const out = [];
    for (const value of values) {
      const token = value.trim();
      if (!token || seen.has(token)) {
        continue;
      }
      seen.add(token);
      out.push(token);
    }
    return out;
  }
  function stripTranslationSuffix(value) {
    const cleaned = value.trim().replace(/^[/#?]+|[/#?]+$/g, "");
    const match = cleaned.match(
      /^([1-3]?[A-Za-z]{2,}\.\d+(?:\.\d+)?(?:-[1-3]?[A-Za-z]{2,}\.\d+\.\d+|-\d+)?)(?:\.[A-Za-z0-9]{2,8})$/
    );
    if (match == null ? void 0 : match[1]) {
      return match[1];
    }
    return cleaned;
  }
  function resolveLogosBook(bookNumberRaw) {
    var _a, _b;
    const bookNumber = Number.parseInt(bookNumberRaw, 10);
    if (!Number.isInteger(bookNumber) || bookNumber <= 0) {
      return null;
    }
    if (bookNumber >= 61 && bookNumber <= 87) {
      const shiftedNumber = bookNumber - LOGOS_NEW_TESTAMENT_OFFSET;
      if (shiftedNumber >= 40 && shiftedNumber <= OSIS_BOOK_CODES.length) {
        return (_a = OSIS_BOOK_CODES[shiftedNumber - 1]) != null ? _a : null;
      }
    }
    return (_b = OSIS_BOOK_CODES[bookNumber - 1]) != null ? _b : null;
  }
  function parseLogosReference(value) {
    var _a;
    const decoded = tryDecode(value).trim().replace(/^[/#?]+|[/#?]+$/g, "");
    if (!decoded) {
      return null;
    }
    const segment = (_a = decoded.split("/").filter(Boolean).pop()) != null ? _a : decoded;
    const match = segment.match(
      /^bible(?:\+[a-z0-9_-]+)?\.(\d+)\.(\d+)(?:\.(\d+))?(?:-(\d+))?(?:\.[a-z][a-z0-9_-]*)*$/i
    );
    if (!match) {
      return null;
    }
    const [, bookNumberRaw, chapterRaw, verseRaw, rangeEndRaw] = match;
    if (!bookNumberRaw || !chapterRaw) {
      return null;
    }
    const book = resolveLogosBook(bookNumberRaw);
    if (!book) {
      return null;
    }
    const chapter = Number.parseInt(chapterRaw, 10);
    if (!Number.isInteger(chapter) || chapter <= 0) {
      return null;
    }
    if (!verseRaw) {
      return `${book}.${chapter}`;
    }
    const verse = Number.parseInt(verseRaw, 10);
    if (!Number.isInteger(verse) || verse <= 0) {
      return null;
    }
    if (!rangeEndRaw) {
      return `${book}.${chapter}.${verse}`;
    }
    const rangeEnd = Number.parseInt(rangeEndRaw, 10);
    if (!Number.isInteger(rangeEnd) || rangeEnd < verse) {
      return null;
    }
    return `${book}.${chapter}.${verse}-${rangeEnd}`;
  }
  function candidateVariants(value) {
    const decoded = tryDecode(value);
    const normalized = decoded.replace(/_/g, " ");
    const stripped = normalized.replace(/^["'`]+|["'`]+$/g, "");
    const withoutTranslation = stripTranslationSuffix(stripped);
    return unique([value, decoded, normalized, stripped, withoutTranslation]);
  }
  function tryCanonicalFromCandidate(value) {
    const logosCanonical = parseLogosReference(value);
    if (logosCanonical) {
      return logosCanonical;
    }
    for (const candidate of candidateVariants(value)) {
      const logosVariantCanonical = parseLogosReference(candidate);
      if (logosVariantCanonical) {
        return logosVariantCanonical;
      }
      try {
        return parsePassage(candidate).canonical;
      } catch (e) {
        continue;
      }
    }
    return null;
  }
  function tryParseUrl(raw) {
    try {
      return new URL(raw);
    } catch (e) {
      if (raw.startsWith("www.")) {
        try {
          return new URL(`https://${raw}`);
        } catch (e2) {
          return null;
        }
      }
      return null;
    }
  }
  function parseEnduringWordPath(pathname) {
    var _a;
    const match = pathname.match(/\/bible-commentary\/([a-z0-9-]+)-(\d+)\/?$/i);
    const slug = (_a = match == null ? void 0 : match[1]) == null ? void 0 : _a.toLowerCase();
    const chapter = match == null ? void 0 : match[2];
    if (!slug || !chapter) {
      return null;
    }
    const book = ENDURING_WORD_SLUG_TO_BOOK.get(slug);
    if (!book) {
      return null;
    }
    return `${book}.${chapter}`;
  }
  function extractBibleSegmentReference(segments) {
    var _a;
    const bibleIndex = segments.findIndex((segment) => segment.toLowerCase() === "bible");
    if (bibleIndex < 0) {
      return null;
    }
    const next = segments[bibleIndex + 1];
    if (!next) {
      return null;
    }
    if (/^\d+$/.test(next)) {
      return (_a = segments[bibleIndex + 2]) != null ? _a : null;
    }
    return next;
  }
  function parseVerseAnchor(hash) {
    const cleaned = hash.trim().replace(/^[/#?]+|[/#?]+$/g, "");
    const match = cleaned.match(/^(?:v(?:erse)?[=:.-]?)?(\d+)(?:-(\d+))?$/i);
    if (!(match == null ? void 0 : match[1])) {
      return null;
    }
    const start = Number.parseInt(match[1], 10);
    if (!Number.isInteger(start) || start <= 0) {
      return null;
    }
    const endRaw = match[2];
    if (!endRaw) {
      return `${start}`;
    }
    const end = Number.parseInt(endRaw, 10);
    if (!Number.isInteger(end) || end < start) {
      return null;
    }
    return `${start}-${end}`;
  }
  function extractUrlTokens(text) {
    var _a;
    return (_a = text.match(new RegExp(URL_TOKEN_PATTERN, "gi"))) != null ? _a : [];
  }
  function extractReferenceTokens(text) {
    var _a;
    return unique((_a = text.match(new RegExp(REFERENCE_TOKEN_PATTERN, "gi"))) != null ? _a : []);
  }
  function normalizeCandidateToken(raw) {
    return raw.trim().replace(LEADING_WRAPPER_REGEX, "").replace(TRAILING_WRAPPER_REGEX, "").trim();
  }
  function collectCandidateMatches(input) {
    var _a, _b;
    const byToken = /* @__PURE__ */ new Map();
    const addCandidate = (rawToken, index, priority) => {
      const token = normalizeCandidateToken(rawToken);
      if (!token) {
        return;
      }
      const existing = byToken.get(token);
      if (!existing || index < existing.index || index === existing.index && priority > existing.priority) {
        byToken.set(token, { token, index, priority });
      }
    };
    for (const match of input.matchAll(new RegExp(URL_TOKEN_PATTERN, "gi"))) {
      if (!match[0]) {
        continue;
      }
      addCandidate(match[0], (_a = match.index) != null ? _a : 0, 3);
    }
    for (const match of input.matchAll(new RegExp(REFERENCE_TOKEN_PATTERN, "gi"))) {
      if (!match[0]) {
        continue;
      }
      addCandidate(match[0], (_b = match.index) != null ? _b : 0, 2);
    }
    return Array.from(byToken.values()).sort((a, b) => a.index - b.index || b.priority - a.priority || b.token.length - a.token.length);
  }
  function tryParseCanonical(canonical) {
    try {
      return parsePassage(canonical);
    } catch (e) {
      return null;
    }
  }
  function normalizeUrlSurface(text) {
    return tryDecode(text).replace(/[_./?&#=+%-]+/g, " ").replace(/\s+/g, " ").trim();
  }
  function extractReferenceWindows(text) {
    var _a, _b, _c;
    const tokens = (_a = text.match(/[A-Za-z0-9]+/g)) != null ? _a : [];
    const cappedTokens = tokens.slice(0, 80);
    const out = [];
    for (let start = 0; start < cappedTokens.length; start += 1) {
      for (let length = 2; length <= 6 && start + length <= cappedTokens.length; length += 1) {
        const slice = cappedTokens.slice(start, start + length);
        const hasLetter = slice.some((token) => /[a-z]/i.test(token));
        const hasDigit = slice.some((token) => /\d/.test(token));
        if (!hasLetter || !hasDigit) {
          continue;
        }
        out.push(slice.join(" "));
        const lastTwo = slice.slice(-2);
        if (/^\d+$/.test((_b = lastTwo[0]) != null ? _b : "") && /^\d+$/.test((_c = lastTwo[1]) != null ? _c : "")) {
          const bookTokens = slice.slice(0, -2);
          if (bookTokens.length > 0) {
            out.push(`${bookTokens.join(" ")} ${lastTwo[0]}:${lastTwo[1]}`);
          }
        }
        const lastThree = slice.slice(-3);
        if (lastThree.length === 3 && lastThree.every((token) => /^\d+$/.test(token))) {
          const bookTokens = slice.slice(0, -3);
          if (bookTokens.length > 0) {
            out.push(`${bookTokens.join(" ")} ${lastThree[0]}:${lastThree[1]}-${lastThree[2]}`);
          }
        }
      }
    }
    return unique(out);
  }
  function canonicalSpecificityScore(canonical) {
    try {
      const parsed = parsePassage(canonical);
      switch (parsed.rangeType) {
        case "cross_reference":
          return 140;
        case "same_chapter":
          return 130;
        case "single":
          return 120;
        case "chapter_range":
          return 60;
        case "chapter":
          return 40;
        default:
          return 10;
      }
    } catch (e) {
      return 0;
    }
  }
  function selectBestCanonical(candidates) {
    var _a;
    let best = null;
    for (const candidate of unique(candidates)) {
      const canonical = tryCanonicalFromCandidate(candidate);
      if (!canonical) {
        continue;
      }
      const score = canonicalSpecificityScore(canonical);
      const candidateLength = candidate.length;
      if (!best) {
        best = { canonical, score, candidateLength };
        continue;
      }
      if (score > best.score) {
        best = { canonical, score, candidateLength };
        continue;
      }
      if (score === best.score && candidateLength < best.candidateLength) {
        best = { canonical, score, candidateLength };
      }
    }
    return (_a = best == null ? void 0 : best.canonical) != null ? _a : null;
  }
  function parseFromUrl(raw) {
    var _a;
    const parsed = tryParseUrl(raw);
    if (!parsed) {
      return null;
    }
    const candidates = [];
    const chapterContextCandidates = [];
    const pathname = tryDecode(parsed.pathname);
    const segments = pathname.split("/").filter(Boolean).map((segment) => tryDecode(segment));
    const addChapterContextCandidate = (candidate) => {
      if (!candidate) {
        return;
      }
      candidates.push(candidate);
      chapterContextCandidates.push(candidate);
    };
    if (segments[0] === "v1" && segments[1] === "p" && segments[2]) {
      addChapterContextCandidate(segments[2]);
    }
    addChapterContextCandidate((_a = extractBibleSegmentReference(segments)) != null ? _a : void 0);
    for (const segment of segments) {
      if (/\d/.test(segment)) {
        candidates.push(segment);
      }
    }
    if (parsed.hostname.includes("logos.com")) {
      const bibleIndex = segments.findIndex((segment) => segment.toLowerCase() === "bible");
      const logosReference = bibleIndex >= 0 ? segments[bibleIndex + 1] : void 0;
      if (logosReference) {
        candidates.push(logosReference);
      }
      const referencesIndex = segments.findIndex((segment) => segment.toLowerCase() === "references");
      const logosDataReference = referencesIndex >= 0 ? segments[referencesIndex + 1] : void 0;
      if (logosDataReference) {
        candidates.push(logosDataReference);
      }
    }
    if (parsed.hostname.includes("biblegateway.com")) {
      const search = parsed.searchParams.get("search");
      if (search) {
        candidates.push(search);
      }
    }
    for (const value of parsed.searchParams.values()) {
      if (value) {
        candidates.push(value);
      }
    }
    const enduringWord = parseEnduringWordPath(pathname);
    if (enduringWord) {
      candidates.push(enduringWord);
    }
    for (const key of SHARE_QUERY_KEYS) {
      const value = parsed.searchParams.get(key);
      if (value) {
        candidates.push(value);
      }
    }
    if (parsed.hash) {
      const hash = tryDecode(parsed.hash.slice(1));
      if (hash) {
        candidates.push(hash);
        const hashParams = new URLSearchParams(hash);
        for (const key of SHARE_QUERY_KEYS) {
          const value = hashParams.get(key);
          if (value) {
            candidates.push(value);
          }
        }
        for (const value of hashParams.values()) {
          if (value) {
            candidates.push(value);
          }
        }
        const verseAnchor = parseVerseAnchor(hash);
        if (verseAnchor) {
          for (const chapterContext of unique(chapterContextCandidates)) {
            const canonical = tryCanonicalFromCandidate(chapterContext);
            if (!canonical) {
              continue;
            }
            try {
              const parsedCanonical = parsePassage(canonical);
              if (parsedCanonical.rangeType !== "chapter") {
                continue;
              }
            } catch (e) {
              continue;
            }
            candidates.push(`${canonical}.${verseAnchor}`);
          }
        }
      }
    }
    const structuralCanonical = selectBestCanonical(candidates);
    if (structuralCanonical) {
      return structuralCanonical;
    }
    const genericSources = unique([
      parsed.hostname,
      pathname,
      ...segments,
      tryDecode(parsed.search),
      tryDecode(parsed.hash),
      tryDecode(`${parsed.hostname}${parsed.pathname}${parsed.search}${parsed.hash}`)
    ]);
    for (const source of genericSources) {
      const normalized = normalizeUrlSurface(source);
      if (!normalized) {
        continue;
      }
      candidates.push(normalized);
      candidates.push(...extractReferenceTokens(normalized));
      candidates.push(...extractReferenceWindows(normalized));
    }
    return selectBestCanonical(candidates);
  }
  function parseFromText(raw) {
    const direct = tryCanonicalFromCandidate(raw);
    if (direct) {
      return direct;
    }
    for (const token of extractUrlTokens(raw)) {
      const canonical = parseFromUrl(token);
      if (canonical) {
        return canonical;
      }
    }
    for (const token of extractReferenceTokens(raw)) {
      const canonical = tryCanonicalFromCandidate(token);
      if (canonical) {
        return canonical;
      }
    }
    return null;
  }
  function parseCandidateCanonical(candidate) {
    var _a, _b;
    return (_b = (_a = parseFromUrl(candidate)) != null ? _a : tryCanonicalFromCandidate(candidate)) != null ? _b : parseFromText(candidate);
  }
  function findMultipleAnyPassages(input) {
    const trimmed = input.trim();
    if (!trimmed) {
      return [];
    }
    const passages = [];
    const seenCanonical = /* @__PURE__ */ new Set();
    const addPassage = (parsed) => {
      if (!parsed || seenCanonical.has(parsed.canonical)) {
        return;
      }
      seenCanonical.add(parsed.canonical);
      passages.push(parsed);
    };
    for (const candidate of collectCandidateMatches(trimmed)) {
      const canonical = parseCandidateCanonical(candidate.token);
      if (!canonical) {
        continue;
      }
      addPassage(tryParseCanonical(canonical));
    }
    if (passages.length > 0) {
      return passages;
    }
    addPassage(findSingleAnyPassage(trimmed));
    return passages;
  }
  function extractSharedCanonical(payload) {
    const values = [payload.url, payload.text, payload.title].filter((value) => typeof value === "string").map((value) => value.trim()).filter(Boolean);
    for (const value of values) {
      const fromUrl = parseFromUrl(value);
      if (fromUrl) {
        return fromUrl;
      }
      const fromText = parseFromText(value);
      if (fromText) {
        return fromText;
      }
    }
    return null;
  }
  function getAnyPassageCandidate(input) {
    const value = input.trim();
    if (!value) {
      return null;
    }
    const sharedCanonical = extractSharedCanonical({
      title: value,
      text: value,
      url: value
    });
    return sharedCanonical != null ? sharedCanonical : value;
  }
  function findSingleAnyPassage(input) {
    const candidate = getAnyPassageCandidate(input);
    if (!candidate) {
      return null;
    }
    try {
      return parsePassage(candidate);
    } catch (e) {
      return null;
    }
  }
  function tryParseSingleAnyPassage(input) {
    const candidate = getAnyPassageCandidate(input);
    if (!candidate) {
      return { ok: false, error: new PassageParseError("EMPTY", "Passage is required.") };
    }
    try {
      return { ok: true, value: parsePassage(candidate) };
    } catch (error) {
      if (error instanceof PassageParseError) {
        return { ok: false, error };
      }
      return {
        ok: false,
        error: new PassageParseError("INVALID_FORMAT", "Unable to parse passage.")
      };
    }
  }
  function tryParseAnyPassage(input, options = {}) {
    if (options.multiple) {
      const passages = findMultipleAnyPassages(input);
      if (passages.length > 0) {
        return { ok: true, value: passages };
      }
      const fallback = tryParseSingleAnyPassage(input);
      if (!fallback.ok) {
        return fallback;
      }
      return { ok: true, value: [fallback.value] };
    }
    return tryParseSingleAnyPassage(input);
  }

  // src/qml-api.ts
  function verseOrZero(value) {
    return typeof value === "number" && Number.isFinite(value) ? value : 0;
  }
  function plainPassage(parsed) {
    return {
      input: parsed.input,
      canonical: parsed.canonical,
      display: formatPassageForDisplay(parsed),
      rangeType: parsed.rangeType,
      startBook: parsed.start.book,
      startChapter: parsed.start.chapter,
      startVerse: verseOrZero(parsed.start.verse),
      endBook: parsed.end.book,
      endChapter: parsed.end.chapter,
      endVerse: verseOrZero(parsed.end.verse)
    };
  }
  function tryParse(input) {
    const result = tryParseAnyPassage(String(input || ""));
    if (!result.ok) {
      return {
        ok: false,
        message: result.error.message,
        code: result.error.code
      };
    }
    const value = Array.isArray(result.value) ? result.value[0] : result.value;
    if (!value) {
      return { ok: false, message: "No passage found.", code: "EMPTY" };
    }
    return { ok: true, passage: plainPassage(value) };
  }
  function suggest(input, limit) {
    const cap = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 20) : 8;
    return autocompletePassage(String(input || ""), { limit: cap }).map((item) => ({
      label: item.label,
      insertText: item.insertText,
      canonical: item.canonical,
      kind: item.kind
    }));
  }
  function bookCodes() {
    return [...OSIS_BOOK_CODES];
  }
  function bookName(code) {
    var _a, _b;
    const resolved = (_a = resolveBookAlias(code)) != null ? _a : code in OSIS_BOOK_NAMES ? code : null;
    if (!resolved) return code;
    return (_b = OSIS_BOOK_NAMES[resolved]) != null ? _b : code;
  }
  function chapterCount(book) {
    const resolved = resolveBookAlias(book);
    if (!resolved) return 0;
    return getChapterCount(resolved);
  }
  function verseCount(book, chapter) {
    var _a;
    const resolved = resolveBookAlias(book);
    if (!resolved) return 0;
    return (_a = getVerseCount(resolved, chapter)) != null ? _a : 0;
  }
  function resolveBook(input) {
    var _a;
    return (_a = resolveBookAlias(input)) != null ? _a : "";
  }
  return __toCommonJS(qml_api_exports);
})();

function tryParse() { return GrabBcvApi.tryParse.apply(null, arguments); }
function suggest() { return GrabBcvApi.suggest.apply(null, arguments); }
function bookCodes() { return GrabBcvApi.bookCodes.apply(null, arguments); }
function bookName() { return GrabBcvApi.bookName.apply(null, arguments); }
function chapterCount() { return GrabBcvApi.chapterCount.apply(null, arguments); }
function verseCount() { return GrabBcvApi.verseCount.apply(null, arguments); }
function resolveBook() { return GrabBcvApi.resolveBook.apply(null, arguments); }
