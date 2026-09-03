// Generated from /workspace/src/bible.ts. Do not edit by hand.
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
var BibleApi = (function() {
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

  // src/bible.ts
  var bible_exports = {};
  __export(bible_exports, {
    BOOK_ABBREV: () => BOOK_ABBREV,
    DEFAULT_BOOK: () => DEFAULT_BOOK,
    DEFAULT_CHAPTER: () => DEFAULT_CHAPTER,
    DEFAULT_VERSE: () => DEFAULT_VERSE,
    MAX_CHAPTER: () => MAX_CHAPTER,
    MAX_INDEX_BYTES: () => MAX_INDEX_BYTES,
    MAX_PUB_BYTES: () => MAX_PUB_BYTES,
    MAX_STATE_BYTES: () => MAX_STATE_BYTES,
    MAX_VERSE: () => MAX_VERSE,
    OT_BOOK_COUNT: () => OT_BOOK_COUNT,
    assertBibleIndex: () => assertBibleIndex,
    assertPubIndex: () => assertPubIndex,
    booksForTestament: () => booksForTestament,
    chapterKey: () => chapterKey,
    clampVerse: () => clampVerse,
    defaultBook: () => defaultBook,
    defaultChapter: () => defaultChapter,
    defaultVerse: () => defaultVerse,
    formatCompact: () => formatCompact,
    formatDisplay: () => formatDisplay,
    hasVerseSelection: () => hasVerseSelection,
    isChapterKey: () => isChapterKey,
    isKnownBook: () => isKnownBook,
    isWholeChapter: () => isWholeChapter,
    jsonBoundsOk: () => jsonBoundsOk,
    lastVerseNumber: () => lastVerseNumber,
    nextBook: () => nextBook,
    nextChapter: () => nextChapter,
    normalizeIndex: () => normalizeIndex,
    normalizeVerse: () => normalizeVerse,
    orderedRange: () => orderedRange,
    parseIndex: () => parseIndex,
    parsePublication: () => parsePublication,
    parseRefInput: () => parseRefInput,
    parseState: () => parseState,
    parseSummonPayload: () => parseSummonPayload,
    prevBook: () => prevBook,
    prevChapter: () => prevChapter,
    pubBlocks: () => pubBlocks,
    readerBlocks: () => readerBlocks,
    selectedText: () => selectedText,
    serializeState: () => serializeState,
    splitRefs: () => splitRefs,
    stateMaxBytes: () => stateMaxBytes,
    testamentOf: () => testamentOf,
    toCanonical: () => toCanonical,
    versesFor: () => versesFor
  });

  // node_modules/.pnpm/grab-bcv@0.1.7/node_modules/grab-bcv/dist/chunk-DDWKUFQF.js
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

  // src/limits.ts
  var MAX_INDEX_BYTES = 6e6;
  var MAX_PUB_BYTES = 16e6;
  var MAX_STATE_BYTES = 2048;
  var MAX_SEARCH_CHARS = 512;
  var MAX_SUMMON_BYTES = 1024;
  var MAX_JSON_DEPTH_SUMMON = 2;
  var MAX_CHAPTER_KEYS = 1300;
  var MIN_CHAPTER_KEYS = 1e3;
  var CANON_CHAPTER_COUNT = 1189;
  var CANON_BOOK_COUNT = 66;
  var MAX_VERSES_PER_CHAPTER = 200;
  var MAX_BLOCKS_PER_CHAPTER = 600;
  var MAX_PARTS_PER_BLOCK = 32;
  var MAX_STRING_CHARS = 4096;
  var MAX_JSON_DEPTH_INDEX = 4;
  var MAX_JSON_DEPTH_PUB = 6;
  var MAX_JSON_DEPTH_STATE = 3;
  var MAX_CHAPTER = 150;
  var MAX_VERSE = 200;
  var PUB_KINDS = [
    "heading",
    "subhead",
    "refs",
    "blank",
    "para",
    "q1",
    "q2",
    "li",
    "d"
  ];
  function jsonBoundsOk(raw, maxBytes, maxDepth) {
    if (typeof raw !== "string") return false;
    if (raw.length > maxBytes) return false;
    let depth = 0;
    let inString = false;
    let escape = false;
    for (let i = 0; i < raw.length; i++) {
      const ch = raw.charCodeAt(i);
      if (inString) {
        if (escape) {
          escape = false;
          continue;
        }
        if (ch === 92) {
          escape = true;
          continue;
        }
        if (ch === 34) inString = false;
        continue;
      }
      if (ch === 34) {
        inString = true;
        continue;
      }
      if (ch === 123 || ch === 91) {
        depth += 1;
        if (depth > maxDepth) return false;
        continue;
      }
      if (ch === 125 || ch === 93) {
        depth -= 1;
        if (depth < 0) return false;
      }
    }
    return depth === 0 && !inString;
  }
  function boundString(value, max = MAX_STRING_CHARS) {
    if (value == null) return "";
    if (typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean") {
      return null;
    }
    const text = String(value);
    if (text.length > max) return null;
    return text;
  }
  function boundInt(value, min, max) {
    if (typeof value === "boolean") return null;
    const n = typeof value === "number" ? value : typeof value === "string" ? Number(value) : Number.NaN;
    if (!Number.isFinite(n)) return null;
    const whole = Math.floor(n);
    if (whole < min || whole > max) return null;
    return whole;
  }

  // src/bible.ts
  var DEFAULT_BOOK = "JHN";
  var DEFAULT_CHAPTER = 3;
  var DEFAULT_VERSE = 16;
  var OT_BOOK_COUNT = 39;
  function defaultBook() {
    return DEFAULT_BOOK;
  }
  function defaultChapter() {
    return DEFAULT_CHAPTER;
  }
  function defaultVerse() {
    return DEFAULT_VERSE;
  }
  var BOOK_ABBREV = {
    GEN: "Gen",
    EXO: "Exod",
    LEV: "Lev",
    NUM: "Num",
    DEU: "Deut",
    JOS: "Josh",
    JDG: "Judg",
    RUT: "Ruth",
    "1SA": "1 Sam",
    "2SA": "2 Sam",
    "1KI": "1 Kgs",
    "2KI": "2 Kgs",
    "1CH": "1 Chr",
    "2CH": "2 Chr",
    EZR: "Ezra",
    NEH: "Neh",
    EST: "Esth",
    JOB: "Job",
    PSA: "Ps",
    PRO: "Prov",
    ECC: "Eccl",
    SNG: "Song",
    ISA: "Isa",
    JER: "Jer",
    LAM: "Lam",
    EZK: "Ezek",
    DAN: "Dan",
    HOS: "Hos",
    JOL: "Joel",
    AMO: "Amos",
    OBA: "Obad",
    JON: "Jonah",
    MIC: "Mic",
    NAM: "Nah",
    HAB: "Hab",
    ZEP: "Zeph",
    HAG: "Hag",
    ZEC: "Zech",
    MAL: "Mal",
    MAT: "Matt",
    MRK: "Mark",
    LUK: "Luke",
    JHN: "Jn",
    ACT: "Acts",
    ROM: "Rom",
    "1CO": "1 Cor",
    "2CO": "2 Cor",
    GAL: "Gal",
    EPH: "Eph",
    PHP: "Phil",
    COL: "Col",
    "1TH": "1 Thess",
    "2TH": "2 Thess",
    "1TI": "1 Tim",
    "2TI": "2 Tim",
    TIT: "Titus",
    PHM: "Phlm",
    HEB: "Heb",
    JAS: "Jas",
    "1PE": "1 Pet",
    "2PE": "2 Pet",
    "1JN": "1 Jn",
    "2JN": "2 Jn",
    "3JN": "3 Jn",
    JUD: "Jude",
    REV: "Rev"
  };
  function chapterKey(book, chapter) {
    return `${book}.${chapter}`;
  }
  function isKnownBook(book) {
    return Object.prototype.hasOwnProperty.call(BOOK_ABBREV, book);
  }
  function isChapterKey(key) {
    const split = String(key || "").split(".");
    if (split.length !== 2) return false;
    const [book, chapterToken] = split;
    if (!book || !isKnownBook(book)) return false;
    const chapter = boundInt(chapterToken, 1, MAX_CHAPTER);
    return chapter != null;
  }
  function clipString(value) {
    const text = boundString(value, MAX_STRING_CHARS);
    return text == null ? "" : text;
  }
  function normalizeVerse(row) {
    var _a;
    const heading = clipString(row.heading || row.h || "");
    const subhead = clipString(row.subhead || row.s || "");
    const refs = clipString(row.refs || row.r || "");
    const n = (_a = boundInt(row.n, 0, MAX_VERSE)) != null ? _a : 0;
    return {
      n,
      t: clipString(row.t || ""),
      heading,
      subhead,
      refs
    };
  }
  function sanitizeVerseRow(row) {
    var _a, _b, _c, _d, _e, _f;
    if (!row || typeof row !== "object" || Array.isArray(row)) return null;
    const rec = row;
    const n = boundInt(rec.n, 1, MAX_VERSE);
    const t = boundString(rec.t);
    const heading = boundString((_b = (_a = rec.heading) != null ? _a : rec.h) != null ? _b : "");
    const subhead = boundString((_d = (_c = rec.subhead) != null ? _c : rec.s) != null ? _d : "");
    const refs = boundString((_f = (_e = rec.refs) != null ? _e : rec.r) != null ? _f : "");
    if (n == null || t == null || heading == null || subhead == null || refs == null) return null;
    return { n, t, heading, subhead, refs };
  }
  function sanitizeVerseRows(rows) {
    if (!Array.isArray(rows) || rows.length > MAX_VERSES_PER_CHAPTER) return null;
    const out = [];
    for (const row of rows) {
      const next = sanitizeVerseRow(row);
      if (!next) return null;
      out.push(next);
    }
    return out;
  }
  function normalizeIndex(bible) {
    const out = /* @__PURE__ */ Object.create(null);
    if (!bible || typeof bible !== "object" || Array.isArray(bible)) return out;
    for (const [key, rows] of Object.entries(bible)) {
      if (!isChapterKey(key)) continue;
      const next = sanitizeVerseRows(rows);
      if (!next) continue;
      out[key] = next;
    }
    return out;
  }
  function parseObject(raw, maxBytes, maxDepth) {
    const text = String(raw || "");
    if (!jsonBoundsOk(text, maxBytes, maxDepth)) return null;
    try {
      const parsed = JSON.parse(text);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
      return parsed;
    } catch (e) {
      return null;
    }
  }
  function parseIndex(raw) {
    const parsed = parseObject(raw, MAX_INDEX_BYTES, MAX_JSON_DEPTH_INDEX);
    if (!parsed) return null;
    const keys = Object.keys(parsed);
    if (keys.length < MIN_CHAPTER_KEYS || keys.length > MAX_CHAPTER_KEYS) return null;
    const out = /* @__PURE__ */ Object.create(null);
    for (const key of keys) {
      if (!isChapterKey(key)) return null;
      const rows = sanitizeVerseRows(parsed[key]);
      if (!rows || rows.length < 1) return null;
      out[key] = rows;
    }
    return out;
  }
  function assertBibleIndex(index) {
    const keys = Object.keys(index);
    if (keys.length !== CANON_CHAPTER_COUNT) {
      throw new Error(`bible chapter count ${keys.length}, expected ${CANON_CHAPTER_COUNT}`);
    }
    if (keys.length > MAX_CHAPTER_KEYS) {
      throw new Error(`bible chapter count ${keys.length} exceeds max`);
    }
    const books = new Set(keys.map((key) => key.split(".")[0]));
    if (books.size !== CANON_BOOK_COUNT) {
      throw new Error(`bible book count ${books.size}, expected ${CANON_BOOK_COUNT}`);
    }
    for (const book of Object.keys(BOOK_ABBREV)) {
      if (!index[`${book}.1`]) throw new Error(`missing ${book}.1`);
    }
  }
  function versesFor(bible, book, chapter) {
    if (!bible || !isKnownBook(book)) return [];
    const chapterNum = boundInt(chapter, 1, MAX_CHAPTER);
    if (chapterNum == null) return [];
    const rows = sanitizeVerseRows(bible[chapterKey(book, chapterNum)]);
    return rows || [];
  }
  var FLOW_KINDS = /* @__PURE__ */ new Set(["para", "q1", "q2", "li", "d"]);
  var BRIDGE_KINDS = /* @__PURE__ */ new Set(["blank"]);
  function lastVerse(block) {
    var _a;
    const parts = block.parts || [];
    if (!parts.length) return 0;
    return Math.floor(Number((_a = parts[parts.length - 1]) == null ? void 0 : _a.n) || 0);
  }
  function firstVerse(block) {
    var _a;
    const parts = block.parts || [];
    if (!parts.length) return 0;
    return Math.floor(Number((_a = parts[0]) == null ? void 0 : _a.n) || 0);
  }
  function isFlow(block) {
    return FLOW_KINDS.has(block.kind);
  }
  function nextFlowIndex(blocks, start) {
    for (let i = start; i < blocks.length; i++) {
      if (isFlow(blocks[i])) return i;
      if (!BRIDGE_KINDS.has(blocks[i].kind)) return -1;
    }
    return -1;
  }
  function splitRefs(text) {
    return String(text || "").replace(/^[(\s]+/, "").replace(/[)\s]+$/, "").split(/\s*;\s*/).map((part) => part.trim()).filter(Boolean);
  }
  function parseRefInput(text) {
    return String(text || "").trim().replace(/[–—]/g, "-");
  }
  var PUB_KIND_SET = new Set(PUB_KINDS);
  function sanitizePubPart(part) {
    if (!part || typeof part !== "object" || Array.isArray(part)) return null;
    const rec = part;
    const n = boundInt(rec.n, 1, MAX_VERSE);
    const t = boundString(rec.t);
    if (n == null || t == null) return null;
    return {
      n,
      t,
      wj: rec.wj === true,
      showNum: rec.showNum === true
    };
  }
  function sanitizePubBlock(row) {
    var _a;
    if (!row || typeof row !== "object" || Array.isArray(row)) return null;
    const rec = row;
    const kind = boundString(rec.kind, 16);
    if (kind == null || !PUB_KIND_SET.has(kind)) return null;
    const text = boundString(rec.text);
    const indent = boundInt((_a = rec.indent) != null ? _a : 0, 0, 4);
    if (text == null || indent == null) return null;
    if (!Array.isArray(rec.parts) || rec.parts.length > MAX_PARTS_PER_BLOCK) return null;
    const parts = [];
    for (const part of rec.parts) {
      const next = sanitizePubPart(part);
      if (!next) return null;
      parts.push(next);
    }
    return {
      kind,
      spaced: rec.spaced === true,
      indent,
      text,
      parts
    };
  }
  function sanitizePubBlocks(rows) {
    if (!Array.isArray(rows) || rows.length > MAX_BLOCKS_PER_CHAPTER) return null;
    const out = [];
    for (const row of rows) {
      const next = sanitizePubBlock(row);
      if (!next) return null;
      out.push(next);
    }
    return out;
  }
  function parsePublication(raw) {
    const parsed = parseObject(raw, MAX_PUB_BYTES, MAX_JSON_DEPTH_PUB);
    if (!parsed) return null;
    const keys = Object.keys(parsed);
    if (keys.length < MIN_CHAPTER_KEYS || keys.length > MAX_CHAPTER_KEYS) return null;
    const out = /* @__PURE__ */ Object.create(null);
    for (const key of keys) {
      if (!isChapterKey(key)) return null;
      const rows = sanitizePubBlocks(parsed[key]);
      if (!rows || rows.length < 1) return null;
      out[key] = rows;
    }
    return out;
  }
  function assertPubIndex(pub) {
    const keys = Object.keys(pub);
    if (keys.length !== CANON_CHAPTER_COUNT) {
      throw new Error(`publication chapter count ${keys.length}, expected ${CANON_CHAPTER_COUNT}`);
    }
    const books = new Set(keys.map((key) => key.split(".")[0]));
    if (books.size !== CANON_BOOK_COUNT) {
      throw new Error(`publication book count ${books.size}, expected ${CANON_BOOK_COUNT}`);
    }
  }
  function pubBlocks(pub, book, chapter) {
    if (!pub || !isKnownBook(book)) return [];
    const chapterNum = boundInt(chapter, 1, MAX_CHAPTER);
    if (chapterNum == null) return [];
    const rows = pub[chapterKey(book, chapterNum)];
    const sanitized = sanitizePubBlocks(rows);
    if (!sanitized) return [];
    const out = sanitized.map((row) => __spreadProps(__spreadValues({}, row), { join: false, joinNext: false, fillVerse: 0 }));
    for (let i = 0; i < out.length; i++) {
      if (!isFlow(out[i])) continue;
      const next = nextFlowIndex(out, i + 1);
      if (next < 0) continue;
      const verse = lastVerse(out[i]);
      if (verse < 1 || verse !== firstVerse(out[next])) continue;
      out[i].joinNext = true;
      out[next].join = true;
      out[i].fillVerse = verse;
      out[next].fillVerse = verse;
      for (let j = i + 1; j < next; j++) {
        out[j].join = true;
        out[j].joinNext = true;
        out[j].fillVerse = verse;
      }
    }
    return out;
  }
  function readerBlocks(bible, book, chapter) {
    const rows = versesFor(bible, book, chapter).map((row) => normalizeVerse(row));
    const blocks = [];
    for (const row of rows) {
      const spaced = blocks.length > 0;
      if (row.heading) {
        blocks.push({ kind: "heading", text: row.heading, n: 0, t: "", spaced });
      }
      if (row.subhead) {
        blocks.push({ kind: "subhead", text: row.subhead, n: 0, t: "", spaced: blocks.length > 0 && !row.heading });
      }
      if (row.refs) {
        blocks.push({ kind: "refs", text: row.refs, n: 0, t: "", spaced: false });
      }
      blocks.push({ kind: "verse", text: "", n: row.n, t: row.t, spaced: false });
    }
    return blocks;
  }
  function lastVerseNumber(bible, book, chapter) {
    var _a, _b;
    const rows = versesFor(bible, book, chapter);
    if (rows.length === 0) return 1;
    return (_b = (_a = rows[rows.length - 1]) == null ? void 0 : _a.n) != null ? _b : rows.length;
  }
  function clampVerse(bible, book, chapter, verse) {
    const last = lastVerseNumber(bible, book, chapter);
    const n = Math.floor(Number(verse) || 1);
    if (n < 1) return 1;
    if (n > last) return last;
    return n;
  }
  function orderedRange(a, b) {
    const left = Math.floor(Number(a) || 1);
    const right = Math.floor(Number(b) || left);
    return left <= right ? { start: left, end: right } : { start: right, end: left };
  }
  function hasVerseSelection(startVerse, endVerse) {
    return Math.floor(Number(startVerse)) >= 1 && Math.floor(Number(endVerse)) >= 1;
  }
  function isWholeChapter(startVerse, endVerse, verseCount) {
    return startVerse <= 1 && endVerse >= verseCount && verseCount > 0;
  }
  function isChapterLevel(selection, verseCount) {
    if (!hasVerseSelection(selection.startVerse, selection.endVerse)) return true;
    const { start, end } = orderedRange(selection.startVerse, selection.endVerse);
    return isWholeChapter(start, end, verseCount);
  }
  function toCanonical(selection, verseCount) {
    const { book, chapter } = selection;
    if (isChapterLevel(selection, verseCount)) {
      return `${book}.${chapter}`;
    }
    const { start, end } = orderedRange(selection.startVerse, selection.endVerse);
    if (start === end) {
      return `${book}.${chapter}.${start}`;
    }
    return `${book}.${chapter}.${start}-${end}`;
  }
  function formatCompact(selection, verseCount) {
    const abbrev = BOOK_ABBREV[selection.book] || selection.book;
    if (isChapterLevel(selection, verseCount)) {
      return `${abbrev} ${selection.chapter}`;
    }
    const { start, end } = orderedRange(selection.startVerse, selection.endVerse);
    if (start === end) {
      return `${abbrev} ${selection.chapter}:${start}`;
    }
    return `${abbrev} ${selection.chapter}:${start}\u2013${end}`;
  }
  function formatDisplay(selection, bookName, verseCount) {
    if (isChapterLevel(selection, verseCount)) {
      return `${bookName} ${selection.chapter}`;
    }
    const { start, end } = orderedRange(selection.startVerse, selection.endVerse);
    if (start === end) {
      return `${bookName} ${selection.chapter}:${start}`;
    }
    return `${bookName} ${selection.chapter}:${start}\u2013${end}`;
  }
  function nextChapter(book, chapter, bookCodes, chapterCount) {
    var _a;
    const max = chapterCount(book);
    if (chapter < max) {
      return { book, chapter: chapter + 1 };
    }
    const idx = bookCodes.indexOf(book);
    if (idx < 0 || idx >= bookCodes.length - 1) {
      return { book, chapter };
    }
    return { book: (_a = bookCodes[idx + 1]) != null ? _a : book, chapter: 1 };
  }
  function prevChapter(book, chapter, bookCodes, chapterCount) {
    var _a;
    if (chapter > 1) {
      return { book, chapter: chapter - 1 };
    }
    const idx = bookCodes.indexOf(book);
    if (idx <= 0) {
      return { book, chapter: 1 };
    }
    const prev = (_a = bookCodes[idx - 1]) != null ? _a : book;
    return { book: prev, chapter: Math.max(1, chapterCount(prev)) };
  }
  function nextBook(book, bookCodes) {
    var _a;
    const idx = bookCodes.indexOf(book);
    if (idx < 0 || idx >= bookCodes.length - 1) {
      return { book, chapter: 1 };
    }
    return { book: (_a = bookCodes[idx + 1]) != null ? _a : book, chapter: 1 };
  }
  function prevBook(book, bookCodes) {
    var _a;
    const idx = bookCodes.indexOf(book);
    if (idx <= 0) {
      return { book, chapter: 1 };
    }
    return { book: (_a = bookCodes[idx - 1]) != null ? _a : book, chapter: 1 };
  }
  function testamentOf(book, bookCodes) {
    const idx = bookCodes.indexOf(book);
    return idx >= OT_BOOK_COUNT ? "nt" : "ot";
  }
  function booksForTestament(testament, bookCodes) {
    return testament === "nt" ? bookCodes.slice(OT_BOOK_COUNT) : bookCodes.slice(0, OT_BOOK_COUNT);
  }
  function selectedText(bible, selection) {
    if (!hasVerseSelection(selection.startVerse, selection.endVerse)) return "";
    const rows = versesFor(bible, selection.book, selection.chapter);
    const { start, end } = orderedRange(selection.startVerse, selection.endVerse);
    return rows.filter((row) => row.n >= start && row.n <= end).map((row) => {
      const parts = [];
      if (row.heading) parts.push(row.heading);
      if (row.subhead) parts.push(row.subhead);
      if (row.refs) parts.push(`(${row.refs})`);
      parts.push(`${row.n} ${row.t}`);
      return parts.join("\n");
    }).join("\n");
  }
  function stateMaxBytes() {
    return MAX_STATE_BYTES;
  }
  function serializeState(selection, extras) {
    return JSON.stringify({
      book: selection.book,
      chapter: selection.chapter,
      startVerse: selection.startVerse,
      endVerse: selection.endVerse,
      publication: (extras == null ? void 0 : extras.publication) === true
    });
  }
  function fallbackState(fallback) {
    var _a, _b, _c;
    return {
      book: isKnownBook(fallback.book) ? fallback.book : DEFAULT_BOOK,
      chapter: (_a = boundInt(fallback.chapter, 1, MAX_CHAPTER)) != null ? _a : DEFAULT_CHAPTER,
      startVerse: (_b = boundInt(fallback.startVerse, 0, MAX_VERSE)) != null ? _b : DEFAULT_VERSE,
      endVerse: (_c = boundInt(fallback.endVerse, 0, MAX_VERSE)) != null ? _c : DEFAULT_VERSE,
      publication: false
    };
  }
  function parseVerseBound(value, fallback) {
    if (value === 0 || value === "0") return 0;
    if (value === void 0 || value === null || value === "") {
      return boundInt(fallback, 0, MAX_VERSE);
    }
    return boundInt(value, 0, MAX_VERSE);
  }
  function parseState(raw, fallback = {
    book: DEFAULT_BOOK,
    chapter: DEFAULT_CHAPTER,
    startVerse: DEFAULT_VERSE,
    endVerse: DEFAULT_VERSE
  }) {
    var _a;
    const safe = fallbackState(fallback);
    const text = String(raw || "{}");
    if (!jsonBoundsOk(text, MAX_STATE_BYTES, MAX_JSON_DEPTH_STATE)) return safe;
    try {
      const parsed = JSON.parse(text);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return safe;
      const rec = parsed;
      if (typeof rec.book !== "string" || !isKnownBook(rec.book) || !isOsisBookCode(rec.book)) return safe;
      const book = rec.book;
      const chapter = boundInt(rec.chapter, 1, MAX_CHAPTER);
      if (chapter == null) return safe;
      if (chapter > getChapterCount(book)) return safe;
      const startVerse = parseVerseBound(rec.startVerse, safe.startVerse);
      const endVerse = parseVerseBound(rec.endVerse, startVerse === 0 ? 0 : safe.endVerse);
      if (startVerse == null || endVerse == null) return safe;
      const publication = rec.publication === true;
      if (startVerse < 1 || endVerse < 1) {
        return { book, chapter, startVerse: 0, endVerse: 0, publication };
      }
      const maxVerse = (_a = getVerseCount(book, chapter)) != null ? _a : 0;
      if (maxVerse < 1 || startVerse > maxVerse || endVerse > maxVerse) return safe;
      return {
        book,
        chapter,
        startVerse,
        endVerse: Math.max(startVerse, endVerse),
        publication
      };
    } catch (e) {
      return safe;
    }
  }
  function parseSummonPayload(raw) {
    if (typeof raw !== "string" || !jsonBoundsOk(raw, MAX_SUMMON_BYTES, MAX_JSON_DEPTH_SUMMON)) {
      return null;
    }
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
      const q = parsed.q;
      if (typeof q !== "string") return null;
      const text = q.trim();
      if (!text || text.length > MAX_SEARCH_CHARS || text.includes("\0")) return null;
      return { q: text };
    } catch (e) {
      return null;
    }
  }
  return __toCommonJS(bible_exports);
})();

function defaultBook() { return BibleApi.defaultBook.apply(null, arguments); }
function defaultChapter() { return BibleApi.defaultChapter.apply(null, arguments); }
function defaultVerse() { return BibleApi.defaultVerse.apply(null, arguments); }
function chapterKey() { return BibleApi.chapterKey.apply(null, arguments); }
function normalizeIndex() { return BibleApi.normalizeIndex.apply(null, arguments); }
function normalizeVerse() { return BibleApi.normalizeVerse.apply(null, arguments); }
function parseIndex() { return BibleApi.parseIndex.apply(null, arguments); }
function parsePublication() { return BibleApi.parsePublication.apply(null, arguments); }
function versesFor() { return BibleApi.versesFor.apply(null, arguments); }
function readerBlocks() { return BibleApi.readerBlocks.apply(null, arguments); }
function pubBlocks() { return BibleApi.pubBlocks.apply(null, arguments); }
function splitRefs() { return BibleApi.splitRefs.apply(null, arguments); }
function parseRefInput() { return BibleApi.parseRefInput.apply(null, arguments); }
function lastVerseNumber() { return BibleApi.lastVerseNumber.apply(null, arguments); }
function clampVerse() { return BibleApi.clampVerse.apply(null, arguments); }
function orderedRange() { return BibleApi.orderedRange.apply(null, arguments); }
function hasVerseSelection() { return BibleApi.hasVerseSelection.apply(null, arguments); }
function isWholeChapter() { return BibleApi.isWholeChapter.apply(null, arguments); }
function toCanonical() { return BibleApi.toCanonical.apply(null, arguments); }
function formatCompact() { return BibleApi.formatCompact.apply(null, arguments); }
function formatDisplay() { return BibleApi.formatDisplay.apply(null, arguments); }
function nextChapter() { return BibleApi.nextChapter.apply(null, arguments); }
function prevChapter() { return BibleApi.prevChapter.apply(null, arguments); }
function nextBook() { return BibleApi.nextBook.apply(null, arguments); }
function prevBook() { return BibleApi.prevBook.apply(null, arguments); }
function testamentOf() { return BibleApi.testamentOf.apply(null, arguments); }
function booksForTestament() { return BibleApi.booksForTestament.apply(null, arguments); }
function selectedText() { return BibleApi.selectedText.apply(null, arguments); }
function serializeState() { return BibleApi.serializeState.apply(null, arguments); }
function parseState() { return BibleApi.parseState.apply(null, arguments); }
function parseSummonPayload() { return BibleApi.parseSummonPayload.apply(null, arguments); }
function stateMaxBytes() { return BibleApi.stateMaxBytes.apply(null, arguments); }
function isKnownBook() { return BibleApi.isKnownBook.apply(null, arguments); }
