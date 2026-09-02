import { cpSync, mkdirSync, rmSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const lab = join(dirname(fileURLToPath(import.meta.url)), "..");
const dest = join(process.env.HOME || "", ".config/omarchy/plugins/io.github.dpshde.the-bible");

const include = [
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
  "preview.png"
];

if (!dest.startsWith(join(process.env.HOME || "", ".config/omarchy/plugins/"))) {
  throw new Error("Refusing to install outside ~/.config/omarchy/plugins/");
}

rmSync(dest, { recursive: true, force: true });
mkdirSync(dest, { recursive: true });

for (const name of include) {
  const from = join(lab, name);
  try {
    statSync(from);
  } catch {
    continue;
  }
  cpSync(from, join(dest, name), { recursive: true, dereference: true });
}

console.log(`Installed plugin files to ${dest}`);
