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

export const INVENTORY_SKIP_DIRS = [".git", "target", "node_modules", ".venv", "vendor"] as const;

export const REVIEWED_EXEC_SINKS = [
  {
    path: "safe-state.py",
    kind: "reviewed-source",
    argv: ["python3", "safe-state.py", "check|read|write", "STATE_PATH", "MAX"],
    evidence: "Mode 0644 shebang helper. Reader.qml invokes it as a python3 argv array with a HOME-bounded state path and a 2048-byte cap."
  },
  {
    path: "Reader.qml",
    kind: "qml-exec-sink",
    argv: ["omarchy", "launch", "browser", "https://route.bible|https://margin.bible/..."],
    evidence: "Util.execArgv array. Hosts are hardcoded in src/route.ts; the slug is encodeURIComponent of a parsed canonical."
  },
  {
    path: "Reader.qml",
    kind: "qml-exec-sink",
    argv: ["wl-copy", "--", "TEXT"],
    evidence: "Quickshell.execDetached argv only. No bash -c, no interpolated shell source."
  },
  {
    path: "Panel.qml",
    kind: "qml-exec-sink",
    argv: ["omarchy-shell", "shell", "summon", "io.github.dpshde.the-bible", "{}"],
    evidence: "Util.execArgv array with a fixed plugin id and empty payload."
  }
] as const;

export function artifactKindFromHeader(header: Uint8Array, mode: number): "elf" | "pe" | "mach-o" | "executable-source" | null {
  if (header.length >= 4 && header[0] === 0x7f && header[1] === 0x45 && header[2] === 0x4c && header[3] === 0x46) {
    return "elf";
  }
  if (header.length >= 2 && header[0] === 0x4d && header[1] === 0x5a) return "pe";
  if (header.length >= 4) {
    const be = (header[0] << 24) | (header[1] << 16) | (header[2] << 8) | header[3];
    const unsigned = be >>> 0;
    if (
      unsigned === 0xfeedface
      || unsigned === 0xfeedfacf
      || unsigned === 0xcafebabe
      || unsigned === 0xcefaedfe
      || unsigned === 0xcffaedfe
    ) {
      return "mach-o";
    }
  }
  if (mode & 0o111) return "executable-source";
  return null;
}

export function looksLikeShellInterpolation(text: string): boolean {
  return /\b(?:bash|sh|zsh|dash)\b[\s"',[\]]*-c\b|\/bin\/sh\b/.test(text);
}
