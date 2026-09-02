# The Bible Omarchy Plugin

Standalone Omarchy Quattro plugin (`io.github.dpshde.the-bible`).

- Marketplace and user-visible plugin name is `The Bible`. Do not name this Canon or Selah.
- Opening a selection still uses `route.bible`; outline still launches `margin.bible` on the same OSIS slug. Do not reimplement the outliner here.
- Default UX is the right-side bar popup (`BarWidget.qml` + `Panel.qml`). Overlay opens from the reader's expand button.
- Parse with `grab-bcv` via the generated `js/GrabBcv.js` bundle. Do not reimplement the parser in QML.
- BSB text is fetched from the Arweave JSONL at build time (`pnpm fetch-bsb`).
- Plugin folders cannot contain symlinks. Use `pnpm install:local` to copy into `~/.config/omarchy/plugins/io.github.dpshde.the-bible/`.
- `manifest.json` must stay at the repository root so `omarchy plugin add` can clone this repo as-is.
- Plugin IDs are permanent. Do not change `io.github.dpshde.the-bible` after marketplace listing.
