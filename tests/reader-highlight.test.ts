import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { pubBlocks, uniqueBlockVerses } from "../src/bible";
import pub from "../data/pub.json";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

type PartLike = { n?: unknown };

function qmlUniqueVerseCount(parts: PartLike[]): number {
  const seen: Record<string, boolean> = {};
  let c = 0;
  for (let i = 0; i < parts.length; i++) {
    const n = Math.floor(Number(parts[i].n) || 0);
    if (n >= 1 && !seen[n]) {
      seen[n] = true;
      c++;
    }
  }
  return c;
}

function oldBlockAnyPartSelected(
  parts: PartLike[],
  uniqueFromJs: number[],
  startVerse: number,
  endVerse: number
): boolean {
  const perVerseHighlight = uniqueFromJs.length > 1;
  if (perVerseHighlight) return false;
  if (!(startVerse >= 1 && endVerse >= 1)) return false;
  const lo = Math.min(startVerse, endVerse);
  const hi = Math.max(startVerse, endVerse);
  for (let i = 0; i < parts.length; i++) {
    const n = Number(parts[i].n);
    if (n >= lo && n <= hi) return true;
  }
  return false;
}

describe("Reader USFM highlight bindings", () => {
  const reader = readFileSync(join(repoRoot, "Reader.qml"), "utf8");
  const bibleJs = readFileSync(join(repoRoot, "js/Bible.js"), "utf8");
  const john1 = pubBlocks(pub as Record<string, import("../src/bible").PubBlock[]>, "JHN", 1);
  const opening = john1.find((row) => row.kind === "para" && uniqueBlockVerses(row).includes(1))!;

  it("walks publication parts by index so QML array-like lists are readable", () => {
    expect(bibleJs).toContain("function eachPart(parts, visit)");
    expect(bibleJs).toMatch(/for \(let i = 0; i < len; i\+\+\)/);
    expect(bibleJs).not.toMatch(/for \(const part of block\.parts/);
  });

  it("does not leave the whole paragraph selected when per-verse highlight is on", () => {
    expect(reader).toContain("if (perVerseHighlight) return false");
    expect(reader).toContain("blockDelegate.isFlow && !blockDelegate.perVerseHighlight");
    expect(reader).toContain("Bible.verseSelected(run.n, sv, ev, sa)");
    expect(reader).toContain("Bible.verseHovered(run.n, fv, sv, ev, sa)");
  });

  it("computes uniqueVerseCount in QML and does not gate painting on uniqueBlockVerses", () => {
    expect(reader).toMatch(/readonly property int uniqueVerseCount:/);
    expect(reader).toContain("for (var i = 0; i < parts.length; i++)");
    expect(reader).toMatch(/readonly property bool perVerseHighlight: isFlow && uniqueVerseCount > 1/);
    expect(reader).not.toMatch(/Bible\.uniqueBlockVerses/);
    expect(reader).not.toMatch(/blockVerseNums/);
    expect(bibleJs).toContain("function uniqueBlockVerses(block)");
  });

  it("documents that empty uniqueBlockVerses plus the old any-part loop selected the whole John 1 opening para", () => {
    expect(opening).toBeTruthy();
    expect(uniqueBlockVerses(opening)).toEqual([1, 2, 3, 4, 5]);
    expect(opening.parts.length).toBeGreaterThan(1);

    const jsReturnedEmpty: number[] = [];
    expect(jsReturnedEmpty.length > 1).toBe(false);
    expect(oldBlockAnyPartSelected(opening.parts, jsReturnedEmpty, 1, 1)).toBe(true);

    const uniqueVerseCount = qmlUniqueVerseCount(opening.parts);
    expect(uniqueVerseCount).toBe(5);
    const isFlow = opening.kind === "para";
    const perVerseHighlight = isFlow && uniqueVerseCount > 1;
    expect(isFlow).toBe(true);
    expect(perVerseHighlight).toBe(true);
    expect(perVerseHighlight ? false : oldBlockAnyPartSelected(opening.parts, [1], 1, 1)).toBe(false);

    expect(reader).not.toMatch(/Bible\.uniqueBlockVerses/);
    expect(reader).toMatch(/readonly property bool perVerseHighlight: isFlow && uniqueVerseCount > 1/);
  });

  it("counts unique verses from indexed parts the way Reader.qml does", () => {
    expect(qmlUniqueVerseCount(opening.parts)).toBe(5);
    expect(qmlUniqueVerseCount([{ n: 1 }, { n: 1 }, { n: 2 }])).toBe(2);
    expect(qmlUniqueVerseCount([{ n: 3 }])).toBe(1);
    expect(qmlUniqueVerseCount([])).toBe(0);
  });
});
