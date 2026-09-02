import { describe, expect, it } from "vitest";
import { bookCodes, bookName, chapterCount, suggest, tryParse, typingHint, verseCount } from "../src/qml-api";

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
  it("keeps suggestions until the exact book name is present", () => {
    const rows = suggest("jn", 5);
    expect(rows.some((row) => row.canonical === "JHN" || /john/i.test(row.label))).toBe(true);
    expect(suggest("john", 5)).toEqual([]);
    expect(suggest("John 3:1", 5)).toEqual([]);
  });

  it("lists matching book names while the typed name is still a prefix or alias", () => {
    const rows = suggest("jo", 8);
    expect(rows.length).toBeGreaterThan(1);
    expect(rows.every((row) => row.kind === "book")).toBe(true);
    expect(rows.some((row) => row.canonical === "JHN" || /john/i.test(row.label))).toBe(true);
  });
});

describe("typingHint", () => {
  it("previews chapter and verse totals", () => {
    expect(typingHint("jn")).toBe("21 chapters in John");
    expect(typingHint("John 3")).toBe("36 verses in John 3");
    expect(typingHint("John 3:16")).toBe("36 verses in John 3");
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
