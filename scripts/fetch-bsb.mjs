import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { getVerseCount, resolveBookAlias } from "grab-bcv";

const ARWEAVE_URL = "https://arweave.net/B6yeNb3lk_VkiIp-fTWVh13TlM94LjLK6kC63BPXa8s";
const lab = join(dirname(fileURLToPath(import.meta.url)), "..");
const outPath = join(lab, "data/bsb.json");

const response = await fetch(ARWEAVE_URL, {
  headers: { "User-Agent": "route-bible-omarchy/1.0" },
  redirect: "follow"
});

if (!response.ok) {
  throw new Error(`Failed to fetch BSB JSONL: ${response.status} ${response.statusText}`);
}

const raw = await response.text();
const index = {};
let skipped = 0;
let verses = 0;

for (const line of raw.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed) continue;
  let row;
  try {
    row = JSON.parse(trimmed);
  } catch {
    skipped += 1;
    continue;
  }

  const book = resolveBookAlias(String(row.book || ""));
  const chapter = Number.parseInt(String(row.chapter || ""), 10);
  const n = Number.parseInt(String(row.verseNum || row.verse || ""), 10);
  const text = String(row.text || "").trim();
  if (!book || !Number.isFinite(chapter) || chapter < 1 || !Number.isFinite(n) || n < 1 || !text) {
    skipped += 1;
    continue;
  }

  const key = `${book}.${chapter}`;
  if (!index[key]) index[key] = [];
  index[key].push({ n, t: text });
  verses += 1;
}

for (const key of Object.keys(index)) {
  index[key].sort((a, b) => a.n - b.n);
}

let mismatches = 0;
for (const [key, rows] of Object.entries(index)) {
  const [book, chapterToken] = key.split(".");
  const expected = getVerseCount(book, Number(chapterToken));
  if (expected && rows.length !== expected) {
    mismatches += 1;
  }
}

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(index));
console.log(
  `Wrote ${outPath} (${verses} verses, ${Object.keys(index).length} chapters, ${skipped} skipped, ${mismatches} count mismatches)`
);
