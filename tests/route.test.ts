import { describe, expect, it } from "vitest";
import { routeUrl } from "../src/route";

describe("routeUrl", () => {
  it("lowercases the canonical ref", () => {
    expect(routeUrl("JHN.3.16-18")).toBe(
      "https://www.route.bible/jhn.3.16-18?src=omarchy"
    );
  });
});
