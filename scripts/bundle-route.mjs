import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { bundlePragmaLibrary } from "./qml-wrap.mjs";

const root = dirname(fileURLToPath(import.meta.url));
const lab = join(root, "..");

await bundlePragmaLibrary({
  entry: join(lab, "src/route.ts"),
  outfile: join(lab, "js/Route.js"),
  globalName: "RouteApi",
  exports: ["routeUrl", "marginUrl", "isAllowedBrowserUrl"]
});
