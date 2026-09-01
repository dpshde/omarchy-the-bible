import { describe, expect, it } from "vitest";
import { bookCodes, bookName, chapterCount, suggest, tryParse, verseCount } from "../src/qml-api";

describe("tryParse", () => {
  it("parses shorthand ranges", () => {
    const result = tryParse("jn 3:16-18");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.passage.canonical).toBe("JHN.3.16-18");
    expect(result.passage.startBook).toBe("JHN");
    expect(result.passage.startVerse).toBe(16);
    expect(result.passage.endVerse).toBe(18);
  });

  it("parses a chapter", () => {
    const result = tryParse("Psalm 23");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.passage.canonical).toBe("PSA.23");
  });

  it("rejects empty input", () => {
    const result = tryParse("   ");
    expect(result.ok).toBe(false);
  });
});

describe("suggest", () => {
  it("returns john suggestions", () => {
    const rows = suggest("john 3:1", 5);
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.some((row) => row.canonical.startsWith("JHN.3"))).toBe(true);
  });
});

describe("books", () => {
  it("exposes the protestant canon", () => {
    expect(bookCodes()).toHaveLength(66);
    expect(bookName("JHN")).toBe("John");
    expect(chapterCount("JHN")).toBe(21);
    expect(verseCount("JHN", 3)).toBe(36);
  });
});
