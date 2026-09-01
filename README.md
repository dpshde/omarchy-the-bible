# route.bible for Omarchy

Parse a passage, select verses, and open [route.bible](https://route.bible) from the Omarchy bar.

Plugin id: `dpshade.route-bible`.

The default surface is a **right-side popup** from the bar chip. A fullscreen overlay is optional and only opens when you summon it.

## Install

```sh
omarchy plugin add https://github.com/dpshde/omarchy-route-bible.git --enable
omarchy bar move dpshade.route-bible --section right
```

Or from a local checkout:

```sh
pnpm install
pnpm fetch-bsb
pnpm build
pnpm install:local
omarchy plugin validate ~/.config/omarchy/plugins/dpshade.route-bible
omarchy plugin enable dpshade.route-bible --section right
```

`install:local` copies files (no symlinks — Omarchy forbids them in plugin folders).

## Usage

- **Left-click** the bar chip to open or close the popup.
- **Scroll** the chip to move to the previous or next chapter.
- **Middle-click** the chip to open the current selection on route.bible immediately.
- Type a reference (`jn 3:16-18`, `Psalm 23`, a bible.com link) and press Enter to jump there.
- **Ctrl+Enter** in the search field opens that passage on route.bible immediately.
- Click-drag verses, or hold Shift while using the arrow keys, to select a range.
- **Enter** (with the reader focused) opens route.bible for the selection.
- **B** opens the book picker, **C** the chapter grid, **/** focuses search, **Y** copies the URL, **Ctrl+C** copies the selected text.
- Escape clears search, steps back through pickers, then closes.

Optional overlay (larger, centered):

```sh
omarchy-shell shell summon dpshade.route-bible '{}'
```

Optional Hyprland bind (add this yourself; the plugin does not edit your bindings):

```lua
o.bind("SUPER + SHIFT + B", "route.bible", "omarchy-shell shell summon dpshade.route-bible '{}'")
```

## Remove

```sh
omarchy plugin remove dpshade.route-bible
```

Reading position in `~/.local/state/omarchy/settings/route-bible.json` is left in place.
