import { describe, expect, it } from "vitest";
import { marginUrl, routeUrl } from "../src/route";

describe("routeUrl", () => {
  it("lowercases the canonical ref", () => {
    expect(routeUrl("JHN.3.16-18")).toBe(
      "https://www.route.bible/jhn.3.16-18?src=omarchy"
    );
  });
});

describe("marginUrl", () => {
  it("opens the margin.bible reader on the same slug", () => {
    expect(marginUrl("JHN.3.16-18")).toBe("https://margin.bible/jhn.3.16-18");
  });
});
