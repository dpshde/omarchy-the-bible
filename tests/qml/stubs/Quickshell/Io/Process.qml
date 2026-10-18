import QtQuick
// Test stub: never runs anything; reports failure so callers fall back to defaults.
QtObject {
  id: proc
  property var command: []
  property var environment: ({})
  property bool running: false
  property bool stdinEnabled: false
  property var stdout: null
  signal exited(int exitCode)
  onRunningChanged: if (running) Qt.callLater(function() { proc.running = false; proc.exited(1) })
}
