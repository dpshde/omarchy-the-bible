import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { bundlePragmaLibrary } from "./qml-wrap.mjs";

const root = dirname(fileURLToPath(import.meta.url));
const lab = join(root, "..");

await bundlePragmaLibrary({
  entry: join(lab, "src/bible.ts"),
  outfile: join(lab, "js/Bible.js"),
  globalName: "BibleApi",
  exports: [
    "defaultBook",
    "defaultChapter",
    "defaultVerse",
    "chapterKey",
    "versesFor",
    "lastVerseNumber",
    "clampVerse",
    "orderedRange",
    "hasVerseSelection",
    "isWholeChapter",
    "toCanonical",
    "formatCompact",
    "formatDisplay",
    "nextChapter",
    "prevChapter",
    "nextBook",
    "prevBook",
    "testamentOf",
    "booksForTestament",
    "selectedText",
    "serializeState",
    "parseState"
  ]
});
