import { cpSync, lstatSync, mkdirSync, realpathSync, rmSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const PLUGIN_ID = "io.github.dpshde.the-bible";

export const INCLUDE = [
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
];

export function requireAbsoluteHome(home) {
  if (typeof home !== "string" || !home.startsWith("/") || home === "/") {
    throw new Error("HOME must be an absolute directory");
  }
  if (home.includes("\0") || home.split("/").includes("..")) {
    throw new Error("HOME must not contain ..");
  }
  return home.replace(/\/+$/, "");
}

export function pluginDest(home) {
  const root = requireAbsoluteHome(home);
  const parent = join(root, ".config/omarchy/plugins");
  const dest = join(parent, PLUGIN_ID);
  if (!dest.startsWith(`${parent}/`)) {
    throw new Error("Refusing to install outside ~/.config/omarchy/plugins/");
  }
  return dest;
}

export function assertOwnedDirectory(dest, uid = process.getuid?.() ?? -1) {
  let st;
  try {
    st = lstatSync(dest);
  } catch (error) {
    if (error && error.code === "ENOENT") return;
    throw error;
  }
  if (st.isSymbolicLink() || !st.isDirectory()) {
    throw new Error("Refusing to replace a destination that is not a directory we own");
  }
  if (uid >= 0 && st.uid !== uid) {
    throw new Error("Refusing to replace a destination that is not a directory we own");
  }
}

export function assertRealpathInsidePlugins(home, dest) {
  const homeReal = realpathSync(requireAbsoluteHome(home));
  const pluginsLexical = join(homeReal, ".config/omarchy/plugins");
  let cursor = dest;
  for (;;) {
    try {
      const st = lstatSync(cursor);
      const real = realpathSync(cursor);
      if (real !== homeReal && !real.startsWith(`${homeReal}/`)) {
        throw new Error("Refusing to install outside ~/.config/omarchy/plugins/");
      }
      if (cursor === dest && st.isDirectory() && !st.isSymbolicLink()) {
        let pluginsReal = pluginsLexical;
        try {
          pluginsReal = realpathSync(pluginsLexical);
        } catch {
          /* dest exists but the lexical plugins path may still be this dest */
        }
        if (real !== pluginsReal && !real.startsWith(`${pluginsReal}/`)) {
          throw new Error("Refusing to install outside ~/.config/omarchy/plugins/");
        }
        return real;
      }
      return dest;
    } catch (error) {
      if (!error || error.code !== "ENOENT") throw error;
    }
    const parent = dirname(cursor);
    if (parent === cursor) return dest;
    cursor = parent;
  }
}

export function installLocal({ home = process.env.HOME, source = join(dirname(fileURLToPath(import.meta.url)), "..") } = {}) {
  const dest = pluginDest(home);
  assertOwnedDirectory(dest);
  assertRealpathInsidePlugins(home, dest);
  rmSync(dest, { recursive: true, force: true });
  mkdirSync(dest, { recursive: true });
  assertRealpathInsidePlugins(home, dest);
  for (const name of INCLUDE) {
    const from = join(source, name);
    try {
      statSync(from);
    } catch {
      continue;
    }
    cpSync(from, join(dest, name), { recursive: true, dereference: true });
  }
  return dest;
}

function launchedFromCli() {
  const entry = process.argv[1];
  if (!entry) return false;
  return pathToFileURL(resolve(entry)).href === import.meta.url;
}

if (launchedFromCli()) {
  const dest = installLocal();
  console.log(`Installed plugin files to ${dest}`);
}
