import { getChapterCount, getVerseCount, isOsisBookCode } from "grab-bcv";
import {
  CANON_BOOK_COUNT,
  CANON_CHAPTER_COUNT,
  MAX_BLOCKS_PER_CHAPTER,
  MAX_CHAPTER,
  MAX_CHAPTER_KEYS,
  MAX_INDEX_BYTES,
  MAX_JSON_DEPTH_INDEX,
  MAX_JSON_DEPTH_PUB,
  MAX_JSON_DEPTH_STATE,
  MAX_PARTS_PER_BLOCK,
  MAX_PUB_BYTES,
  MAX_SEARCH_CHARS,
  MAX_STATE_BYTES,
  MAX_STRING_CHARS,
  MAX_SUMMON_BYTES,
  MAX_JSON_DEPTH_SUMMON,
  MAX_VERSE,
  MAX_VERSES_PER_CHAPTER,
  MIN_CHAPTER_KEYS,
  PUB_KINDS,
  boundInt,
  boundString,
  jsonBoundsOk,
  type PubKind
} from "./limits";

export {
  jsonBoundsOk,
  MAX_INDEX_BYTES,
  MAX_PUB_BYTES,
  MAX_STATE_BYTES,
  MAX_CHAPTER,
  MAX_VERSE
} from "./limits";

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

export function isKnownBook(book: string): boolean {
  return Object.prototype.hasOwnProperty.call(BOOK_ABBREV, book);
}

export function isChapterKey(key: string): boolean {
  const split = String(key || "").split(".");
  if (split.length !== 2) return false;
  const [book, chapterToken] = split;
  if (!book || !isKnownBook(book)) return false;
  const chapter = boundInt(chapterToken, 1, MAX_CHAPTER);
  return chapter != null;
}

function clipString(value: unknown): string {
  const text = boundString(value, MAX_STRING_CHARS);
  return text == null ? "" : text;
}

export function normalizeVerse(row: Partial<VerseRow> & { n?: number; t?: string }): VerseRow {
  const heading = clipString(row.heading || row.h || "");
  const subhead = clipString(row.subhead || row.s || "");
  const refs = clipString(row.refs || row.r || "");
  const n = boundInt(row.n, 0, MAX_VERSE) ?? 0;
  return {
    n,
    t: clipString(row.t || ""),
    heading,
    subhead,
    refs
  };
}

function sanitizeVerseRow(row: unknown): VerseRow | null {
  if (!row || typeof row !== "object" || Array.isArray(row)) return null;
  const rec = row as Record<string, unknown>;
  const n = boundInt(rec.n, 1, MAX_VERSE);
  const t = boundString(rec.t);
  const heading = boundString(rec.heading ?? rec.h ?? "");
  const subhead = boundString(rec.subhead ?? rec.s ?? "");
  const refs = boundString(rec.refs ?? rec.r ?? "");
  if (n == null || t == null || heading == null || subhead == null || refs == null) return null;
  return { n, t, heading, subhead, refs };
}

function sanitizeVerseRows(rows: unknown): VerseRow[] | null {
  if (!Array.isArray(rows) || rows.length > MAX_VERSES_PER_CHAPTER) return null;
  const out: VerseRow[] = [];
  for (const row of rows) {
    const next = sanitizeVerseRow(row);
    if (!next) return null;
    out.push(next);
  }
  return out;
}

export function normalizeIndex(bible: BibleIndex | Record<string, Array<Partial<VerseRow>>> | null | undefined): BibleIndex {
  const out: BibleIndex = Object.create(null);
  if (!bible || typeof bible !== "object" || Array.isArray(bible)) return out;
  for (const [key, rows] of Object.entries(bible)) {
    if (!isChapterKey(key)) continue;
    const next = sanitizeVerseRows(rows);
    if (!next) continue;
    out[key] = next;
  }
  return out;
}

function parseObject(raw: string, maxBytes: number, maxDepth: number): Record<string, unknown> | null {
  const text = String(raw || "");
  if (!jsonBoundsOk(text, maxBytes, maxDepth)) return null;
  try {
    const parsed = JSON.parse(text) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function parseIndex(raw: string): BibleIndex | null {
  const parsed = parseObject(raw, MAX_INDEX_BYTES, MAX_JSON_DEPTH_INDEX);
  if (!parsed) return null;
  const keys = Object.keys(parsed);
  if (keys.length < MIN_CHAPTER_KEYS || keys.length > MAX_CHAPTER_KEYS) return null;
  const out: BibleIndex = Object.create(null);
  for (const key of keys) {
    if (!isChapterKey(key)) return null;
    const rows = sanitizeVerseRows(parsed[key]);
    if (!rows || rows.length < 1) return null;
    out[key] = rows;
  }
  return out;
}

export function assertBibleIndex(index: BibleIndex): void {
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

export function versesFor(bible: BibleIndex | null | undefined, book: string, chapter: number): VerseRow[] {
  if (!bible || !isKnownBook(book)) return [];
  const chapterNum = boundInt(chapter, 1, MAX_CHAPTER);
  if (chapterNum == null) return [];
  const rows = sanitizeVerseRows(bible[chapterKey(book, chapterNum)]);
  return rows || [];
}

export type ReaderBlock = {
  kind: "heading" | "subhead" | "refs" | "verse";
  text: string;
  n: number;
  t: string;
  spaced: boolean;
};

export type PubPart = {
  n: number;
  t: string;
  wj: boolean;
  showNum: boolean;
};

export type PubBlock = {
  kind: string;
  spaced: boolean;
  indent: number;
  text: string;
  parts: PubPart[];
  join?: boolean;
  joinNext?: boolean;
  fillVerse?: number;
};

const FLOW_KINDS = new Set(["para", "q1", "q2", "li", "d"]);
const BRIDGE_KINDS = new Set(["blank"]);

function lastVerse(block: PubBlock): number {
  const parts = block.parts || [];
  if (!parts.length) return 0;
  return Math.floor(Number(parts[parts.length - 1]?.n) || 0);
}

function firstVerse(block: PubBlock): number {
  const parts = block.parts || [];
  if (!parts.length) return 0;
  return Math.floor(Number(parts[0]?.n) || 0);
}

function isFlow(block: PubBlock): boolean {
  return FLOW_KINDS.has(block.kind);
}

function nextFlowIndex(blocks: PubBlock[], start: number): number {
  for (let i = start; i < blocks.length; i++) {
    if (isFlow(blocks[i])) return i;
    if (!BRIDGE_KINDS.has(blocks[i].kind)) return -1;
  }
  return -1;
}

export function splitRefs(text: string): string[] {
  return String(text || "")
    .replace(/^[(\s]+/, "")
    .replace(/[)\s]+$/, "")
    .split(/\s*;\s*/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function parseRefInput(text: string): string {
  return String(text || "")
    .trim()
    .replace(/[–—]/g, "-");
}

const PUB_KIND_SET = new Set<string>(PUB_KINDS);

function sanitizePubPart(part: unknown): PubPart | null {
  if (!part || typeof part !== "object" || Array.isArray(part)) return null;
  const rec = part as Record<string, unknown>;
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

function sanitizePubBlock(row: unknown): PubBlock | null {
  if (!row || typeof row !== "object" || Array.isArray(row)) return null;
  const rec = row as Record<string, unknown>;
  const kind = boundString(rec.kind, 16);
  if (kind == null || !PUB_KIND_SET.has(kind)) return null;
  const text = boundString(rec.text);
  const indent = boundInt(rec.indent ?? 0, 0, 4);
  if (text == null || indent == null) return null;
  if (!Array.isArray(rec.parts) || rec.parts.length > MAX_PARTS_PER_BLOCK) return null;
  const parts: PubPart[] = [];
  for (const part of rec.parts) {
    const next = sanitizePubPart(part);
    if (!next) return null;
    parts.push(next);
  }
  return {
    kind: kind as PubKind,
    spaced: rec.spaced === true,
    indent,
    text,
    parts
  };
}

function sanitizePubBlocks(rows: unknown): PubBlock[] | null {
  if (!Array.isArray(rows) || rows.length > MAX_BLOCKS_PER_CHAPTER) return null;
  const out: PubBlock[] = [];
  for (const row of rows) {
    const next = sanitizePubBlock(row);
    if (!next) return null;
    out.push(next);
  }
  return out;
}

export function parsePublication(raw: string): Record<string, PubBlock[]> | null {
  const parsed = parseObject(raw, MAX_PUB_BYTES, MAX_JSON_DEPTH_PUB);
  if (!parsed) return null;
  const keys = Object.keys(parsed);
  if (keys.length < MIN_CHAPTER_KEYS || keys.length > MAX_CHAPTER_KEYS) return null;
  const out: Record<string, PubBlock[]> = Object.create(null);
  for (const key of keys) {
    if (!isChapterKey(key)) return null;
    const rows = sanitizePubBlocks(parsed[key]);
    if (!rows || rows.length < 1) return null;
    out[key] = rows;
  }
  return out;
}

export function assertPubIndex(pub: Record<string, PubBlock[]>): void {
  const keys = Object.keys(pub);
  if (keys.length !== CANON_CHAPTER_COUNT) {
    throw new Error(`publication chapter count ${keys.length}, expected ${CANON_CHAPTER_COUNT}`);
  }
  const books = new Set(keys.map((key) => key.split(".")[0]));
  if (books.size !== CANON_BOOK_COUNT) {
    throw new Error(`publication book count ${books.size}, expected ${CANON_BOOK_COUNT}`);
  }
}

export function pubBlocks(
  pub: Record<string, PubBlock[]> | null | undefined,
  book: string,
  chapter: number
): PubBlock[] {
  if (!pub || !isKnownBook(book)) return [];
  const chapterNum = boundInt(chapter, 1, MAX_CHAPTER);
  if (chapterNum == null) return [];
  const rows = pub[chapterKey(book, chapterNum)];
  const sanitized = sanitizePubBlocks(rows);
  if (!sanitized) return [];
  const out = sanitized.map((row) => ({ ...row, join: false, joinNext: false, fillVerse: 0 }));
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

export function verseInRange(verse: number, startVerse: number, endVerse: number): boolean {
  if (!hasVerseSelection(startVerse, endVerse)) return false;
  const { start, end } = orderedRange(startVerse, endVerse);
  const n = Math.floor(Number(verse) || 0);
  return n >= start && n <= end;
}

function listLength(value: unknown): number {
  if (!value || typeof value !== "object") return 0;
  const length = (value as { length?: unknown }).length;
  return typeof length === "number" && Number.isFinite(length) && length >= 0 ? length : 0;
}

function partVerseNumber(part: unknown): number {
  if (!part || typeof part !== "object") return 0;
  return Math.floor(Number((part as { n?: unknown }).n) || 0);
}

function eachPart(parts: unknown, visit: (part: unknown) => void): void {
  const len = listLength(parts);
  for (let i = 0; i < len; i++) {
    const part = (parts as Record<number, unknown>)[i];
    if (part) visit(part);
  }
}

export function uniqueBlockVerses(block: Pick<PubBlock, "parts" | "kind">): number[] {
  const seen = new Set<number>();
  eachPart(block.parts, (part) => {
    const n = partVerseNumber(part);
    if (n >= 1) seen.add(n);
  });
  return [...seen].sort((a, b) => a - b);
}

export function pubBlockUsesPerVerseHighlight(block: PubBlock): boolean {
  return FLOW_KINDS.has(block.kind) && uniqueBlockVerses(block).length > 1;
}

export function readerBlockSelected(
  block: PubBlock,
  startVerse: number,
  endVerse: number
): boolean {
  if (pubBlockUsesPerVerseHighlight(block)) return false;
  if (!hasVerseSelection(startVerse, endVerse)) return false;
  const lo = Math.min(startVerse, endVerse);
  const hi = Math.max(startVerse, endVerse);
  const fillVerse = Math.floor(Number(block.fillVerse) || 0);
  if (fillVerse >= 1) return fillVerse >= lo && fillVerse <= hi;
  if (block.kind === "verse") {
    const verseNum = Math.floor(Number((block as { n?: unknown }).n) || 0);
    return verseNum >= lo && verseNum <= hi;
  }
  if (!FLOW_KINDS.has(block.kind)) return false;
  let hit = false;
  eachPart(block.parts, (part) => {
    const n = partVerseNumber(part);
    if (n >= lo && n <= hi) hit = true;
  });
  return hit;
}

export type UsfmHighlightState = {
  mode: "block" | "per-run";
  selected: number[];
  hovered: number[];
};

export function usfmHighlightState(
  block: PubBlock,
  focusVerse: number,
  startVerse: number,
  endVerse: number,
  searchActive = false
): UsfmHighlightState {
  const verses = uniqueBlockVerses(block);
  const perRun = pubBlockUsesPerVerseHighlight(block);
  if (perRun) {
    return {
      mode: "per-run",
      selected: verses.filter((n) => verseSelected(n, startVerse, endVerse, searchActive)),
      hovered: verses.filter((n) => verseHovered(n, focusVerse, startVerse, endVerse, searchActive))
    };
  }
  const hasSel = hasVerseSelection(startVerse, endVerse);
  if (hasSel) {
    const { start, end } = orderedRange(startVerse, endVerse);
    const blockSelected = verses.some((n) => n >= start && n <= end);
    return { mode: "block", selected: blockSelected ? verses : [], hovered: [] };
  }
  if (searchActive) return { mode: "block", selected: [], hovered: [] };
  const focus = Math.floor(Number(focusVerse) || 0);
  const blockHovered = verses.includes(focus);
  return { mode: "block", selected: [], hovered: blockHovered ? verses : [] };
}

export function verseSelected(
  verse: number,
  startVerse: number,
  endVerse: number,
  searchActive = false
): boolean {
  if (searchActive) return false;
  return verseInRange(verse, startVerse, endVerse);
}

export function verseHovered(
  verse: number,
  focusVerse: number,
  startVerse: number,
  endVerse: number,
  searchActive = false
): boolean {
  if (searchActive) return false;
  const n = Math.floor(Number(verse) || 0);
  if (verseSelected(n, startVerse, endVerse, false)) return false;
  return n === Math.floor(Number(focusVerse) || 0);
}

export function pubRowIndexForVerse(
  rows: Array<PubBlock | ReaderBlock>,
  verse: number
): number {
  const n = Math.floor(Number(verse) || 0);
  if (n < 1) return -1;
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!row) continue;
    if (row.kind === "verse" && "n" in row && row.n === n) return i;
    const parts = "parts" in row ? row.parts : undefined;
    let matched = false;
    eachPart(parts, (part) => {
      if (!matched && partVerseNumber(part) === n) matched = true;
    });
    if (matched) return i;
    if ("fillVerse" in row && row.fillVerse === n) return i;
  }
  return -1;
}

export function advanceFocusVerse(
  bible: BibleIndex | null | undefined,
  book: string,
  chapter: number,
  focusVerse: number,
  delta: number
): number {
  return clampVerse(bible, book, chapter, focusVerse + delta);
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

export type ParsedState = Selection & { publication: boolean };

export function stateMaxBytes(): number {
  return MAX_STATE_BYTES;
}

export function serializeState(selection: Selection, extras?: { publication?: boolean }): string {
  return JSON.stringify({
    book: selection.book,
    chapter: selection.chapter,
    startVerse: selection.startVerse,
    endVerse: selection.endVerse,
    publication: extras?.publication === true
  });
}

function fallbackState(fallback: Selection): ParsedState {
  return {
    book: isKnownBook(fallback.book) ? fallback.book : DEFAULT_BOOK,
    chapter: boundInt(fallback.chapter, 1, MAX_CHAPTER) ?? DEFAULT_CHAPTER,
    startVerse: boundInt(fallback.startVerse, 0, MAX_VERSE) ?? DEFAULT_VERSE,
    endVerse: boundInt(fallback.endVerse, 0, MAX_VERSE) ?? DEFAULT_VERSE,
    publication: false
  };
}

function parseVerseBound(value: unknown, fallback: number): number | null {
  if (value === 0 || value === "0") return 0;
  if (value === undefined || value === null || value === "") {
    return boundInt(fallback, 0, MAX_VERSE);
  }
  return boundInt(value, 0, MAX_VERSE);
}

export function parseState(raw: string, fallback: Selection = {
  book: DEFAULT_BOOK,
  chapter: DEFAULT_CHAPTER,
  startVerse: DEFAULT_VERSE,
  endVerse: DEFAULT_VERSE
}): ParsedState {
  const safe = fallbackState(fallback);
  const text = String(raw || "{}");
  if (!jsonBoundsOk(text, MAX_STATE_BYTES, MAX_JSON_DEPTH_STATE)) return safe;
  try {
    const parsed = JSON.parse(text) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return safe;
    const rec = parsed as Record<string, unknown>;
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
    const maxVerse = getVerseCount(book, chapter) ?? 0;
    if (maxVerse < 1 || startVerse > maxVerse || endVerse > maxVerse) return safe;
    return {
      book,
      chapter,
      startVerse,
      endVerse: Math.max(startVerse, endVerse),
      publication
    };
  } catch {
    return safe;
  }
}

export function parseSummonPayload(raw: unknown): { q: string } | null {
  if (typeof raw !== "string" || !jsonBoundsOk(raw, MAX_SUMMON_BYTES, MAX_JSON_DEPTH_SUMMON)) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    const q = (parsed as Record<string, unknown>).q;
    if (typeof q !== "string") return null;
    const text = q.trim();
    if (!text || text.length > MAX_SEARCH_CHARS || text.includes("\0")) return null;
    return { q: text };
  } catch {
    return null;
  }
}
