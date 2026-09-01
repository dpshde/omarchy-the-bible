# route.bible Omarchy Plugin

Standalone Omarchy Quattro plugin (`dpshade.route-bible`).

- Product brand in user-visible copy is `route.bible`. Do not name this Canon or Selah.
- Default UX is the right-side bar popup (`BarWidget.qml` + `Panel.qml`). Overlay opens from the reader's expand button.
- Parse with `grab-bcv` via the generated `js/GrabBcv.js` bundle. Do not reimplement the parser in QML.
- BSB text is fetched from the Arweave JSONL at build time (`pnpm fetch-bsb`).
- Plugin folders cannot contain symlinks. Use `pnpm install:local` to copy into `~/.config/omarchy/plugins/dpshade.route-bible/`.
- `manifest.json` must stay at the repository root so `omarchy plugin add` can clone this repo as-is.
