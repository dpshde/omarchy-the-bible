import { describe, expect, it } from "vitest";
import {
  EXPECTED_SHA256,
  assertDigest,
  assertZipEntries,
  hostAllowed,
  parseUnzipList,
  zipEntryAllowed
} from "../scripts/fetch-bsb.mjs";

describe("zipEntryAllowed", () => {
  it("accepts relative USJ members", () => {
    expect(zipEntryAllowed("bsb_usj/GEN.usj", 100)).toBe(true);
    expect(zipEntryAllowed("bsb_usj/1CO.usj", 50)).toBe(true);
  });

  it("rejects zip-slip, absolute, and non-USJ names", () => {
    expect(zipEntryAllowed("../GEN.usj", 100)).toBe(false);
    expect(zipEntryAllowed("bsb_usj/../GEN.usj", 100)).toBe(false);
    expect(zipEntryAllowed("/tmp/GEN.usj", 100)).toBe(false);
    expect(zipEntryAllowed("bsb_usj\\GEN.usj", 100)).toBe(false);
    expect(zipEntryAllowed("bsb_usj/GEN.txt", 100)).toBe(false);
    expect(zipEntryAllowed("bsb_usj/GEN.usj", 0)).toBe(false);
    expect(zipEntryAllowed("bsb_usj/", 0)).toBe(false);
  });
});

describe("parseUnzipList", () => {
  it("reads length and name rows", () => {
    const listing = [
      "Archive:  bsb_usj.zip",
      "  Length      Date    Time    Name",
      "---------  ---------- -----   ----",
      "        0  2026-03-08 14:43   bsb_usj/",
      "      100  2026-03-08 14:43   bsb_usj/GEN.usj",
      "---------                     -------",
      "      100                     2 files"
    ].join("\n");
    expect(parseUnzipList(listing)).toEqual([
      { size: 0, name: "bsb_usj/" },
      { size: 100, name: "bsb_usj/GEN.usj" }
    ]);
  });
});

describe("assertZipEntries", () => {
  it("fails closed on slip names and wrong file counts", () => {
    expect(() => assertZipEntries([{ size: 100, name: "../etc/passwd.usj" }])).toThrow(/rejected archive entry/);
    const files = Array.from({ length: 66 }, (_, i) => ({
      size: 10,
      name: `bsb_usj/B${String(i).padStart(2, "0")}.usj`
    }));
    expect(assertZipEntries([{ size: 0, name: "bsb_usj/" }, ...files])).toHaveLength(66);
    expect(() => assertZipEntries(files.slice(0, 65))).toThrow(/USJ files/);
  });
});

describe("assertDigest", () => {
  it("accepts the pinned digest and rejects anything else", () => {
    expect(() => assertDigest(EXPECTED_SHA256)).not.toThrow();
    expect(() => assertDigest("0".repeat(64))).toThrow(/provenance mismatch/);
    expect(hostAllowed("bereanbible.com")).toBe(true);
    expect(hostAllowed("evil.example")).toBe(false);
  });
});
