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

export function suggest(input: string, limit: number) {
  const cap = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 20) : 8;
  return autocompletePassage(String(input || ""), { limit: cap }).map((item) => ({
    label: item.label,
    insertText: item.insertText,
    canonical: item.canonical,
    kind: item.kind
  }));
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
