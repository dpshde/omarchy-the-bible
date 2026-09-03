import { describe, expect, it } from "vitest";
import {
  advanceFocusVerse,
  formatCompact,
  isKnownBook,
  jsonBoundsOk,
  nextChapter,
  normalizeIndex,
  parseIndex,
  parsePublication,
  parseRefInput,
  parseState,
  parseSummonPayload,
  prevChapter,
  pubBlockUsesPerVerseHighlight,
  pubBlocks,
  pubFlowHighlight,
  pubFlowUsesPerRunFill,
  pubRowIndexForVerse,
  readerBlockSelected,
  readerBlocks,
  selectedText,
  serializeState,
  splitRefs,
  toCanonical,
  uniqueBlockVerses,
  usfmHighlightState,
  verseHovered,
  verseInRange,
  verseSelected
} from "../src/bible";
import { MAX_INDEX_BYTES, MAX_JSON_DEPTH_INDEX, MAX_SEARCH_CHARS, MAX_STATE_BYTES, MAX_SUMMON_BYTES } from "../src/limits";
import pub from "../data/pub.json";

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

  it("rejects invalid per-book chapter and verse combinations", () => {
    const fallback = {
      book: "JHN",
      chapter: 3,
      startVerse: 16,
      endVerse: 16,
      publication: false
    };
    expect(parseState(JSON.stringify({ book: "JHN", chapter: 22, startVerse: 1, endVerse: 1 }))).toEqual(fallback);
    expect(parseState(JSON.stringify({ book: "JHN", chapter: 3, startVerse: 37, endVerse: 37 }))).toEqual(fallback);
    expect(parseState(JSON.stringify({ book: "JHN", chapter: 3, startVerse: 16, endVerse: 40 }))).toEqual(fallback);
    expect(parseState(JSON.stringify({ book: "PSA", chapter: 119, startVerse: 177, endVerse: 177 }))).toEqual(fallback);
    expect(parseState(JSON.stringify({ book: "JHN", chapter: 22, startVerse: 0, endVerse: 0 }))).toEqual(fallback);
    expect(parseState(JSON.stringify({ book: "JHN", chapter: 3, startVerse: 0, endVerse: 0 }))).toEqual({
      book: "JHN",
      chapter: 3,
      startVerse: 0,
      endVerse: 0,
      publication: false
    });
  });

  it("rejects unknown books and out-of-range numbers", () => {
    const fallback = {
      book: "JHN",
      chapter: 3,
      startVerse: 16,
      endVerse: 16,
      publication: false
    };
    expect(parseState(JSON.stringify({ book: "NOPE", chapter: 1, startVerse: 1, endVerse: 1 }))).toEqual(fallback);
    expect(parseState(JSON.stringify({ book: "JHN", chapter: 999, startVerse: 1, endVerse: 1 }))).toEqual(fallback);
    expect(parseState(JSON.stringify({ book: "JHN", chapter: 3, startVerse: 9999, endVerse: 1 }))).toEqual(fallback);
    expect(parseState("x".repeat(MAX_STATE_BYTES + 1))).toEqual(fallback);
    expect(isKnownBook("JHN")).toBe(true);
    expect(isKnownBook("nope")).toBe(false);
  });
});

describe("parseSummonPayload", () => {
  it("accepts a short string q and rejects oversized or non-string values", () => {
    expect(parseSummonPayload('{"q":"jn 3:16"}')).toEqual({ q: "jn 3:16" });
    expect(parseSummonPayload('{"q":1}')).toBeNull();
    expect(parseSummonPayload('["jn 3:16"]')).toBeNull();
    expect(parseSummonPayload('{"q":"' + "x".repeat(MAX_SEARCH_CHARS + 1) + '"}')).toBeNull();
    expect(parseSummonPayload("x".repeat(MAX_SUMMON_BYTES + 1))).toBeNull();
    expect(parseSummonPayload('{"q":{"nested":true}}')).toBeNull();
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

  it("drops unbounded or unknown publication rows", () => {
    expect(pubBlocks({ "PSA.23": [{ kind: "script", spaced: false, indent: 0, text: "<b>x</b>", parts: [] }] }, "PSA", 23)).toEqual([]);
    expect(pubBlocks({ "NOPE.1": [{ kind: "para", spaced: false, indent: 0, text: "x", parts: [{ n: 1, t: "x", wj: false, showNum: true }] }] }, "NOPE", 1)).toEqual([]);
  });
});

describe("parseIndex", () => {
  it("rejects oversized, deep, or unknown-key JSON", () => {
    expect(jsonBoundsOk("[]", 10, 1)).toBe(true);
    expect(jsonBoundsOk("{".repeat(MAX_JSON_DEPTH_INDEX + 1) + "}".repeat(MAX_JSON_DEPTH_INDEX + 1), 100, MAX_JSON_DEPTH_INDEX)).toBe(false);
    expect(parseIndex("x".repeat(MAX_INDEX_BYTES + 1))).toBeNull();
    expect(parseIndex(JSON.stringify({ "NOPE.1": [{ n: 1, t: "x" }] }))).toBeNull();
    expect(parseIndex('{"__proto__":[{"n":1,"t":"x"}]}')).toBeNull();
  });

  it("rejects publication JSON that is not a full bounded index", () => {
    expect(parsePublication(JSON.stringify({ "JHN.1": [{ kind: "para", spaced: false, indent: 0, text: "x", parts: [] }] }))).toBeNull();
  });
});

describe("USFM keyboard verse navigation", () => {
  const john1 = pubBlocks(pub as Record<string, import("../src/bible").PubBlock[]>, "JHN", 1);

  function qmlLikeParts<T extends { n: number }>(parts: T[]): { length: number } & Record<number, T> {
    const out = { length: parts.length } as { length: number } & Record<number, T>;
    for (let i = 0; i < parts.length; i++) out[i] = parts[i];
    return out;
  }

  function withQmlParts(block: import("../src/bible").PubBlock): import("../src/bible").PubBlock {
    return { ...block, parts: qmlLikeParts(block.parts) as unknown as import("../src/bible").PubBlock["parts"] };
  }

  it("reads verse numbers from QML array-like parts", () => {
    const opening = john1.find((row) => row.kind === "para" && uniqueBlockVerses(row).includes(1))!;
    const qmlOpening = withQmlParts(opening);
    expect(uniqueBlockVerses(qmlOpening)).toEqual([1, 2, 3, 4, 5]);
    expect(pubBlockUsesPerVerseHighlight(qmlOpening)).toBe(true);
  });

  it("highlights exactly one John 1 verse on initial keyboard focus", () => {
    const opening = withQmlParts(
      john1.find((row) => row.kind === "para" && uniqueBlockVerses(row).includes(1))!
    );
    const initial = usfmHighlightState(opening, 1, 0, 0, false);
    expect(initial.mode).toBe("per-run");
    expect(initial.selected).toEqual([]);
    expect(initial.hovered).toEqual([1]);

    const focused = usfmHighlightState(opening, 3, 0, 0, false);
    expect(focused.hovered).toEqual([3]);
    expect(focused.selected).toEqual([]);
  });

  it("does not use block-level selection for a single selected verse in a shared paragraph", () => {
    const opening = withQmlParts(
      john1.find((row) => row.kind === "para" && uniqueBlockVerses(row).includes(1))!
    );
    const single = usfmHighlightState(opening, 1, 1, 1, false);
    expect(single.mode).toBe("per-run");
    expect(single.selected).toEqual([1]);
    expect(single.selected.length).toBe(1);
    expect(readerBlockSelected(opening, 1, 1)).toBe(false);
    expect(readerBlockSelected(opening, 2, 4)).toBe(false);
  });

  it("uses per-run fill for the John 1 opening even when uniqueBlockVerses is empty", () => {
    const opening = john1.find((row) => row.kind === "para" && uniqueBlockVerses(row).includes(1))!;
    const emptied = { ...opening, parts: [] };
    expect(uniqueBlockVerses(emptied)).toEqual([]);
    expect(pubFlowUsesPerRunFill(emptied.kind)).toBe(true);
    expect(pubBlockUsesPerVerseHighlight(emptied)).toBe(true);
    expect(readerBlockSelected(emptied, 1, 1)).toBe(false);
    expect(usfmHighlightState(emptied, 1, 1, 1, false).mode).toBe("per-run");

    const verse1 = pubFlowHighlight(emptied.kind, 1, 1, 1, 1, false);
    expect(verse1.useBlockFill).toBe(false);
    expect(verse1.usePerRunFill).toBe(true);
    expect(verse1.runSelected).toBe(true);

    for (const n of [2, 3, 4, 5]) {
      const paint = pubFlowHighlight(emptied.kind, n, 1, 1, 1, false);
      expect(paint.useBlockFill).toBe(false);
      expect(paint.usePerRunFill).toBe(false);
    }

    const focused = pubFlowHighlight(emptied.kind, 3, 3, 0, 0, false);
    expect(focused.useBlockFill).toBe(false);
    expect(focused.usePerRunFill).toBe(true);
    expect(focused.runHovered).toBe(true);
  });

  it("keeps a single-verse publication paragraph on per-run fill", () => {
    const flesh = john1.find((row) => row.kind === "para" && uniqueBlockVerses(row).join() === "14");
    expect(flesh).toBeTruthy();
    expect(pubFlowUsesPerRunFill(flesh!.kind)).toBe(true);
    expect(pubBlockUsesPerVerseHighlight(flesh!)).toBe(true);
    expect(readerBlockSelected(flesh!, 14, 14)).toBe(false);
    const paint = pubFlowHighlight(flesh!.kind, 14, 14, 14, 14, false);
    expect(paint.useBlockFill).toBe(false);
    expect(paint.usePerRunFill).toBe(true);
  });

  it("marks multi-verse John 1 paragraphs for per-verse highlighting", () => {
    const opening = john1.find((row) => row.kind === "para" && uniqueBlockVerses(row).includes(1));
    expect(opening).toBeTruthy();
    expect(uniqueBlockVerses(opening!)).toEqual([1, 2, 3, 4, 5]);
    expect(pubBlockUsesPerVerseHighlight(opening!)).toBe(true);
  });

  it("advances focus one verse at a time through a shared paragraph", () => {
    const bible = normalizeIndex({
      "JHN.1": [
        { n: 1, t: "In the beginning was the Word." },
        { n: 2, t: "He was with God in the beginning." },
        { n: 3, t: "Through Him all things were made." },
        { n: 4, t: "In Him was life." },
        { n: 5, t: "The Light shines in the darkness." }
      ]
    });
    let focus = 1;
    const steps: number[] = [focus];
    for (let i = 0; i < 4; i++) {
      focus = advanceFocusVerse(bible, "JHN", 1, focus, 1);
      steps.push(focus);
    }
    expect(steps).toEqual([1, 2, 3, 4, 5]);
    focus = advanceFocusVerse(bible, "JHN", 1, focus, 1);
    expect(focus).toBe(5);
  });

  it("highlights only the focused verse inside a John 1 paragraph", () => {
    const opening = john1.find((row) => row.kind === "para" && uniqueBlockVerses(row).includes(1))!;
    const verses = uniqueBlockVerses(opening);
    for (const focus of verses) {
      const highlighted = verses.filter((n) => verseHovered(n, focus, 0, 0, false));
      expect(highlighted).toEqual([focus]);
    }
  });

  it("highlights only selected verses inside a John 1 paragraph", () => {
    const opening = john1.find((row) => row.kind === "para" && uniqueBlockVerses(row).includes(1))!;
    const verses = uniqueBlockVerses(opening);
    for (const selected of verses) {
      const highlighted = verses.filter((n) => verseSelected(n, selected, selected, false));
      expect(highlighted).toEqual([selected]);
    }
  });

  it("finds verse rows when publication blocks use QML array-like parts", () => {
    const qmlRows = john1.map((row) => withQmlParts(row));
    const opening = john1.find((row) => row.kind === "para" && uniqueBlockVerses(row).includes(1))!;
    const rowIndex = john1.indexOf(opening);
    expect(pubRowIndexForVerse(qmlRows, 1)).toBe(rowIndex);
    expect(pubRowIndexForVerse(qmlRows, 3)).toBe(rowIndex);
    expect(pubRowIndexForVerse(qmlRows, 5)).toBe(rowIndex);
    expect(pubRowIndexForVerse(qmlRows, 6)).not.toBe(rowIndex);
  });

  it("keeps scroll target stable while focus moves within the same paragraph", () => {
    const opening = john1.find((row) => row.kind === "para" && uniqueBlockVerses(row).includes(1))!;
    const rowIndex = john1.indexOf(opening);
    expect(pubRowIndexForVerse(john1, 1)).toBe(rowIndex);
    expect(pubRowIndexForVerse(john1, 3)).toBe(rowIndex);
    expect(pubRowIndexForVerse(john1, 5)).toBe(rowIndex);
    expect(pubRowIndexForVerse(john1, 6)).not.toBe(rowIndex);
  });

  it("preserves range selection semantics across verses in one paragraph", () => {
    const opening = john1.find((row) => row.kind === "para" && uniqueBlockVerses(row).includes(1))!;
    const verses = uniqueBlockVerses(opening);
    const selected = verses.filter((n) => verseSelected(n, 2, 4, false));
    expect(selected).toEqual([2, 3, 4]);
    expect(verseInRange(2, 2, 4)).toBe(true);
    expect(verseInRange(1, 2, 4)).toBe(false);
    expect(verseHovered(3, 1, 2, 4, false)).toBe(false);
    expect(verseHovered(1, 1, 2, 4, false)).toBe(true);
  });
});
