export const DEFAULT_BOOK = "JHN";
export const DEFAULT_CHAPTER = 3;
export const DEFAULT_VERSE = 16;
export const OT_BOOK_COUNT = 39;

export function defaultBook(): string {
  return DEFAULT_BOOK;
}

export function defaultChapter(): number {
  return DEFAULT_CHAPTER;
}

export function defaultVerse(): number {
  return DEFAULT_VERSE;
}

export const BOOK_ABBREV: Record<string, string> = {
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

export type VerseRow = {
  n: number;
  t: string;
  heading?: string;
  subhead?: string;
  refs?: string;
  h?: string;
  s?: string;
  r?: string;
};
export type BibleIndex = Record<string, VerseRow[]>;
export type Place = { book: string; chapter: number };
export type Selection = {
  book: string;
  chapter: number;
  startVerse: number;
  endVerse: number;
};

export function chapterKey(book: string, chapter: number): string {
  return `${book}.${chapter}`;
}

export function normalizeVerse(row: Partial<VerseRow> & { n?: number; t?: string }): VerseRow {
  const heading = String(row.heading || row.h || "");
  const subhead = String(row.subhead || row.s || "");
  const refs = String(row.refs || row.r || "");
  return {
    n: Math.floor(Number(row.n) || 0),
    t: String(row.t || ""),
    heading,
    subhead,
    refs
  };
}

export function normalizeIndex(bible: BibleIndex | Record<string, Array<Partial<VerseRow>>> | null | undefined): BibleIndex {
  const out: BibleIndex = {};
  if (!bible) return out;
  for (const [key, rows] of Object.entries(bible)) {
    if (!Array.isArray(rows)) continue;
    out[key] = rows.map((row) => normalizeVerse(row));
  }
  return out;
}

export function versesFor(bible: BibleIndex | null | undefined, book: string, chapter: number): VerseRow[] {
  if (!bible) return [];
  const rows = bible[chapterKey(book, chapter)];
  return Array.isArray(rows) ? rows : [];
}

export type ReaderBlock = {
  kind: "heading" | "subhead" | "refs" | "verse";
  text: string;
  n: number;
  t: string;
  spaced: boolean;
};

export function readerBlocks(bible: BibleIndex | null | undefined, book: string, chapter: number): ReaderBlock[] {
  const rows = versesFor(bible, book, chapter).map((row) => normalizeVerse(row));
  const blocks: ReaderBlock[] = [];
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

export function lastVerseNumber(bible: BibleIndex | null | undefined, book: string, chapter: number): number {
  const rows = versesFor(bible, book, chapter);
  if (rows.length === 0) return 1;
  return rows[rows.length - 1]?.n ?? rows.length;
}

export function clampVerse(
  bible: BibleIndex | null | undefined,
  book: string,
  chapter: number,
  verse: number
): number {
  const last = lastVerseNumber(bible, book, chapter);
  const n = Math.floor(Number(verse) || 1);
  if (n < 1) return 1;
  if (n > last) return last;
  return n;
}

export function orderedRange(a: number, b: number): { start: number; end: number } {
  const left = Math.floor(Number(a) || 1);
  const right = Math.floor(Number(b) || left);
  return left <= right ? { start: left, end: right } : { start: right, end: left };
}

export function hasVerseSelection(startVerse: number, endVerse: number): boolean {
  return Math.floor(Number(startVerse)) >= 1 && Math.floor(Number(endVerse)) >= 1;
}

export function isWholeChapter(startVerse: number, endVerse: number, verseCount: number): boolean {
  return startVerse <= 1 && endVerse >= verseCount && verseCount > 0;
}

function isChapterLevel(selection: Selection, verseCount: number): boolean {
  if (!hasVerseSelection(selection.startVerse, selection.endVerse)) return true;
  const { start, end } = orderedRange(selection.startVerse, selection.endVerse);
  return isWholeChapter(start, end, verseCount);
}

export function toCanonical(selection: Selection, verseCount: number): string {
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

export function formatCompact(selection: Selection, verseCount: number): string {
  const abbrev = BOOK_ABBREV[selection.book] || selection.book;
  if (isChapterLevel(selection, verseCount)) {
    return `${abbrev} ${selection.chapter}`;
  }
  const { start, end } = orderedRange(selection.startVerse, selection.endVerse);
  if (start === end) {
    return `${abbrev} ${selection.chapter}:${start}`;
  }
  return `${abbrev} ${selection.chapter}:${start}–${end}`;
}

export function formatDisplay(selection: Selection, bookName: string, verseCount: number): string {
  if (isChapterLevel(selection, verseCount)) {
    return `${bookName} ${selection.chapter}`;
  }
  const { start, end } = orderedRange(selection.startVerse, selection.endVerse);
  if (start === end) {
    return `${bookName} ${selection.chapter}:${start}`;
  }
  return `${bookName} ${selection.chapter}:${start}–${end}`;
}

export function nextChapter(book: string, chapter: number, bookCodes: string[], chapterCount: (book: string) => number): Place {
  const max = chapterCount(book);
  if (chapter < max) {
    return { book, chapter: chapter + 1 };
  }
  const idx = bookCodes.indexOf(book);
  if (idx < 0 || idx >= bookCodes.length - 1) {
    return { book, chapter };
  }
  return { book: bookCodes[idx + 1] ?? book, chapter: 1 };
}

export function prevChapter(book: string, chapter: number, bookCodes: string[], chapterCount: (book: string) => number): Place {
  if (chapter > 1) {
    return { book, chapter: chapter - 1 };
  }
  const idx = bookCodes.indexOf(book);
  if (idx <= 0) {
    return { book, chapter: 1 };
  }
  const prev = bookCodes[idx - 1] ?? book;
  return { book: prev, chapter: Math.max(1, chapterCount(prev)) };
}

export function nextBook(book: string, bookCodes: string[]): Place {
  const idx = bookCodes.indexOf(book);
  if (idx < 0 || idx >= bookCodes.length - 1) {
    return { book, chapter: 1 };
  }
  return { book: bookCodes[idx + 1] ?? book, chapter: 1 };
}

export function prevBook(book: string, bookCodes: string[]): Place {
  const idx = bookCodes.indexOf(book);
  if (idx <= 0) {
    return { book, chapter: 1 };
  }
  return { book: bookCodes[idx - 1] ?? book, chapter: 1 };
}

export function testamentOf(book: string, bookCodes: string[]): "ot" | "nt" {
  const idx = bookCodes.indexOf(book);
  return idx >= OT_BOOK_COUNT ? "nt" : "ot";
}

export function booksForTestament(testament: "ot" | "nt", bookCodes: string[]): string[] {
  return testament === "nt" ? bookCodes.slice(OT_BOOK_COUNT) : bookCodes.slice(0, OT_BOOK_COUNT);
}

export function selectedText(bible: BibleIndex | null | undefined, selection: Selection): string {
  if (!hasVerseSelection(selection.startVerse, selection.endVerse)) return "";
  const rows = versesFor(bible, selection.book, selection.chapter);
  const { start, end } = orderedRange(selection.startVerse, selection.endVerse);
  return rows
    .filter((row) => row.n >= start && row.n <= end)
    .map((row) => {
      const parts: string[] = [];
      if (row.heading) parts.push(row.heading);
      if (row.subhead) parts.push(row.subhead);
      if (row.refs) parts.push(`(${row.refs})`);
      parts.push(`${row.n} ${row.t}`);
      return parts.join("\n");
    })
    .join("\n");
}

export function serializeState(selection: Selection): string {
  return JSON.stringify({
    book: selection.book,
    chapter: selection.chapter,
    startVerse: selection.startVerse,
    endVerse: selection.endVerse
  });
}

function parseVerseBound(value: unknown, fallback: number): number {
  if (value === 0 || value === "0") return 0;
  if (value === undefined || value === null || value === "") return fallback;
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n)) return fallback;
  return Math.max(0, n);
}

export function parseState(raw: string, fallback: Selection = {
  book: DEFAULT_BOOK,
  chapter: DEFAULT_CHAPTER,
  startVerse: DEFAULT_VERSE,
  endVerse: DEFAULT_VERSE
}): Selection {
  try {
    const parsed = JSON.parse(String(raw || "{}")) as Record<string, unknown>;
    const book = typeof parsed.book === "string" && parsed.book ? parsed.book : fallback.book;
    const chapter = Math.max(1, Math.floor(Number(parsed.chapter) || fallback.chapter));
    const startVerse = parseVerseBound(parsed.startVerse, fallback.startVerse);
    const endVerse = parseVerseBound(parsed.endVerse, startVerse === 0 ? 0 : fallback.endVerse);
    if (startVerse < 1 || endVerse < 1) {
      return { book, chapter, startVerse: 0, endVerse: 0 };
    }
    return { book, chapter, startVerse, endVerse: Math.max(startVerse, endVerse) };
  } catch {
    return { ...fallback };
  }
}
