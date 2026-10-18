import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  dragAutoScrollStep,
  normalizeIndex,
  readerBlockFillSelected,
  readerBlocks,
  selectionScrollRows,
  verseHovered,
  verseSelected
} from "../src/bible";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const reader = readFileSync(join(repoRoot, "Reader.qml"), "utf8");
const bibleJs = readFileSync(join(repoRoot, "js/Bible.js"), "utf8");

describe("selection highlight while searching", () => {
  it("keeps a searched range painted while the search field has focus", () => {
    expect(verseSelected(11, 11, 13, true)).toBe(true);
    expect(verseSelected(13, 11, 13, true)).toBe(true);
    expect(verseSelected(10, 11, 13, true)).toBe(false);
    expect(readerBlockFillSelected("verse", 0, 12, 11, 13, true)).toBe(true);
  });

  it("still hides the hover cursor while searching", () => {
    expect(verseHovered(5, 5, 0, 0, true)).toBe(false);
    expect(verseHovered(5, 5, 0, 0, false)).toBe(true);
  });
});

describe("selectionScrollRows", () => {
  const bible = normalizeIndex({
    "PHP.4": Array.from({ length: 23 }, (_, i) => ({ n: i + 1, t: `v${i + 1}` }))
  });
  const rows = readerBlocks(bible, "PHP", 4);
  const rowOf = (n: number) => rows.findIndex((row) => row.kind === "verse" && "n" in row && row.n === n);

  it("brings the range end then its start into view", () => {
    expect(selectionScrollRows(rows, 11, 13, 13)).toEqual([rowOf(13), rowOf(11)]);
    expect(selectionScrollRows(rows, 13, 11, 13)).toEqual([rowOf(13), rowOf(11)]);
  });

  it("uses one row for a single verse and the focus row with no selection", () => {
    expect(selectionScrollRows(rows, 7, 7, 7)).toEqual([rowOf(7)]);
    expect(selectionScrollRows(rows, 0, 0, 4)).toEqual([rowOf(4)]);
  });
});

describe("dragAutoScrollStep", () => {
  it("scrolls up near the top, down near the bottom, and not in the middle", () => {
    expect(dragAutoScrollStep(2, 400)).toBeLessThan(0);
    expect(dragAutoScrollStep(398, 400)).toBeGreaterThan(0);
    expect(dragAutoScrollStep(200, 400)).toBe(0);
    expect(dragAutoScrollStep(-50, 400)).toBe(-18);
    expect(dragAutoScrollStep(900, 400)).toBe(18);
  });

  it("ignores bad input", () => {
    expect(dragAutoScrollStep(Number.NaN, 400)).toBe(0);
    expect(dragAutoScrollStep(10, 0)).toBe(0);
  });
});

describe("Reader.qml drag-select wiring", () => {
  it("handles drag in viewport coordinates above the list, not inside Flickable content", () => {
    expect(reader).toContain("id: verseDrag");
    expect(reader).toContain("anchors.fill: verseList");
    expect(reader).toContain("root.verseAtPoint(mouse.x, mouse.y)");
    expect(reader).not.toMatch(/enabled: !root\.usePublication/);
  });

  it("writes reading state once on release, not on every pointer move", () => {
    expect(reader).toContain("if (!root.dragging) root.persist()");
    expect(reader).toMatch(/function finishDrag\(\)[\s\S]*root\.persist\(\)/);
  });

  it("scrolls to the whole selection after a search", () => {
    expect(reader).toContain("Qt.callLater(root.scrollToSelection)");
    expect(bibleJs).toContain("function selectionScrollRows(");
    expect(bibleJs).toContain("function dragAutoScrollStep(");
  });
});
