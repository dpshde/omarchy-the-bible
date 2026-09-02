import {
  OSIS_BOOK_CODES,
  OSIS_BOOK_NAMES,
  autocompletePassage,
  formatPassageForDisplay,
  getChapterCount,
  getVerseCount,
  resolveBookAlias,
  tryParseAnyPassage,
  type ParsedPassage
} from "grab-bcv";

export type PlainPassage = {
  input: string;
  canonical: string;
  display: string;
  rangeType: string;
  startBook: string;
  startChapter: number;
  startVerse: number;
  endBook: string;
  endChapter: number;
  endVerse: number;
};

export type ParseResult =
  | { ok: true; passage: PlainPassage }
  | { ok: false; message: string; code: string };

function verseOrZero(value: number | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function plainPassage(parsed: ParsedPassage): PlainPassage {
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

export function tryParse(input: string): ParseResult {
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

function bookPrefix(input: string): string {
  return String(input || "")
    .trim()
    .replace(/\s+\d[\s\d:\-–.]*$/, "")
    .trim();
}

function hasExactBookName(input: string): boolean {
  const prefix = bookPrefix(input);
  if (!prefix) return false;
  const book = resolveBook(prefix);
  if (!book) return false;
  const name = String(bookName(book) || "").replace(/\s+/g, " ").trim();
  const typed = prefix.replace(/\s+/g, " ");
  return !!name && typed.toLowerCase() === name.toLowerCase();
}

export function suggest(input: string, limit: number) {
  const cap = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 20) : 8;
  const raw = String(input || "");
  if (hasExactBookName(raw)) return [];
  return autocompletePassage(raw, { limit: cap })
    .filter((item) => item.kind === "book")
    .map((item) => ({
      label: item.label,
      insertText: item.insertText,
      canonical: item.canonical,
      kind: item.kind,
      extra: ""
    }));
}

export function typingHint(input: string): string {
  const trimmed = String(input || "").trim();
  if (!trimmed) return "";

  const verseMatch = trimmed.match(/^(.+?)\s+(\d+)\s*:\s*(\d*)(?:-(\d*))?$/);
  if (verseMatch) {
    const book = resolveBook(verseMatch[1] ?? "");
    const chapter = Number.parseInt(verseMatch[2] ?? "", 10);
    if (book && chapter >= 1) {
      const verses = verseCount(book, chapter);
      if (verses) return `${verses} verse${verses === 1 ? "" : "s"} in ${bookName(book)} ${chapter}`;
    }
  }

  const chapterMatch = trimmed.match(/^(.+?)\s+(\d+)$/);
  if (chapterMatch) {
    const book = resolveBook(chapterMatch[1] ?? "");
    const chapter = Number.parseInt(chapterMatch[2] ?? "", 10);
    if (book && chapter >= 1 && chapter <= chapterCount(book)) {
      const verses = verseCount(book, chapter);
      if (verses) return `${verses} verse${verses === 1 ? "" : "s"} in ${bookName(book)} ${chapter}`;
    }
  }

  const book = resolveBook(bookPrefix(trimmed));
  if (book) {
    const chapters = chapterCount(book);
    if (chapters) return `${chapters} chapter${chapters === 1 ? "" : "s"} in ${bookName(book)}`;
  }

  return "";
}

export function bookCodes(): string[] {
  return [...OSIS_BOOK_CODES];
}

export function bookName(code: string): string {
  const resolved = resolveBookAlias(code) ?? (code in OSIS_BOOK_NAMES ? (code as keyof typeof OSIS_BOOK_NAMES) : null);
  if (!resolved) return code;
  return OSIS_BOOK_NAMES[resolved] ?? code;
}

export function chapterCount(book: string): number {
  const resolved = resolveBookAlias(book);
  if (!resolved) return 0;
  return getChapterCount(resolved);
}

export function verseCount(book: string, chapter: number): number {
  const resolved = resolveBookAlias(book);
  if (!resolved) return 0;
  return getVerseCount(resolved, chapter) ?? 0;
}

export function resolveBook(input: string): string {
  return resolveBookAlias(input) ?? "";
}
