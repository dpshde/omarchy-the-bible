import { cpSync, existsSync, lstatSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, realpathSync, statSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  PLUGIN_ID,
  RUNTIME_NAMES,
  classifyWrite,
  isPathInside,
  lifecycleScriptNames,
  looksLikeInstallerBasename,
  looksLikePackageManager,
  pluginDir,
  pluginParentDir,
  requireAbsoluteHome,
  stateFile
} from "../src/plugin-layout";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

const runtimeScanGlobs = [
  "BarWidget.qml",
  "Panel.qml",
  "Reader.qml",
  "Overlay.qml",
  "IconButton.qml",
  "safe-state.py",
  "js/Bible.js",
  "js/Route.js",
  "js/GrabBcv.js",
  "manifest.json"
];

function walkFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkFiles(full));
    else out.push(full);
  }
  return out;
}

function assertInsideHome(home: string, candidate: string): void {
  const homeReal = realpathSync(home);
  const real = realpathSync(candidate);
  if (real !== homeReal && !real.startsWith(`${homeReal}/`)) {
    throw new Error(`realpath escaped HOME: ${real}`);
  }
  if (classifyWrite(home, candidate) !== "plugin") {
    throw new Error(`refusing dest outside plugin dir: ${candidate}`);
  }
}

function assertAncestryStaysInHome(home: string, dest: string): void {
  const homeReal = realpathSync(home);
  const chain: string[] = [];
  let current = dest;
  while (current !== "/" && current !== ".") {
    chain.unshift(current);
    if (current === home) break;
    const parent = dirname(current);
    if (parent === current) break;
    current = parent;
  }
  for (const part of chain) {
    if (!existsSync(part)) continue;
    if (!lstatSync(part).isSymbolicLink()) continue;
    const real = realpathSync(part);
    if (real !== homeReal && !real.startsWith(`${homeReal}/`)) {
      throw new Error(`realpath escaped HOME: ${real}`);
    }
  }
}

function stageRuntimeFiles(home: string, sourceRoot: string): string {
  const dest = pluginDir(home);
  if (classifyWrite(home, dest) !== "plugin") {
    throw new Error(`refusing dest outside plugin dir: ${dest}`);
  }
  assertAncestryStaysInHome(home, dest);
  mkdirSync(dest, { recursive: true, mode: 0o700 });
  assertInsideHome(home, dest);
  for (const name of RUNTIME_NAMES) {
    const from = join(sourceRoot, name);
    if (!existsSync(from)) continue;
    if (lstatSync(from).isSymbolicLink()) {
      throw new Error(`refusing source symlink ${name}`);
    }
    const to = join(dest, name);
    if (classifyWrite(home, to) !== "plugin") {
      throw new Error(`refusing write outside plugin dir: ${to}`);
    }
    cpSync(from, to, { recursive: true, dereference: true });
    assertInsideHome(home, to);
  }
  return dest;
}

describe("scanner pattern helpers", () => {
  it("flags package-manager install commands and not omarchy plugin add", () => {
    expect(looksLikePackageManager("pnpm install")).toBe(true);
    expect(looksLikePackageManager("pnpm install:local")).toBe(true);
    expect(looksLikePackageManager("npm add lodash")).toBe(true);
    expect(looksLikePackageManager("omarchy plugin add \"$PWD\" --enable")).toBe(false);
    expect(looksLikePackageManager("pnpm fetch-bsb")).toBe(false);
    expect(looksLikePackageManager("pnpm build")).toBe(false);
  });

  it("flags installer basenames the marketplace baseline treats as setup files", () => {
    expect(looksLikeInstallerBasename("install-local.mjs")).toBe(true);
    expect(looksLikeInstallerBasename("setup.sh")).toBe(true);
    expect(looksLikeInstallerBasename("plugin-layout.ts")).toBe(false);
    expect(looksLikeInstallerBasename("README.md")).toBe(false);
  });
});

describe("requireAbsoluteHome", () => {
  it("accepts a real home and rejects empty, relative, and dotted paths", () => {
    expect(requireAbsoluteHome("/home/reader")).toBe("/home/reader");
    expect(requireAbsoluteHome("/home/reader/")).toBe("/home/reader");
    expect(() => requireAbsoluteHome("")).toThrow(/HOME/);
    expect(() => requireAbsoluteHome("home/reader")).toThrow(/absolute/);
    expect(() => requireAbsoluteHome("/tmp/../etc")).toThrow(/\.\./);
    expect(() => requireAbsoluteHome("/")).toThrow(/absolute/);
  });
});

describe("declared write destinations", () => {
  it("puts the plugin and state files under the Omarchy config and state trees", () => {
    const home = "/home/reader";
    expect(pluginDir(home)).toBe(`/home/reader/.config/omarchy/plugins/${PLUGIN_ID}`);
    expect(pluginParentDir(home)).toBe("/home/reader/.config/omarchy/plugins");
    expect(stateFile(home)).toBe("/home/reader/.local/state/omarchy/settings/route-bible.json");
    expect(isPathInside(pluginParentDir(home), pluginDir(home))).toBe(true);
    expect(classifyWrite(home, pluginDir(home))).toBe("plugin");
    expect(classifyWrite(home, join(pluginDir(home), "manifest.json"))).toBe("plugin");
    expect(classifyWrite(home, stateFile(home))).toBe("state");
  });

  it("rejects writes that leave the plugin or state files", () => {
    const home = "/home/reader";
    expect(classifyWrite(home, "/tmp/evil")).toBeNull();
    expect(classifyWrite(home, "/home/reader/.config/omarchy/hypr/hyprland.conf")).toBeNull();
    expect(classifyWrite(home, "/home/reader/.ssh/authorized_keys")).toBeNull();
    expect(classifyWrite(home, `${pluginDir(home)}/../other-plugin/x`)).toBeNull();
    expect(classifyWrite(home, `${stateFile(home)}.bak`)).toBeNull();
    expect(classifyWrite(home, "relative")).toBeNull();
  });
});

describe("runtime file staging confinement", () => {
  it("copies only allowlisted plugin files into the Omarchy plugin directory", () => {
    const home = mkdtempSync(join(tmpdir(), "bible-home-"));
    const dest = stageRuntimeFiles(home, repoRoot);
    expect(dest).toBe(pluginDir(home));
    expect(existsSync(join(dest, "manifest.json"))).toBe(true);
    expect(existsSync(join(dest, "Reader.qml"))).toBe(true);
    expect(existsSync(join(dest, "safe-state.py"))).toBe(true);
    expect(existsSync(join(dest, "data/bsb.json"))).toBe(true);
    expect(existsSync(join(dest, "scripts/fetch-bsb.mjs"))).toBe(false);
    expect(existsSync(join(dest, "package.json"))).toBe(false);
    expect(existsSync(join(dest, "node_modules"))).toBe(false);

    for (const file of walkFiles(dest)) {
      expect(classifyWrite(home, file)).toBe("plugin");
      expect(statSync(file).isSymbolicLink()).toBe(false);
    }
  });

  it("refuses to stage when the Omarchy config path is a symlink out of HOME", () => {
    const home = mkdtempSync(join(tmpdir(), "bible-home-"));
    const outside = mkdtempSync(join(tmpdir(), "bible-outside-"));
    const config = join(home, ".config");
    mkdirSync(config, { recursive: true });
    symlinkSync(outside, join(config, "omarchy"));
    const dest = pluginDir(home);
    expect(classifyWrite(home, dest)).toBe("plugin");
    expect(resolve(dest).startsWith(resolve(outside) + "/") || resolve(dest) === resolve(outside)).toBe(true);
    expect(() => stageRuntimeFiles(home, repoRoot)).toThrow(/realpath escaped HOME/);
    expect(existsSync(join(outside, "plugins", PLUGIN_ID, "manifest.json"))).toBe(false);
  });
});

describe("user-facing install contract", () => {
  it("has no package lifecycle scripts and no installer-named files", () => {
    const pkg = JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf8")) as {
      scripts?: Record<string, string>;
    };
    expect(lifecycleScriptNames(pkg.scripts)).toEqual([]);
    expect(Object.keys(pkg.scripts || {}).some((name) => /install/i.test(name))).toBe(false);

    const tracked = walkFiles(repoRoot).filter((file) => {
      const rel = relative(repoRoot, file);
      return !rel.startsWith(".git/") && !rel.startsWith("node_modules/") && !rel.startsWith(".cache/");
    });
    const installerFiles = tracked.filter((file) => looksLikeInstallerBasename(file));
    expect(installerFiles.map((file) => relative(repoRoot, file))).toEqual([]);
  });

  it("documents only omarchy plugin add/remove and does not invoke a package manager", () => {
    const readme = readFileSync(join(repoRoot, "README.md"), "utf8");
    expect(looksLikePackageManager(readme)).toBe(false);
    expect(readme).toMatch(/omarchy plugin add https:\/\/github.com\/dpshde\/omarchy-the-bible\.git --enable/);
    expect(readme).toMatch(/omarchy plugin add "\$PWD" --enable/);
    expect(readme).toMatch(/omarchy plugin remove io\.github\.dpshde\.the-bible/);
    expect(readme).not.toMatch(/pnpm\s+install/);
    expect(readme).not.toMatch(/install-local/);
  });

  it("keeps runtime plugin sources free of package-manager and remote-install execution", () => {
    for (const rel of runtimeScanGlobs) {
      const text = readFileSync(join(repoRoot, rel), "utf8");
      expect(looksLikePackageManager(text), rel).toBe(false);
      expect(text, rel).not.toMatch(/\b(?:curl|wget)\b/);
      expect(text, rel).not.toMatch(/\b(?:npm|pnpm|yarn|bun|pip|pip3|cargo|brew)\b/);
      expect(text, rel).not.toMatch(/\bfetch\s*\(/);
    }
    const reader = readFileSync(join(repoRoot, "Reader.qml"), "utf8");
    expect(reader).toContain('home + "/.local/state/omarchy/settings/route-bible.json"');
    expect(reader).toMatch(/python3.*stateHelper/);
  });
});
