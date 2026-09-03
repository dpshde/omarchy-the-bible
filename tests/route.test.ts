import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { isAllowedBrowserUrl, marginUrl, routeUrl } from "../src/route";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

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

describe("isAllowedBrowserUrl", () => {
  it("allows only https route.bible and margin.bible", () => {
    expect(isAllowedBrowserUrl(routeUrl("JHN.3.16-18"))).toBe(true);
    expect(isAllowedBrowserUrl(marginUrl("JHN.3.16-18"))).toBe(true);
    expect(isAllowedBrowserUrl("http://route.bible/jhn.3.16")).toBe(false);
    expect(isAllowedBrowserUrl("https://evil.example/jhn.3.16")).toBe(false);
    expect(isAllowedBrowserUrl("https://route.bible.evil/jhn.3.16")).toBe(false);
    expect(isAllowedBrowserUrl("javascript:alert(1)")).toBe(false);
    expect(isAllowedBrowserUrl("file:///etc/passwd")).toBe(false);
    expect(isAllowedBrowserUrl("https://user:pass@route.bible/jhn.3.16")).toBe(false);
  });
});

describe("Reader exec sinks", () => {
  it("copies with wl-copy argv and gates browser launch", () => {
    const reader = readFileSync(join(repoRoot, "Reader.qml"), "utf8");
    expect(reader).not.toMatch(/\bbash\b[\s"',[\]]*-c\b/);
    expect(reader).toContain('["wl-copy", "--", root.routeLink]');
    expect(reader).toContain("Route.isAllowedBrowserUrl(url)");
    expect(reader).toContain('["omarchy", "launch", "browser", url]');
  });
});
