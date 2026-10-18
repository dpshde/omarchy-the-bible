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

`pnpm test:qml` runs `tests/qml/tst_reader.qml` with Qt 6 `qmltestrunner` on the offscreen platform. It drives real mouse presses and drags over `Reader.qml` and checks the selected range, the search field text, the highlight, and that the selection stays in view. Screenshots land in `.qml-shots/`.

Quickshell is stubbed (`tests/qml/stubs/Quickshell`). The Omarchy shell modules (`qs.Commons`, `qs.Ui`) are the real ones from `OMARCHY_SHELL_DIR` or `/usr/share/omarchy/shell` when present, so on an Omarchy machine (or with a copy of that tree) the reader runs against the real `TextField`, `Button`, `Style`, and `Color`. Set `OMARCHY_THEME_DIR` to a theme folder (`colors.toml`, `shell.toml`) to test a real palette. Without a shell tree it falls back to small stand-ins in `tests/qml/stubs/qs` and says so. None of this is installed by `install:local`.

On Debian/Ubuntu: `qt6-declarative-dev-tools qml6-module-qttest qml6-module-qtquick-effects qml6-module-qtquick-controls qt6-qpa-plugins`. The script skips if `qmltestrunner` is missing.
