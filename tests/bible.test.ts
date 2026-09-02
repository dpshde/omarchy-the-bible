import { describe, expect, it } from "vitest";
import {
  formatCompact,
  nextChapter,
  normalizeIndex,
  parseRefInput,
  parseState,
  prevChapter,
  pubBlocks,
  readerBlocks,
  selectedText,
  serializeState,
  splitRefs,
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

  it("emits a chapter when no verses are selected", () => {
    expect(
      toCanonical({ book: "JHN", chapter: 3, startVerse: 0, endVerse: 0 }, 36)
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
    expect(parsed).toEqual({
      book: "ROM",
      chapter: 8,
      startVerse: 28,
      endVerse: 30,
      publication: false
    });
  });

  it("round-trips the publication toggle", () => {
    const parsed = parseState(
      serializeState({ book: "JHN", chapter: 1, startVerse: 1, endVerse: 1 }, { publication: true })
    );
    expect(parsed.publication).toBe(true);
  });

  it("round-trips an empty verse selection", () => {
    const parsed = parseState(
      JSON.stringify({ book: "JHN", chapter: 3, startVerse: 0, endVerse: 0 })
    );
    expect(parsed).toEqual({ book: "JHN", chapter: 3, startVerse: 0, endVerse: 0, publication: false });
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

  it("returns empty text when no verses are selected", () => {
    expect(
      selectedText(bible, { book: "JHN", chapter: 3, startVerse: 0, endVerse: 0 })
    ).toBe("");
  });

  it("includes section headers on the first selected verse", () => {
    const headed = normalizeIndex({
      "JHN.1": [
        { n: 1, t: "In the beginning was the Word.", h: "The Beginning", r: "Genesis 1:1–2" },
        { n: 2, t: "He was with God in the beginning." }
      ]
    });
    const text = selectedText(headed, { book: "JHN", chapter: 1, startVerse: 1, endVerse: 2 });
    expect(text).toContain("The Beginning");
    expect(text).toContain("(Genesis 1:1–2)");
    expect(text).toContain("1 In the beginning was the Word.");
    expect(text).toContain("2 He was with God in the beginning.");
  });
});

describe("readerBlocks", () => {
  it("pulls headers and refs out of the verse row", () => {
    const headed = normalizeIndex({
      "JHN.1": [
        { n: 1, t: "In the beginning was the Word.", h: "The Beginning", r: "Genesis 1:1–2" },
        { n: 2, t: "He was with God in the beginning." }
      ]
    });
    expect(readerBlocks(headed, "JHN", 1)).toEqual([
      { kind: "heading", text: "The Beginning", n: 0, t: "", spaced: false },
      { kind: "refs", text: "Genesis 1:1–2", n: 0, t: "", spaced: false },
      { kind: "verse", text: "", n: 1, t: "In the beginning was the Word.", spaced: false },
      { kind: "verse", text: "", n: 2, t: "He was with God in the beginning.", spaced: false }
    ]);
  });
});

describe("splitRefs", () => {
  it("splits parallel citations", () => {
    expect(splitRefs("Genesis 1:1–2; Hebrews 11:1–3")).toEqual([
      "Genesis 1:1–2",
      "Hebrews 11:1–3"
    ]);
  });

  it("strips wrapping parentheses", () => {
    expect(splitRefs("(Matthew 4:1–11; Mark 1:12,13)")).toEqual([
      "Matthew 4:1–11",
      "Mark 1:12,13"
    ]);
  });

  it("keeps a single citation intact", () => {
    expect(splitRefs("Genesis 5:1–32")).toEqual(["Genesis 5:1–32"]);
    expect(splitRefs("")).toEqual([]);
  });
});

describe("parseRefInput", () => {
  it("normalizes en dashes for the parser", () => {
    expect(parseRefInput("Genesis 5:1–32")).toBe("Genesis 5:1-32");
  });
});

describe("pubBlocks", () => {
  it("joins consecutive poetry lines of the same verse", () => {
    const pub = {
      "PSA.23": [
        { kind: "q1", spaced: false, indent: 1, text: "The LORD is my shepherd;", parts: [{ n: 1, t: "The LORD is my shepherd;", wj: false, showNum: true }] },
        { kind: "q2", spaced: false, indent: 2, text: "I shall not want.", parts: [{ n: 1, t: "I shall not want.", wj: false, showNum: false }] },
        { kind: "q1", spaced: false, indent: 1, text: "He makes me lie down", parts: [{ n: 2, t: "He makes me lie down", wj: false, showNum: true }] }
      ]
    };
    const rows = pubBlocks(pub, "PSA", 23);
    expect(rows[0].joinNext).toBe(true);
    expect(rows[1].join).toBe(true);
    expect(rows[1].joinNext).toBe(false);
    expect(rows[2].join).toBe(false);
  });

  it("fills a USFM blank between lines of the same verse", () => {
    const pub = {
      "PSA.23": [
        { kind: "q1", spaced: false, indent: 1, text: "line a", parts: [{ n: 4, t: "line a", wj: false, showNum: true }] },
        { kind: "blank", spaced: false, indent: 0, text: "", parts: [] },
        { kind: "q2", spaced: false, indent: 2, text: "line b", parts: [{ n: 4, t: "line b", wj: false, showNum: false }] }
      ]
    };
    const rows = pubBlocks(pub, "PSA", 23);
    expect(rows[0].joinNext).toBe(true);
    expect(rows[1].join).toBe(true);
    expect(rows[1].joinNext).toBe(true);
    expect(rows[1].fillVerse).toBe(4);
    expect(rows[2].join).toBe(true);
  });
});
