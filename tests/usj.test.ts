import { describe, expect, it } from "vitest";
import { versesFromUsj, type UsjDocument } from "../src/usj";

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
    }
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
