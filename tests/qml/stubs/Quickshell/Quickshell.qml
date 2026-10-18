pragma Singleton
import QtQuick
// Test stub for the Quickshell singleton: env() and a recorded execDetached().
QtObject {
  property var detached: []
  function env(name) { return name === "HOME" ? "" : "" }
  function execDetached(argv) { detached = detached.concat([argv]) }
}
