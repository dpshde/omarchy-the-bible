pragma Singleton
import QtQuick
import "env.js" as Env
// Test stub for the Quickshell singleton: env() from the generated env.js
// (scripts/qml-test.sh) and a recorded execDetached().
QtObject {
  property var detached: []
  property var screens: []
  function env(name) { return Env.vars[name] !== undefined ? Env.vars[name] : "" }
  function execDetached(argv) { detached = detached.concat([argv]) }
}
