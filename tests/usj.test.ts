import { describe, expect, it } from "vitest";
import { publicationFromUsj, versesFromUsj, type UsjDocument } from "../src/usj";

const john1: UsjDocument = {
  type: "USJ",
  version: "3.1",
  content: [
    { type: "chapter", marker: "c", number: "1" },
    { type: "para", marker: "s1", content: ["The Beginning"] },
    {
      type: "para",
      marker: "r",
      content: ["(", { type: "ref", loc: "GEN 1:1-2", content: ["Genesis 1:1–2"] }, ")"]
    },
    {
      type: "para",
      marker: "p",
      content: [" ", { type: "verse", marker: "v", number: "1" }, "In the beginning was the Word."]
    },
    { type: "para", marker: "s1", content: ["The Witness of John"] },
    {
      type: "para",
      marker: "p",
      content: [" ", { type: "verse", marker: "v", number: "6" }, "There came a man who was sent from God."]
    },
    { type: "chapter", marker: "c", number: "2" },
    { type: "para", marker: "s2", content: ["The Wedding at Cana"] },
    {
      type: "para",
      marker: "p",
      content: [" ", { type: "verse", marker: "v", number: "1" }, "On the third day a wedding took place."]
    },
    { type: "chapter", marker: "c", number: "3" },
    {
      type: "para",
      marker: "p",
      content: [
        " ",
        { type: "verse", marker: "v", number: "1" },
        "Jesus said, ",
        { type: "char", marker: "wj", content: ["Follow me."] }
      ]
    },
    { type: "para", marker: "q1", content: [" ", { type: "verse", marker: "v", number: "2" }, "Make straight the way"] },
    { type: "para", marker: "q2", content: ["for the Lord."] }
  ]
};

describe("versesFromUsj", () => {
  it("attaches s1 headers and parallel refs to the next verse", () => {
    const rows = versesFromUsj(john1, 1);
    expect(rows[0]).toMatchObject({
      n: 1,
      t: "In the beginning was the Word.",
      h: "The Beginning",
      r: "Genesis 1:1–2"
    });
    expect(rows[1]).toMatchObject({
      n: 6,
      t: "There came a man who was sent from God.",
      h: "The Witness of John"
    });
    expect(rows[1].r).toBeUndefined();
  });

  it("attaches s2 subheads", () => {
    const rows = versesFromUsj(john1, 2);
    expect(rows[0]).toMatchObject({
      n: 1,
      t: "On the third day a wedding took place.",
      s: "The Wedding at Cana"
    });
  });
});

describe("publicationFromUsj", () => {
  it("keeps headings and refs off the verse block", () => {
    const blocks = publicationFromUsj(john1, 1);
    expect(blocks[0]).toMatchObject({ kind: "heading", text: "The Beginning", spaced: false });
    expect(blocks[1]).toMatchObject({ kind: "refs", text: "Genesis 1:1–2" });
    expect(blocks[2]).toMatchObject({
      kind: "para",
      parts: [{ n: 1, t: "In the beginning was the Word.", showNum: true, wj: false }]
    });
    expect(blocks.find((block) => block.kind === "heading" && block.text === "The Witness of John")?.spaced).toBe(true);
  });

  it("marks words of Jesus and poetry indents", () => {
    const blocks = publicationFromUsj(john1, 3);
    expect(blocks[0].parts).toEqual([
      { n: 1, t: "Jesus said,", showNum: true, wj: false },
      { n: 1, t: "Follow me.", showNum: false, wj: true }
    ]);
    expect(blocks[1]).toMatchObject({
      kind: "q1",
      indent: 1,
      parts: [{ n: 2, t: "Make straight the way", showNum: true }]
    });
    expect(blocks[2]).toMatchObject({
      kind: "q2",
      indent: 2,
      parts: [{ n: 2, t: "for the Lord.", showNum: false }]
    });
  });
});
