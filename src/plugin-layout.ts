/** Declared write destinations for The Bible plugin. No installer I/O lives here. */

export const PLUGIN_ID = "io.github.dpshde.the-bible";
export const PLUGIN_PARENT = ".config/omarchy/plugins";
export const STATE_RELATIVE = ".local/state/omarchy/settings/route-bible.json";

export const RUNTIME_NAMES = [
  "manifest.json",
  "BarWidget.qml",
  "Panel.qml",
  "Reader.qml",
  "Overlay.qml",
  "IconButton.qml",
  "icons",
  "js",
  "data",
  "LICENSE",
  "NOTICE.md",
  "README.md",
  "safe-state.py",
  "preview.png",
  "screenshots"
] as const;

const PACKAGE_MANAGER_PATTERN =
  /\b(?:npm|pnpm|yarn|bun)\s+(?:install|add)\b|\bomarchy\s+pkg\s+(?:add|drop|remove|update)\b|\b(?:pacman|paru|yay|apt|apt-get|dnf|zypper|apk)\s+(?:-[A-Za-z]*[SRU]|install|remove|upgrade|add|del)\b|(?:^|[\s/'"])(?:pip|pip3|pipx)["']?\s+install\b|\bpython[23]?(?:\.[0-9]+)?\s+-m\s+pip\s+install\b|\bcargo\s+install\b|\bgo\s+install\b|\bgem\s+install\b|\bbrew\s+(?:install|uninstall|upgrade)\b/i;

const INSTALLER_BASENAME = /(?:^|[-_])(install|installer|setup|uninstall)(?:[-_.]|$)/i;

const LIFECYCLE_SCRIPTS = [
  "preinstall",
  "install",
  "postinstall",
  "preuninstall",
  "uninstall",
  "postuninstall",
  "prepare",
  "prepublish",
  "prepublishOnly",
  "prepack",
  "postpack"
];

export function requireAbsoluteHome(home: unknown): string {
  if (typeof home !== "string" || !home) {
    throw new Error("HOME must be a non-empty absolute path");
  }
  if (home.includes("\0")) throw new Error("HOME must not contain NUL");
  if (!home.startsWith("/") || home === "/") {
    throw new Error("HOME must be an absolute directory");
  }
  const parts = home.split("/");
  if (parts.some((part) => part === "..")) throw new Error("HOME must not contain ..");
  return home.replace(/\/+$/, "") || "/";
}

export function pluginParentDir(home: string): string {
  return `${requireAbsoluteHome(home)}/${PLUGIN_PARENT}`;
}

export function pluginDir(home: string): string {
  return `${pluginParentDir(home)}/${PLUGIN_ID}`;
}

export function stateFile(home: string): string {
  return `${requireAbsoluteHome(home)}/${STATE_RELATIVE}`;
}

export function isPathInside(parent: string, candidate: string): boolean {
  const root = parent.endsWith("/") ? parent : `${parent}/`;
  return candidate === parent || candidate.startsWith(root);
}

export function classifyWrite(home: string, candidate: string): "plugin" | "state" | null {
  if (typeof candidate !== "string" || !candidate.startsWith("/") || candidate.includes("\0")) {
    return null;
  }
  if (candidate.includes("/../") || candidate.endsWith("/..") || candidate.split("/").includes("..")) {
    return null;
  }
  if (candidate === stateFile(home)) return "state";
  if (isPathInside(pluginDir(home), candidate)) return "plugin";
  return null;
}

export function looksLikePackageManager(text: string): boolean {
  return PACKAGE_MANAGER_PATTERN.test(text);
}

export function looksLikeInstallerBasename(name: string): boolean {
  const base = String(name || "").split("/").pop() || "";
  if (/\.(?:md|json)$/i.test(base)) return false;
  return INSTALLER_BASENAME.test(base);
}

export function lifecycleScriptNames(scripts: Record<string, unknown> | undefined): string[] {
  const keys = Object.keys(scripts || {});
  return keys.filter((key) => LIFECYCLE_SCRIPTS.includes(key));
}
