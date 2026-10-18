#!/usr/bin/env bash
# Headless Qt Quick tests for Reader.qml.
#
# Quickshell itself is stubbed (tests/qml/stubs). The Omarchy shell modules
# (qs.Commons, qs.Ui) are the REAL ones when an Omarchy shell tree is found:
# OMARCHY_SHELL_DIR, else /usr/share/omarchy/shell. Otherwise small stand-ins
# in tests/qml/stubs/qs are used and the run says so. OMARCHY_THEME_DIR can
# point at a theme folder (colors.toml, shell.toml) to test a real palette.
#
# Needs Qt 6 qmltestrunner (Debian: qt6-declarative-dev-tools qml6-module-qttest
# qml6-module-qtquick-effects qml6-module-qtquick-controls qt6-qpa-plugins).
# Screenshots land in .qml-shots/ (gitignored).
set -euo pipefail
cd "$(dirname "$0")/.."
runner="${QMLTESTRUNNER:-$(command -v qmltestrunner || echo /usr/lib/qt6/bin/qmltestrunner)}"
if [ ! -x "$runner" ]; then echo "qmltestrunner not found; skipping QML tests" >&2; exit 0; fi

work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT
mkdir -p "$work/import" "$work/home/.local/state/omarchy/current/theme" .qml-shots
cp -r tests/qml/stubs/Quickshell "$work/import/"
shell_dir="${OMARCHY_SHELL_DIR:-/usr/share/omarchy/shell}"
if [ -f "$shell_dir/Commons/qmldir" ] && [ -f "$shell_dir/Ui/qmldir" ]; then
  mkdir -p "$work/import/qs"
  ln -s "$(cd "$shell_dir" && pwd)/Commons" "$work/import/qs/Commons"
  ln -s "$(cd "$shell_dir" && pwd)/Ui" "$work/import/qs/Ui"
  echo "qml-test: real Omarchy shell modules from $shell_dir"
else
  cp -r tests/qml/stubs/qs "$work/import/"
  echo "qml-test: Omarchy shell not found; using stand-in qs modules"
fi
if [ -n "${OMARCHY_THEME_DIR:-}" ]; then
  cp "$OMARCHY_THEME_DIR"/*.toml "$work/home/.local/state/omarchy/current/theme/" 2>/dev/null || true
fi
printf 'var vars = { HOME: %s, XDG_STATE_HOME: %s }\n' \
  "\"$work/home\"" "\"$work/home/.local/state\"" > "$work/import/Quickshell/env.js"

QT_QPA_PLATFORM="${QT_QPA_PLATFORM:-offscreen}" QML_XHR_ALLOW_FILE_READ=1 \
  "$runner" -import "$work/import" -input tests/qml "$@"
