import { describe, expect, it } from "vitest";
import { marginUrl, routeUrl } from "../src/route";

describe("routeUrl", () => {
  it("lowercases the canonical ref and tags the Omarchy source", () => {
    expect(routeUrl("JHN.3.16-18")).toBe(
      "https://route.bible/jhn.3.16-18?src=route_bible_omarchy&utm_source=route_bible_omarchy&utm_medium=omarchy_plugin"
    );
  });

  it("keeps src on the homepage when the slug is empty", () => {
    expect(routeUrl("")).toBe(
      "https://route.bible/?src=route_bible_omarchy&utm_source=route_bible_omarchy&utm_medium=omarchy_plugin"
    );
  });
});

describe("marginUrl", () => {
  it("opens the margin.bible reader on the same slug", () => {
    expect(marginUrl("JHN.3.16-18")).toBe("https://margin.bible/jhn.3.16-18");
  });
});
