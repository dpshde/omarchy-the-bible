import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { buildSync } from "esbuild";
import { getVerseCount, resolveBookAlias } from "grab-bcv";

export const USJ_URL = "https://bereanbible.com/bsb_usj.zip";
export const EXPECTED_SHA256 = "53acad65d590f5bc8cded3e14b37b7b02916f6a365211bcf60ea733ecd800e8f";
export const ALLOWED_HOSTS = new Set(["bereanbible.com", "www.bereanbible.com", "berean.bible", "www.berean.bible"]);

export const MAX_REDIRECTS = 3;
export const MAX_DOWNLOAD_BYTES = 32 * 1024 * 1024;
export const MAX_ZIP_FILES = 80;
export const MAX_ZIP_DEPTH = 4;
export const MAX_ZIP_FILE_BYTES = 8 * 1024 * 1024;
export const MAX_ZIP_TOTAL_BYTES = 80 * 1024 * 1024;
export const MAX_USJ_JSON_DEPTH = 24;
export const REQUIRED_USJ_FILES = 66;

const lab = join(dirname(fileURLToPath(import.meta.url)), "..");
const outPath = join(lab, "data/bsb.json");
const pubPath = join(lab, "data/pub.json");

export function zipEntryAllowed(name, size) {
  if (typeof name !== "string" || !name) return false;
  if (name.includes("\0")) return false;
  if (name.endsWith("/")) return false;
  if (name.startsWith("/") || name.startsWith("\\")) return false;
  if (name.includes("\\")) return false;
  const parts = name.split("/");
  if (parts.length < 1 || parts.length > MAX_ZIP_DEPTH) return false;
  for (const part of parts) {
    if (!part || part === "." || part === "..") return false;
    if (!/^[A-Za-z0-9._()-]+$/.test(part)) return false;
  }
  if (!/\.usj$/i.test(parts[parts.length - 1])) return false;
  if (!Number.isFinite(size) || size < 1 || size > MAX_ZIP_FILE_BYTES) return false;
  return true;
}

export function parseUnzipList(output) {
  const lines = String(output || "").split(/\r?\n/);
  const entries = [];
  let started = false;
  for (const line of lines) {
    if (/^-{5,}/.test(line.trim())) {
      if (started) break;
      started = true;
      continue;
    }
    if (!started) continue;
    const match = line.match(/^\s*(\d+)\s+\S+\s+\S+\s+(.+?)\s*$/);
    if (!match) continue;
    entries.push({ size: Number(match[1]), name: match[2] });
  }
  return entries;
}

export function assertZipEntries(entries) {
  const list = Array.isArray(entries) ? entries : [];
  if (list.length > MAX_ZIP_FILES) {
    throw new Error(`archive has ${list.length} entries`);
  }
  const files = [];
  let total = 0;
  for (const entry of list) {
    if (String(entry.name || "").endsWith("/")) continue;
    if (!zipEntryAllowed(entry.name, entry.size)) {
      throw new Error(`rejected archive entry ${entry.name}`);
    }
    total += entry.size;
    if (total > MAX_ZIP_TOTAL_BYTES) throw new Error("archive uncompressed size too large");
    files.push(entry);
  }
  if (files.length !== REQUIRED_USJ_FILES) {
    throw new Error(`archive has ${files.length} USJ files, expected ${REQUIRED_USJ_FILES}`);
  }
  return files;
}

export function assertDigest(actual, expected = EXPECTED_SHA256) {
  const got = String(actual || "").toLowerCase();
  const want = String(expected || "").toLowerCase();
  if (!/^[0-9a-f]{64}$/.test(got) || got !== want) {
    throw new Error(`provenance mismatch: got ${got}`);
  }
}

export function hostAllowed(hostname) {
  return ALLOWED_HOSTS.has(String(hostname || "").toLowerCase());
}

async function downloadPinned(url) {
  let current = url;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const parsed = new URL(current);
    if (parsed.protocol !== "https:") throw new Error(`non-https URL ${parsed.protocol}`);
    if (!hostAllowed(parsed.hostname)) throw new Error(`unexpected host ${parsed.hostname}`);
    const response = await fetch(current, {
      headers: { "User-Agent": "omarchy-the-bible/1.0" },
      redirect: "manual"
    });
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");
      if (!location) throw new Error("redirect without location");
      current = new URL(location, current).href;
      continue;
    }
    if (!response.ok || !response.body) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    const hash = createHash("sha256");
    const chunks = [];
    let received = 0;
    const reader = response.body.getReader();
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      received += value.byteLength;
      if (received > MAX_DOWNLOAD_BYTES) throw new Error("download too large");
      hash.update(value);
      chunks.push(value);
    }
    assertDigest(hash.digest("hex"));
    return Buffer.concat(chunks);
  }
  throw new Error("too many redirects");
}

function listZip(zipPath) {
  const output = execFileSync("unzip", ["-l", zipPath], {
    encoding: "utf8",
    maxBuffer: 1024 * 1024,
    timeout: 15000
  });
  return assertZipEntries(parseUnzipList(output));
}

function readZipMember(zipPath, name, size) {
  if (!zipEntryAllowed(name, size)) throw new Error(`rejected archive entry ${name}`);
  const raw = execFileSync("unzip", ["-p", zipPath, name], {
    encoding: "utf8",
    maxBuffer: MAX_ZIP_FILE_BYTES,
    timeout: 15000
  });
  if (raw.length > MAX_ZIP_FILE_BYTES) throw new Error(`extracted ${name} too large`);
  return raw;
}

async function loadModules() {
  const dir = mkdtempSync(join(tmpdir(), "omarchy-fetch-"));
  const usjOut = join(dir, "usj.mjs");
  const bibleOut = join(dir, "bible.mjs");
  buildSync({
    entryPoints: [join(lab, "src/usj.ts")],
    outfile: usjOut,
    bundle: true,
    format: "esm",
    platform: "node"
  });
  buildSync({
    entryPoints: [join(lab, "src/bible.ts")],
    outfile: bibleOut,
    bundle: true,
    format: "esm",
    platform: "node"
  });
  const [usj, bible] = await Promise.all([
    import(pathToFileURL(usjOut).href),
    import(pathToFileURL(bibleOut).href)
  ]);
  return { usj, bible };
}

function bookCodeFromName(name) {
  const stem = String(name || "")
    .replace(/\.usj$/i, "")
    .replace(/^.*[/]/, "");
  const token = stem.match(/([1-3]?[A-Za-z]{2,3})$/)?.[1] || stem;
  return resolveBookAlias(token);
}

function parseUsj(raw, bible) {
  if (!bible.jsonBoundsOk(raw, MAX_ZIP_FILE_BYTES, MAX_USJ_JSON_DEPTH)) {
    throw new Error("USJ JSON exceeds bounds");
  }
  const doc = JSON.parse(raw);
  if (!doc || doc.type !== "USJ") throw new Error("not a USJ document");
  return doc;
}

export async function main() {
  const { usj, bible } = await loadModules();
  const bytes = await downloadPinned(USJ_URL);
  const dir = mkdtempSync(join(tmpdir(), "bsb-usj-"));
  const zipPath = join(dir, "bsb_usj.zip");
  writeFileSync(zipPath, bytes);
  const files = listZip(zipPath);
  const books = [];
  for (const entry of files) {
    const book = bookCodeFromName(entry.name);
    if (!book) throw new Error(`unknown book in ${entry.name}`);
    const doc = parseUsj(readZipMember(zipPath, entry.name, entry.size), bible);
    books.push({ book, doc });
  }
  if (books.length !== REQUIRED_USJ_FILES) {
    throw new Error(`parsed ${books.length} books, expected ${REQUIRED_USJ_FILES}`);
  }

  const index = usj.buildBibleIndex(books);
  bible.assertBibleIndex(index);
  let verses = 0;
  let headings = 0;
  let mismatches = 0;
  for (const [key, rows] of Object.entries(index)) {
    verses += rows.length;
    headings += rows.filter((row) => row.h || row.s).length;
    const [book, chapterToken] = key.split(".");
    const expected = getVerseCount(book, Number(chapterToken));
    if (expected && rows.length !== expected) mismatches += 1;
  }

  const pub = usj.buildPublicationIndex(books);
  bible.assertPubIndex(pub);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(index));
  writeFileSync(pubPath, JSON.stringify(pub));
  console.log(
    `Wrote ${outPath} (${verses} verses, ${Object.keys(index).length} chapters, ${headings} headed verses, ${mismatches} count mismatches) from pinned BSB USJ ${EXPECTED_SHA256.slice(0, 12)}`
  );
  console.log(`Wrote ${pubPath} (${Object.keys(pub).length} chapters)`);
}

function launchedFromCli() {
  const entry = process.argv[1];
  if (!entry) return false;
  return pathToFileURL(resolve(entry)).href === import.meta.url;
}

if (launchedFromCli()) {
  await main();
}
