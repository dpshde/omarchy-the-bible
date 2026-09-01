import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { bookCodes, verseCount } from "../src/qml-api";

const dataPath = join(dirname(fileURLToPath(import.meta.url)), "..", "data", "bsb.json");

describe.skipIf(!existsSync(dataPath))("bundled BSB index", () => {
  it("covers the protestant canon", () => {
    const index = JSON.parse(readFileSync(dataPath, "utf8")) as Record<string, Array<{ n: number; t: string }>>;
    const keys = Object.keys(index);
    expect(keys.length).toBeGreaterThan(1000);

    for (const book of bookCodes()) {
      const chapterOne = index[`${book}.1`];
      expect(chapterOne?.length).toBeGreaterThan(0);
      expect(chapterOne?.length).toBe(verseCount(book, 1));
    }
  });
});
