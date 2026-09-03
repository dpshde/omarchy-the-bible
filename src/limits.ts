export const MAX_INDEX_BYTES = 6_000_000;
export const MAX_PUB_BYTES = 16_000_000;
export const MAX_USJ_BYTES = 8_000_000;
export const MAX_STATE_BYTES = 2048;
export const MAX_SEARCH_CHARS = 512;
export const MAX_PARSE_CHARS = 2048;
export const MAX_SUMMON_BYTES = 1024;
export const MAX_JSON_DEPTH_SUMMON = 2;

export const MAX_CHAPTER_KEYS = 1300;
export const MIN_CHAPTER_KEYS = 1000;
export const CANON_CHAPTER_COUNT = 1189;
export const CANON_BOOK_COUNT = 66;

export const MAX_VERSES_PER_CHAPTER = 200;
export const MAX_BLOCKS_PER_CHAPTER = 600;
export const MAX_PARTS_PER_BLOCK = 32;
export const MAX_STRING_CHARS = 4096;

export const MAX_JSON_DEPTH_INDEX = 4;
export const MAX_JSON_DEPTH_PUB = 6;
export const MAX_JSON_DEPTH_USJ = 24;
export const MAX_JSON_DEPTH_STATE = 3;

export const MAX_CHAPTER = 150;
export const MAX_VERSE = 200;

export const PUB_KINDS = [
  "heading",
  "subhead",
  "refs",
  "blank",
  "para",
  "q1",
  "q2",
  "li",
  "d"
] as const;

export type PubKind = (typeof PUB_KINDS)[number];

export function jsonBoundsOk(raw: string, maxBytes: number, maxDepth: number): boolean {
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

export function boundString(value: unknown, max = MAX_STRING_CHARS): string | null {
  if (value == null) return "";
  if (typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean") {
    return null;
  }
  const text = String(value);
  if (text.length > max) return null;
  return text;
}

export function boundInt(value: unknown, min: number, max: number): number | null {
  if (typeof value === "boolean") return null;
  const n = typeof value === "number" ? value : typeof value === "string" ? Number(value) : Number.NaN;
  if (!Number.isFinite(n)) return null;
  const whole = Math.floor(n);
  if (whole < min || whole > max) return null;
  return whole;
}
