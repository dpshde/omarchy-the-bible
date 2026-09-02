import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { parseIndex, parsePublication } from "../src/bible";
import { bookCodes, verseCount } from "../src/qml-api";

const dataPath = join(dirname(fileURLToPath(import.meta.url)), "..", "data", "bsb.json");
const pubPath = join(dirname(fileURLToPath(import.meta.url)), "..", "data", "pub.json");

describe.skipIf(!existsSync(dataPath))("bundled BSB index", () => {
  it("covers the protestant canon", () => {
    const index = parseIndex(readFileSync(dataPath, "utf8"));
    expect(index).not.toBeNull();
    const keys = Object.keys(index || {});
    expect(keys.length).toBeGreaterThan(1000);

    for (const book of bookCodes()) {
      const chapterOne = index?.[`${book}.1`];
      expect(chapterOne?.length).toBeGreaterThan(0);
      expect(chapterOne?.length).toBe(verseCount(book, 1));
    }
  });

  it("keeps BSB section headers from official USJ", () => {
    const index = parseIndex(readFileSync(dataPath, "utf8"));
    const john1 = index?.["JHN.1"] || [];
    expect(john1.find((row) => row.n === 1)?.heading).toBe("The Beginning");
    expect(john1.find((row) => row.n === 6)?.heading).toBe("The Witness of John");
    expect(index?.["GEN.1"]?.find((row) => row.n === 3)?.subhead).toBe("The First Day");
  });
});

describe.skipIf(!existsSync(pubPath))("bundled publication index", () => {
  it("keeps The Beginning as its own block", () => {
    const pub = parsePublication(readFileSync(pubPath, "utf8"));
    expect(pub).not.toBeNull();
    const john1 = pub?.["JHN.1"] || [];
    expect(john1[0]).toMatchObject({ kind: "heading", text: "The Beginning" });
    expect(john1.some((block) => block.kind === "para")).toBe(true);
  });
});
