import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  pubBlocks,
  pubFlowHighlight,
  pubFlowUsesPerRunFill,
  readerBlockSelected,
  uniqueBlockVerses
} from "../src/bible";
import pub from "../data/pub.json";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

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

  it("shares the flow fill decision with QML and never block-fills flow rows", () => {
    expect(reader).toContain("Bible.pubFlowUsesPerRunFill(kind)");
    expect(reader).toMatch(/if \(isFlow\) return false/);
    expect(reader).not.toMatch(/uniqueVerseCount/);
    expect(reader).not.toContain("isFlow && !blockDelegate.perVerseHighlight");
    expect(reader).not.toContain("isFlow && uniqueVerseCount > 1");
    expect(reader).toContain("blockDelegate.perVerseHighlight && (run.runSelected || run.runHovered)");
    expect(reader).toContain("Bible.verseSelected(run.n, sv, ev, sa)");
    expect(reader).toContain("Bible.verseHovered(run.n, fv, sv, ev, sa)");
    expect(bibleJs).toContain("function pubFlowUsesPerRunFill(kind)");
    expect(bibleJs).toContain("function pubFlowHighlight(");
  });

  it("paints only John 1:1 when verse 1 is selected in the opening paragraph", () => {
    expect(opening).toBeTruthy();
    expect(opening.kind).toBe("para");
    expect(opening.parts.map((part) => part.n)).toEqual([1, 2, 3, 4, 5]);
    expect(opening.fillVerse || 0).toBe(0);
    expect(pubFlowUsesPerRunFill(opening.kind)).toBe(true);
    expect(readerBlockSelected(opening, 1, 1)).toBe(false);

    const painted = opening.parts.map((part) => pubFlowHighlight(opening.kind, part.n, 1, 1, 1, false));
    expect(painted.map((row) => row.useBlockFill)).toEqual([false, false, false, false, false]);
    expect(painted.map((row) => row.usePerRunFill)).toEqual([true, false, false, false, false]);
    expect(painted.map((row) => row.runSelected)).toEqual([true, false, false, false, false]);
  });

  it("moves the per-run highlight one verse at a time through John 1:1–5", () => {
    const steps = [1, 2, 3, 4, 5].map((focus) =>
      opening.parts.map((part) => pubFlowHighlight(opening.kind, part.n, focus, 0, 0, false).usePerRunFill)
    );
    expect(steps).toEqual([
      [true, false, false, false, false],
      [false, true, false, false, false],
      [false, false, true, false, false],
      [false, false, false, true, false],
      [false, false, false, false, true]
    ]);
    const nextPara = john1.find((row) => row.kind === "para" && uniqueBlockVerses(row).includes(6))!;
    const after = pubFlowHighlight(nextPara.kind, 6, 6, 0, 0, false);
    expect(after.useBlockFill).toBe(false);
    expect(after.usePerRunFill).toBe(true);
    expect(pubFlowHighlight(opening.kind, 5, 6, 0, 0, false).usePerRunFill).toBe(false);
  });

  it("keeps shift range selection on the matching runs only", () => {
    const painted = opening.parts.map((part) => pubFlowHighlight(opening.kind, part.n, 4, 2, 4, false));
    expect(painted.map((row) => row.useBlockFill)).toEqual([false, false, false, false, false]);
    expect(painted.map((row) => row.runSelected)).toEqual([false, true, true, true, false]);
    expect(painted[0].runHovered).toBe(false);
  });

  it("does not fall back to block fill when uniqueBlockVerses returns no verses", () => {
    const emptied = { ...opening, parts: [] };
    expect(uniqueBlockVerses(emptied)).toEqual([]);
    expect(pubFlowUsesPerRunFill(emptied.kind)).toBe(true);
    expect(readerBlockSelected(emptied, 1, 1)).toBe(false);
    expect(pubFlowHighlight(emptied.kind, 1, 1, 1, 1, false)).toMatchObject({
      useBlockFill: false,
      usePerRunFill: true,
      runSelected: true
    });
    expect(pubFlowHighlight(emptied.kind, 5, 1, 1, 1, false).usePerRunFill).toBe(false);
  });
});
