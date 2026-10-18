#!/usr/bin/env bash
# Headless Qt Quick tests for Reader.qml against stub Quickshell/Omarchy modules.
# Needs Qt 6 qmltestrunner (Debian: qt6-declarative-dev-tools qml6-module-qttest
# qml6-module-qtquick-effects). Screenshots land in .qml-shots/ (gitignored).
set -euo pipefail
cd "$(dirname "$0")/.."
runner="${QMLTESTRUNNER:-$(command -v qmltestrunner || echo /usr/lib/qt6/bin/qmltestrunner)}"
if [ ! -x "$runner" ]; then echo "qmltestrunner not found; skipping QML tests" >&2; exit 0; fi
mkdir -p .qml-shots
QT_QPA_PLATFORM="${QT_QPA_PLATFORM:-offscreen}" QML_XHR_ALLOW_FILE_READ=1 \
  "$runner" -import tests/qml/stubs -input tests/qml "$@"
