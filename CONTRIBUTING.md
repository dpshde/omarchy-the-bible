# Contributing

Listing install is `omarchy plugin add` of this repository. It uses the committed `data/` and `js/` files and does not run Node.

## Developer rebuild

From a checkout, regenerate bundled data and copy the plugin files into the Omarchy plugin directory:

```sh
pnpm install --frozen-lockfile --ignore-scripts
pnpm fetch-bsb
pnpm build
pnpm install:local
omarchy plugin validate ~/.config/omarchy/plugins/io.github.dpshde.the-bible
```

`ignore-scripts` blocks dependency lifecycle scripts. This repo has no `preinstall` / `postinstall` of its own. `.npmrc` sets `ignore-scripts=true` so a plain `pnpm install` does the same.

`install:local` copies the allowlisted plugin files into `~/.config/omarchy/plugins/io.github.dpshde.the-bible` (no symlinks — Omarchy forbids them in plugin folders). It does not fetch, and it does not run a package manager.

## Reader UI tests (headless Qt)

`pnpm test:qml` runs `tests/qml/tst_reader.qml` with Qt 6 `qmltestrunner` on the offscreen platform, against small stand-ins for the Quickshell and Omarchy shell modules in `tests/qml/stubs/` (test-only; not installed by `install:local`). It drives real mouse presses and drags over `Reader.qml` and checks the selected range, the search field text, and the highlight. Screenshots land in `.qml-shots/`. On Debian/Ubuntu: `qt6-declarative-dev-tools qml6-module-qttest qml6-module-qtquick-effects qt6-qpa-plugins`. The script skips if `qmltestrunner` is missing.
