import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { bundlePragmaLibrary } from "./qml-wrap.mjs";

const root = dirname(fileURLToPath(import.meta.url));
const lab = join(root, "..");

await bundlePragmaLibrary({
  entry: join(lab, "src/qml-api.ts"),
  outfile: join(lab, "js/GrabBcv.js"),
  globalName: "GrabBcvApi",
  exports: [
    "tryParse",
    "suggest",
    "bookCodes",
    "bookName",
    "chapterCount",
    "verseCount",
    "resolveBook"
  ]
});
