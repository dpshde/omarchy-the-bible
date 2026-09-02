// Generated from /home/dpshde/Developer/omarchy-route-bible/src/bible.ts. Do not edit by hand.
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
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
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
    OT_BOOK_COUNT: () => OT_BOOK_COUNT,
    booksForTestament: () => booksForTestament,
    chapterKey: () => chapterKey,
    clampVerse: () => clampVerse,
    defaultBook: () => defaultBook,
    defaultChapter: () => defaultChapter,
    defaultVerse: () => defaultVerse,
    formatCompact: () => formatCompact,
    formatDisplay: () => formatDisplay,
    hasVerseSelection: () => hasVerseSelection,
    isWholeChapter: () => isWholeChapter,
    lastVerseNumber: () => lastVerseNumber,
    nextBook: () => nextBook,
    nextChapter: () => nextChapter,
    orderedRange: () => orderedRange,
    parseState: () => parseState,
    prevBook: () => prevBook,
    prevChapter: () => prevChapter,
    selectedText: () => selectedText,
    serializeState: () => serializeState,
    testamentOf: () => testamentOf,
    toCanonical: () => toCanonical,
    versesFor: () => versesFor
  });
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
  function versesFor(bible, book, chapter) {
    if (!bible) return [];
    const rows = bible[chapterKey(book, chapter)];
    return Array.isArray(rows) ? rows : [];
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
      if (row.h) parts.push(row.h);
      if (row.s) parts.push(row.s);
      if (row.r) parts.push(`(${row.r})`);
      parts.push(`${row.n} ${row.t}`);
      return parts.join("\n");
    }).join("\n");
  }
  function serializeState(selection) {
    return JSON.stringify({
      book: selection.book,
      chapter: selection.chapter,
      startVerse: selection.startVerse,
      endVerse: selection.endVerse
    });
  }
  function parseVerseBound(value, fallback) {
    if (value === 0 || value === "0") return 0;
    if (value === void 0 || value === null || value === "") return fallback;
    const n = Math.floor(Number(value));
    if (!Number.isFinite(n)) return fallback;
    return Math.max(0, n);
  }
  function parseState(raw, fallback = {
    book: DEFAULT_BOOK,
    chapter: DEFAULT_CHAPTER,
    startVerse: DEFAULT_VERSE,
    endVerse: DEFAULT_VERSE
  }) {
    try {
      const parsed = JSON.parse(String(raw || "{}"));
      const book = typeof parsed.book === "string" && parsed.book ? parsed.book : fallback.book;
      const chapter = Math.max(1, Math.floor(Number(parsed.chapter) || fallback.chapter));
      const startVerse = parseVerseBound(parsed.startVerse, fallback.startVerse);
      const endVerse = parseVerseBound(parsed.endVerse, startVerse === 0 ? 0 : fallback.endVerse);
      if (startVerse < 1 || endVerse < 1) {
        return { book, chapter, startVerse: 0, endVerse: 0 };
      }
      return { book, chapter, startVerse, endVerse: Math.max(startVerse, endVerse) };
    } catch (e) {
      return __spreadValues({}, fallback);
    }
  }
  return __toCommonJS(bible_exports);
})();

function defaultBook() { return BibleApi.defaultBook.apply(null, arguments); }
function defaultChapter() { return BibleApi.defaultChapter.apply(null, arguments); }
function defaultVerse() { return BibleApi.defaultVerse.apply(null, arguments); }
function chapterKey() { return BibleApi.chapterKey.apply(null, arguments); }
function versesFor() { return BibleApi.versesFor.apply(null, arguments); }
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
