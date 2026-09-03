import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("Reader USFM highlight bindings", () => {
  const reader = readFileSync(join(repoRoot, "Reader.qml"), "utf8");
  const bibleJs = readFileSync(join(repoRoot, "js/Bible.js"), "utf8");

  it("walks publication parts by index so QML array-like lists are readable", () => {
    expect(bibleJs).toContain("function eachPart(parts, visit)");
    expect(bibleJs).toMatch(/for \(let i = 0; i < len; i\+\+\)/);
    expect(bibleJs).not.toMatch(/for \(const part of block\.parts/);
  });

  it("does not leave the whole paragraph selected when per-verse highlight is on", () => {
    expect(reader).toContain("if (perVerseHighlight) return false");
    expect(reader).toContain("Bible.uniqueBlockVerses({ kind: kind, parts: parts })");
    expect(reader).toContain("blockDelegate.isFlow && !blockDelegate.perVerseHighlight");
    expect(reader).toContain("Bible.verseSelected(run.n, sv, ev, sa)");
    expect(reader).toContain("Bible.verseHovered(run.n, fv, sv, ev, sa)");
  });
});
