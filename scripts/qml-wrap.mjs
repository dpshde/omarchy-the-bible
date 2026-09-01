import { build } from "esbuild";
import { writeFileSync } from "node:fs";

export async function bundlePragmaLibrary({ entry, outfile, globalName, exports }) {
  const result = await build({
    absWorkingDir: process.cwd(),
    bundle: true,
    entryPoints: [entry],
    format: "iife",
    globalName,
    legalComments: "none",
    platform: "neutral",
    target: "es2017",
    write: false
  });

  const raw = result.outputFiles[0]?.text;
  if (!raw) {
    throw new Error(`esbuild produced no output for ${entry}`);
  }

  const wrappers = exports
    .map((name) => `function ${name}() { return ${globalName}.${name}.apply(null, arguments); }`)
    .join("\n");

  const polyfill = `function objectFromEntries(entries) {
  var obj = {};
  if (!entries) return obj;
  var list = [];
  if (typeof entries.length === "number") {
    for (var i = 0; i < entries.length; i++) list.push(entries[i]);
  } else if (entries.forEach) {
    entries.forEach(function(item) { list.push(item); });
  }
  for (var j = 0; j < list.length; j++) {
    var pair = list[j];
    if (pair) obj[pair[0]] = pair[1];
  }
  return obj;
}
`;

  const banner = `// Generated from ${entry}. Do not edit by hand.\n.pragma library\n`;
  const body = raw
    .replace(/^["']use strict["'];\n/, "")
    .replace(`var ${globalName} = (() => {`, `var ${globalName} = (function() {`)
    .replace(/Object\.fromEntries\(/g, "objectFromEntries(");
  writeFileSync(outfile, `${banner}${polyfill}${body}\n${wrappers}\n`);
}
