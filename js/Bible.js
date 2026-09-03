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
    advanceFocusVerse: () => advanceFocusVerse,
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
    prevBook: () => prevBook,
    prevChapter: () => prevChapter,
    pubBlockUsesPerVerseHighlight: () => pubBlockUsesPerVerseHighlight,
    pubBlocks: () => pubBlocks,
    pubRowIndexForVerse: () => pubRowIndexForVerse,
    readerBlocks: () => readerBlocks,
    selectedText: () => selectedText,
    serializeState: () => serializeState,
    splitRefs: () => splitRefs,
    stateMaxBytes: () => stateMaxBytes,
    testamentOf: () => testamentOf,
    toCanonical: () => toCanonical,
    uniqueBlockVerses: () => uniqueBlockVerses,
    verseHovered: () => verseHovered,
    verseInRange: () => verseInRange,
    verseSelected: () => verseSelected,
    versesFor: () => versesFor
  });

  // src/limits.ts
  var MAX_INDEX_BYTES = 6e6;
  var MAX_PUB_BYTES = 16e6;
  var MAX_STATE_BYTES = 2048;
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
  function verseInRange(verse, startVerse, endVerse) {
    if (!hasVerseSelection(startVerse, endVerse)) return false;
    const { start, end } = orderedRange(startVerse, endVerse);
    const n = Math.floor(Number(verse) || 0);
    return n >= start && n <= end;
  }
  function uniqueBlockVerses(block) {
    const seen = /* @__PURE__ */ new Set();
    for (const part of block.parts || []) {
      const n = Math.floor(Number(part.n) || 0);
      if (n >= 1) seen.add(n);
    }
    return [...seen].sort((a, b) => a - b);
  }
  function pubBlockUsesPerVerseHighlight(block) {
    return FLOW_KINDS.has(block.kind) && uniqueBlockVerses(block).length > 1;
  }
  function verseSelected(verse, startVerse, endVerse, searchActive = false) {
    if (searchActive) return false;
    return verseInRange(verse, startVerse, endVerse);
  }
  function verseHovered(verse, focusVerse, startVerse, endVerse, searchActive = false) {
    if (searchActive) return false;
    const n = Math.floor(Number(verse) || 0);
    if (verseSelected(n, startVerse, endVerse, false)) return false;
    return n === Math.floor(Number(focusVerse) || 0);
  }
  function pubRowIndexForVerse(rows, verse) {
    const n = Math.floor(Number(verse) || 0);
    if (n < 1) return -1;
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row) continue;
      if (row.kind === "verse" && "n" in row && row.n === n) return i;
      const parts = "parts" in row ? row.parts : void 0;
      for (const part of parts || []) {
        if (Math.floor(Number(part.n) || 0) === n) return i;
      }
      if ("fillVerse" in row && row.fillVerse === n) return i;
    }
    return -1;
  }
  function advanceFocusVerse(bible, book, chapter, focusVerse, delta) {
    return clampVerse(bible, book, chapter, focusVerse + delta);
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
    const safe = fallbackState(fallback);
    const text = String(raw || "{}");
    if (!jsonBoundsOk(text, MAX_STATE_BYTES, MAX_JSON_DEPTH_STATE)) return safe;
    try {
      const parsed = JSON.parse(text);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return safe;
      const rec = parsed;
      if (typeof rec.book !== "string" || !isKnownBook(rec.book)) return safe;
      const chapter = boundInt(rec.chapter, 1, MAX_CHAPTER);
      if (chapter == null) return safe;
      const startVerse = parseVerseBound(rec.startVerse, safe.startVerse);
      const endVerse = parseVerseBound(rec.endVerse, startVerse === 0 ? 0 : safe.endVerse);
      if (startVerse == null || endVerse == null) return safe;
      const publication = rec.publication === true;
      if (startVerse < 1 || endVerse < 1) {
        return { book: rec.book, chapter, startVerse: 0, endVerse: 0, publication };
      }
      return {
        book: rec.book,
        chapter,
        startVerse,
        endVerse: Math.max(startVerse, endVerse),
        publication
      };
    } catch (e) {
      return safe;
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
function verseInRange() { return BibleApi.verseInRange.apply(null, arguments); }
function uniqueBlockVerses() { return BibleApi.uniqueBlockVerses.apply(null, arguments); }
function pubBlockUsesPerVerseHighlight() { return BibleApi.pubBlockUsesPerVerseHighlight.apply(null, arguments); }
function verseSelected() { return BibleApi.verseSelected.apply(null, arguments); }
function verseHovered() { return BibleApi.verseHovered.apply(null, arguments); }
function pubRowIndexForVerse() { return BibleApi.pubRowIndexForVerse.apply(null, arguments); }
function advanceFocusVerse() { return BibleApi.advanceFocusVerse.apply(null, arguments); }
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
function stateMaxBytes() { return BibleApi.stateMaxBytes.apply(null, arguments); }
function isKnownBook() { return BibleApi.isKnownBook.apply(null, arguments); }
