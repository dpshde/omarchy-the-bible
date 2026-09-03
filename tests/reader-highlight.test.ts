import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  pubBlocks,
  pubChapterPaint,
  pubFlowHighlight,
  pubFlowUsesPerRunFill,
  pubRowPaint,
  readerBlockFill,
  readerBlockFillSelected,
  readerBlockFillShow,
  readerBlockSelected,
  uniqueBlockVerses
} from "../src/bible";
import pub from "../data/pub.json";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("Reader USFM highlight bindings", () => {
  const reader = readFileSync(join(repoRoot, "Reader.qml"), "utf8");
  const bibleJs = readFileSync(join(repoRoot, "js/Bible.js"), "utf8");
  const john1 = pubBlocks(pub as Record<string, import("../src/bible").PubBlock[]>, "JHN", 1);
  const heading = john1.find((row) => row.kind === "heading" && row.text === "The Beginning")!;
  const refs = john1.find((row) => row.kind === "refs" && /Genesis 1:1/.test(row.text))!;
  const opening = john1.find((row) => row.kind === "para" && uniqueBlockVerses(row).includes(1))!;
  const witness = john1.find((row) => row.kind === "heading" && row.text === "The Witness of John")!;
  const nextPara = john1.find((row) => row.kind === "para" && uniqueBlockVerses(row).includes(6))!;

  it("walks publication parts by index so QML array-like lists are readable", () => {
    expect(bibleJs).toContain("function eachPart(parts, visit)");
    expect(bibleJs).toMatch(/for \(let i = 0; i < len; i\+\+\)/);
    expect(bibleJs).not.toMatch(/for \(const part of block\.parts/);
  });

  it("binds block fill to primitive kind/fillVerse/n helpers, not isFlow or fillVerse on headings", () => {
    expect(reader).toContain("Bible.readerBlockFillSelected(");
    expect(reader).toContain("Bible.readerBlockFillHovered(");
    expect(reader).toContain("Bible.readerBlockFillShow(");
    expect(reader).toContain("visible: blockDelegate.showBlockFill");
    expect(reader).toContain("visible: run.showRunFill");
    expect(reader).toContain("Bible.pubFlowUsesPerRunFill(kind)");
    expect(reader).toContain("Bible.verseSelected(");
    expect(reader).toContain("run.n, root.startVerse, root.endVerse, root.searchActive");
    expect(reader).toContain("Bible.verseHovered(");
    expect(reader).toContain("run.n, root.focusVerse, root.startVerse, root.endVerse, root.searchActive");
    expect(reader).toContain("currentIndex: -1");
    expect(reader).toContain("highlightFollowsCurrentItem: false");
    expect(reader).not.toMatch(/if \(isFlow\) return false/);
    expect(reader).not.toContain("if (fillVerse >= 1) return fillVerse >= lo && fillVerse <= hi");
    expect(reader).not.toContain("visible: blockDelegate.isVerse");
    expect(bibleJs).toContain("function readerBlockFill(");
    expect(bibleJs).toContain("function pubChapterPaint(");
  });

  it("paints only the John 1:1 run — not the heading, refs, or verses 2–5", () => {
    expect(heading).toBeTruthy();
    expect(refs).toBeTruthy();
    expect(opening.parts.map((part) => part.n)).toEqual([1, 2, 3, 4, 5]);
    expect(opening.fillVerse || 0).toBe(0);
    expect(heading.fillVerse || 0).toBe(0);
    expect(refs.fillVerse || 0).toBe(0);

    const painted = pubChapterPaint(john1, 1, 1, 1, false);
    const headingPaint = painted[john1.indexOf(heading)];
    const refsPaint = painted[john1.indexOf(refs)];
    const openingPaint = painted[john1.indexOf(opening)];
    const witnessPaint = painted[john1.indexOf(witness)];
    const nextPaint = painted[john1.indexOf(nextPara)];

    expect(headingPaint).toMatchObject({ kind: "heading", blockFill: "none", runs: [] });
    expect(refsPaint).toMatchObject({ kind: "refs", blockFill: "none", runs: [] });
    expect(witnessPaint).toMatchObject({ kind: "heading", blockFill: "none" });
    expect(openingPaint.blockFill).toBe("none");
    expect(openingPaint.runs).toEqual([
      { n: 1, fill: "selection" },
      { n: 2, fill: "none" },
      { n: 3, fill: "none" },
      { n: 4, fill: "none" },
      { n: 5, fill: "none" }
    ]);
    expect(nextPaint.blockFill).toBe("none");
    expect(nextPaint.runs.every((run) => run.fill === "none")).toBe(true);

    const selectedRuns = painted.flatMap((row) => row.runs.filter((run) => run.fill === "selection"));
    expect(selectedRuns).toEqual([{ n: 1, fill: "selection" }]);
    expect(painted.every((row) => row.blockFill === "none")).toBe(true);

    expect(readerBlockFill(heading.kind, heading.fillVerse, 0, 1, 1, 1, false)).toEqual({
      show: false,
      selected: false,
      hovered: false
    });
    expect(readerBlockFillSelected("heading", 1, 0, 1, 1, false)).toBe(false);
    expect(readerBlockFillShow("refs", 1, 0, 1, 1, 1, false)).toBe(false);
    expect(readerBlockSelected(opening, 1, 1)).toBe(false);
    expect(pubFlowUsesPerRunFill(opening.kind)).toBe(true);
  });

  it("moves the per-run highlight one verse at a time through John 1:1–6", () => {
    const steps = [1, 2, 3, 4, 5, 6].map((focus) => {
      const painted = pubChapterPaint(john1, focus, focus, focus, false);
      expect(painted.every((row) => row.kind !== "heading" || row.blockFill === "none")).toBe(true);
      expect(painted.every((row) => row.kind !== "refs" || row.blockFill === "none")).toBe(true);
      expect(painted.every((row) => row.blockFill === "none")).toBe(true);
      return painted.flatMap((row) => row.runs.filter((run) => run.fill === "selection").map((run) => run.n));
    });
    expect(steps).toEqual([[1], [2], [3], [4], [5], [6]]);

    const openingAtFive = pubRowPaint(opening, 5, 5, 5, false);
    expect(openingAtFive.runs.map((run) => run.fill)).toEqual(["none", "none", "none", "none", "selection"]);
    const nextAtSix = pubRowPaint(nextPara, 6, 6, 6, false);
    expect(nextAtSix.runs[0]).toEqual({ n: 6, fill: "selection" });
    expect(pubFlowHighlight(opening.kind, 5, 6, 6, 6, false).usePerRunFill).toBe(false);
  });

  it("keeps shift range selection on the matching runs only", () => {
    const painted = pubChapterPaint(john1, 4, 2, 4, false);
    const openingPaint = painted[john1.indexOf(opening)];
    expect(painted[john1.indexOf(heading)].blockFill).toBe("none");
    expect(painted[john1.indexOf(refs)].blockFill).toBe("none");
    expect(openingPaint.blockFill).toBe("none");
    expect(openingPaint.runs).toEqual([
      { n: 1, fill: "none" },
      { n: 2, fill: "selection" },
      { n: 3, fill: "selection" },
      { n: 4, fill: "selection" },
      { n: 5, fill: "none" }
    ]);
    expect(painted.flatMap((row) => row.runs.filter((run) => run.fill === "selection").map((run) => run.n))).toEqual([
      2, 3, 4
    ]);
  });

  it("does not fall back to block fill when uniqueBlockVerses returns no verses", () => {
    const emptied = { ...opening, parts: [] };
    expect(uniqueBlockVerses(emptied)).toEqual([]);
    expect(pubFlowUsesPerRunFill(emptied.kind)).toBe(true);
    expect(readerBlockSelected(emptied, 1, 1)).toBe(false);
    expect(pubRowPaint(emptied, 1, 1, 1, false)).toMatchObject({
      kind: "para",
      blockFill: "none",
      runs: []
    });
    expect(pubFlowHighlight(emptied.kind, 1, 1, 1, 1, false)).toMatchObject({
      useBlockFill: false,
      usePerRunFill: true,
      runSelected: true
    });
    expect(pubFlowHighlight(emptied.kind, 5, 1, 1, 1, false).usePerRunFill).toBe(false);
  });

  it("still block-fills regular verse-list rows and same-verse USFM blanks", () => {
    expect(readerBlockFill("verse", 0, 1, 1, 1, 1, false)).toEqual({
      show: true,
      selected: true,
      hovered: false
    });
    expect(readerBlockFill("verse", 0, 2, 1, 1, 1, false).show).toBe(false);
    expect(readerBlockFill("blank", 4, 0, 4, 4, 4, false)).toEqual({
      show: true,
      selected: true,
      hovered: false
    });
    expect(readerBlockFill("blank", 4, 0, 1, 1, 1, false).show).toBe(false);
    expect(readerBlockFill("heading", 4, 0, 4, 4, 4, false).show).toBe(false);
    expect(readerBlockFill("refs", 4, 0, 4, 4, 4, false).show).toBe(false);
    expect(readerBlockFill("subhead", 4, 0, 4, 4, 4, false).show).toBe(false);
    expect(readerBlockFill("para", 1, 1, 1, 1, 1, false).show).toBe(false);
  });
});
