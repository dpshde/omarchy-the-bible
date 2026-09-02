import { execFileSync } from "node:child_process";
import { createWriteStream, mkdirSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { buildSync } from "esbuild";
import { getVerseCount, resolveBookAlias } from "grab-bcv";

const USJ_URL = "https://bereanbible.com/bsb_usj.zip";
const lab = join(dirname(fileURLToPath(import.meta.url)), "..");
const outPath = join(lab, "data/bsb.json");
const pubPath = join(lab, "data/pub.json");
const localUsj = join(lab, "../margin-bible/vendor/scripture/bsb/usj");

const { buildBibleIndex, buildPublicationIndex } = await loadUsjModule();

const books = await loadUsjBooks();
if (!books.length) {
  throw new Error("No BSB USJ books found. See https://berean.bible/downloads.htm");
}

const index = buildBibleIndex(books);
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

const pub = buildPublicationIndex(books);
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(index));
writeFileSync(pubPath, JSON.stringify(pub));
console.log(
  `Wrote ${outPath} (${verses} verses, ${Object.keys(index).length} chapters, ${headings} headed verses, ${mismatches} count mismatches) from official BSB USJ`
);
console.log(`Wrote ${pubPath} (${Object.keys(pub).length} chapters)`);

async function loadUsjModule() {
  const outfile = join(mkdtempSync(join(tmpdir(), "omarchy-usj-")), "usj.mjs");
  buildSync({
    entryPoints: [join(lab, "src/usj.ts")],
    outfile,
    bundle: true,
    format: "esm",
    platform: "node"
  });
  return import(pathToFileURL(outfile).href);
}

async function loadUsjBooks() {
  try {
    return await loadFromOfficialZip();
  } catch (error) {
    console.warn(`Official USJ zip failed (${error.message}); trying local vendor copy`);
    return loadFromLocalVendor();
  }
}

async function loadFromOfficialZip() {
  const dir = mkdtempSync(join(tmpdir(), "bsb-usj-"));
  const zipPath = join(dir, "bsb_usj.zip");
  const response = await fetch(USJ_URL, {
    headers: { "User-Agent": "omarchy-the-bible/1.0" },
    redirect: "follow"
  });
  if (!response.ok || !response.body) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  await pipeline(Readable.fromWeb(response.body), createWriteStream(zipPath));
  execFileSync("unzip", ["-qq", "-o", zipPath, "-d", dir]);
  return readUsjTree(dir);
}

function loadFromLocalVendor() {
  try {
    return readUsjTree(localUsj);
  } catch {
    return [];
  }
}

function readUsjTree(root) {
  const books = [];
  const stack = [root];
  while (stack.length) {
    const dir = stack.pop();
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) {
        stack.push(path);
        continue;
      }
      const book = bookCodeFromName(entry.name);
      if (!book) continue;
      const raw = entry.name.endsWith(".gz")
        ? execFileSync("gzip", ["-cd", path], { encoding: "utf8" })
        : readFileSync(path, "utf8");
      const doc = JSON.parse(raw);
      if (!doc || doc.type !== "USJ") continue;
      books.push({ book, doc });
    }
  }
  return books;
}

function bookCodeFromName(name) {
  const stem = String(name || "")
    .replace(/\.usj(\.gz)?$/i, "")
    .replace(/^.*[/]/, "");
  const token = stem.match(/([1-3]?[A-Za-z]{2,3})$/)?.[1] || stem;
  return resolveBookAlias(token);
}
