import { describe, expect, it } from "vitest";
import {
  formatCompact,
  nextChapter,
  parseState,
  prevChapter,
  selectedText,
  toCanonical
} from "../src/bible";

const bible = {
  "JHN.3": [
    { n: 16, t: "For God so loved the world." },
    { n: 17, t: "For God did not send His Son." },
    { n: 18, t: "Whoever believes in Him is not condemned." }
  ]
};

const codes = ["LUK", "JHN", "ACT"];
const counts = (book: string) => (book === "JHN" ? 21 : 28);

describe("toCanonical", () => {
  it("emits a verse range", () => {
    expect(
      toCanonical({ book: "JHN", chapter: 3, startVerse: 16, endVerse: 18 }, 36)
    ).toBe("JHN.3.16-18");
  });

  it("emits a chapter when the whole chapter is selected", () => {
    expect(
      toCanonical({ book: "JHN", chapter: 3, startVerse: 1, endVerse: 36 }, 36)
    ).toBe("JHN.3");
  });
});

describe("formatCompact", () => {
  it("uses an en dash for ranges", () => {
    expect(
      formatCompact({ book: "JHN", chapter: 3, startVerse: 16, endVerse: 18 }, 36)
    ).toBe("Jn 3:16–18");
  });
});

describe("navigation", () => {
  it("steps into the next book", () => {
    expect(nextChapter("JHN", 21, codes, counts)).toEqual({ book: "ACT", chapter: 1 });
    expect(prevChapter("JHN", 1, codes, counts)).toEqual({ book: "LUK", chapter: 28 });
  });
});

describe("state", () => {
  it("round-trips selection", () => {
    const parsed = parseState(
      JSON.stringify({ book: "ROM", chapter: 8, startVerse: 28, endVerse: 30 })
    );
    expect(parsed).toEqual({ book: "ROM", chapter: 8, startVerse: 28, endVerse: 30 });
  });
});

describe("selectedText", () => {
  it("joins the selected verses", () => {
    const text = selectedText(bible, {
      book: "JHN",
      chapter: 3,
      startVerse: 16,
      endVerse: 17
    });
    expect(text).toContain("16 For God so loved");
    expect(text).toContain("17 For God did not send");
  });
});
