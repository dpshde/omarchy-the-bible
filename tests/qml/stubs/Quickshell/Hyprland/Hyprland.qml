pragma Singleton
import QtQuick
QtObject { property var focusedMonitor: null; property var monitors: []; function dispatch(cmd) {} signal rawEvent(var event) }
