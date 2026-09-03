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
