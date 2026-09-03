import { mkdirSync, mkdtempSync, symlinkSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  INCLUDE,
  PLUGIN_ID,
  assertOwnedDirectory,
  assertRealpathInsidePlugins,
  installLocal,
  pluginDest,
  requireAbsoluteHome
} from "../scripts/install-local.mjs";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("requireAbsoluteHome", () => {
  it("accepts an absolute home and rejects empty, relative, and dotted paths", () => {
    expect(requireAbsoluteHome("/home/reader")).toBe("/home/reader");
    expect(() => requireAbsoluteHome("")).toThrow(/absolute/);
    expect(() => requireAbsoluteHome("home/reader")).toThrow(/absolute/);
    expect(() => requireAbsoluteHome("/tmp/../etc")).toThrow(/\.\./);
  });
});

describe("pluginDest", () => {
  it("stays under ~/.config/omarchy/plugins/<id>", () => {
    expect(pluginDest("/home/reader")).toBe(
      `/home/reader/.config/omarchy/plugins/${PLUGIN_ID}`
    );
  });
});

describe("assertOwnedDirectory", () => {
  it("allows a missing path and refuses a file or symlink", () => {
    const dir = mkdtempSync(join(tmpdir(), "bible-dest-"));
    const missing = join(dir, "missing");
    expect(() => assertOwnedDirectory(missing)).not.toThrow();

    const file = join(dir, "file");
    writeFileSync(file, "x");
    expect(() => assertOwnedDirectory(file)).toThrow(/not a directory we own/);

    const link = join(dir, "link");
    symlinkSync(dir, link);
    expect(() => assertOwnedDirectory(link)).toThrow(/not a directory we own/);
  });
});

describe("installLocal", () => {
  it("copies only the allowlist into the Omarchy plugin directory", () => {
    const home = mkdtempSync(join(tmpdir(), "bible-home-"));
    const dest = installLocal({ home, source: repoRoot });
    expect(dest).toBe(pluginDest(home));
    expect(existsSync(join(dest, "manifest.json"))).toBe(true);
    expect(existsSync(join(dest, "Reader.qml"))).toBe(true);
    expect(existsSync(join(dest, "data/bsb.json"))).toBe(true);
    expect(existsSync(join(dest, "scripts/fetch-bsb.mjs"))).toBe(false);
    expect(existsSync(join(dest, "package.json"))).toBe(false);
    expect(INCLUDE).toContain("safe-state.py");
  });

  it("refuses a destination whose realpath leaves the plugin tree", () => {
    const home = mkdtempSync(join(tmpdir(), "bible-home-"));
    const outside = mkdtempSync(join(tmpdir(), "bible-outside-"));
    mkdirSync(join(home, ".config"), { recursive: true });
    symlinkSync(outside, join(home, ".config/omarchy"));
    const dest = pluginDest(home);
    expect(() => assertRealpathInsidePlugins(home, dest)).toThrow(/outside/);
    expect(() => installLocal({ home, source: repoRoot })).toThrow(/outside/);
    expect(existsSync(join(outside, "plugins", PLUGIN_ID, "manifest.json"))).toBe(false);
  });
});

describe("docs", () => {
  it("keeps Node rebuild out of the user Install section", () => {
    const readme = readFileSync(join(repoRoot, "README.md"), "utf8");
    const contributing = readFileSync(join(repoRoot, "CONTRIBUTING.md"), "utf8");
    const install = readme.split("## Usage")[0] || "";
    expect(install).toMatch(/omarchy plugin add https:\/\/github.com\/dpshde\/omarchy-the-bible\.git --enable/);
    expect(install).not.toMatch(/pnpm\s+install/);
    expect(install).not.toMatch(/install:local/);
    expect(install).toMatch(/committed `data\/` and `js\/`/);
    expect(contributing).toMatch(/pnpm install --frozen-lockfile --ignore-scripts/);
    expect(contributing).toMatch(/pnpm install:local/);
    expect(contributing).toMatch(/pnpm fetch-bsb/);
  });
});
