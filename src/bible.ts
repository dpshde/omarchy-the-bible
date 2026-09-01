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

export type VerseRow = { n: number; t: string };
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

export function versesFor(bible: BibleIndex | null | undefined, book: string, chapter: number): VerseRow[] {
  if (!bible) return [];
  const rows = bible[chapterKey(book, chapter)];
  return Array.isArray(rows) ? rows : [];
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

export function isWholeChapter(startVerse: number, endVerse: number, verseCount: number): boolean {
  return startVerse <= 1 && endVerse >= verseCount && verseCount > 0;
}

export function toCanonical(selection: Selection, verseCount: number): string {
  const { book, chapter } = selection;
  const { start, end } = orderedRange(selection.startVerse, selection.endVerse);
  if (isWholeChapter(start, end, verseCount)) {
    return `${book}.${chapter}`;
  }
  if (start === end) {
    return `${book}.${chapter}.${start}`;
  }
  return `${book}.${chapter}.${start}-${end}`;
}

export function formatCompact(selection: Selection, verseCount: number): string {
  const abbrev = BOOK_ABBREV[selection.book] || selection.book;
  const { start, end } = orderedRange(selection.startVerse, selection.endVerse);
  if (isWholeChapter(start, end, verseCount)) {
    return `${abbrev} ${selection.chapter}`;
  }
  if (start === end) {
    return `${abbrev} ${selection.chapter}:${start}`;
  }
  return `${abbrev} ${selection.chapter}:${start}–${end}`;
}

export function formatDisplay(selection: Selection, bookName: string, verseCount: number): string {
  const { start, end } = orderedRange(selection.startVerse, selection.endVerse);
  if (isWholeChapter(start, end, verseCount)) {
    return `${bookName} ${selection.chapter}`;
  }
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
  const rows = versesFor(bible, selection.book, selection.chapter);
  const { start, end } = orderedRange(selection.startVerse, selection.endVerse);
  return rows
    .filter((row) => row.n >= start && row.n <= end)
    .map((row) => `${row.n} ${row.t}`)
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

export function parseState(raw: string, fallback: Selection = {
  book: DEFAULT_BOOK,
  chapter: DEFAULT_CHAPTER,
  startVerse: DEFAULT_VERSE,
  endVerse: DEFAULT_VERSE
}): Selection {
  try {
    const parsed = JSON.parse(String(raw || "{}")) as Partial<Selection>;
    const book = typeof parsed.book === "string" && parsed.book ? parsed.book : fallback.book;
    const chapter = Math.max(1, Math.floor(Number(parsed.chapter) || fallback.chapter));
    const startVerse = Math.max(1, Math.floor(Number(parsed.startVerse) || fallback.startVerse));
    const endVerse = Math.max(startVerse, Math.floor(Number(parsed.endVerse) || startVerse));
    return { book, chapter, startVerse, endVerse };
  } catch {
    return { ...fallback };
  }
}
