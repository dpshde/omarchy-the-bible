# route.bible for Omarchy

Parse a passage, select verses, and open [route.bible](https://route.bible) from the Omarchy bar.

Plugin id: `dpshade.route-bible`.

The default surface is a **right-side popup** from the bar chip. Use the **expand** button (or `f`) to open the fullscreen overlay.

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
- Type a reference (`jn 3:16-18`, `Psalm 23`, a bible.com link). Tab or Enter accepts the top suggestion and adds a space; chapter/verse counts show as you type. Down from the input hovers verse 1; Up/Down then move the hover. Up from verse 1 returns to the input. Left/Right change chapter; Ctrl+Left/Right change book.
- **Ctrl+Enter** in the search field opens that passage on route.bible immediately.
- Click-drag verses, or hold Shift while using the arrow keys, to select a range. Space selects through the next verse; Shift+Space selects through the previous verse.
- **Enter** (with the reader focused) opens route.bible for the selection.
- **Outline** (or `m`, Shift+Enter) opens the same passage on [margin.bible](https://margin.bible) so you can outline it.
- **B** opens the book picker, **C** the chapter grid, **/** focuses search, **Y** copies the URL, **Ctrl+C** copies the selected text.
- **Expand** (or `f`) opens the fullscreen overlay. The overlay's restore button (or `f` again) returns to the popup.
- Escape clears search, steps back through pickers, then closes.

Optional Hyprland bind (add this yourself; the plugin does not edit your bindings):

```lua
o.bind("SUPER + SHIFT + B", "route.bible", "omarchy-shell shell summon dpshade.route-bible '{}'")
```

## Remove

```sh
omarchy plugin remove dpshade.route-bible
```

Reading position in `~/.local/state/omarchy/settings/route-bible.json` is left in place.
