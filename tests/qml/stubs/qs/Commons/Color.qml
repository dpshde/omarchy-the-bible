pragma Singleton
import QtQuick
// Test stub approximating a light Omarchy theme.
QtObject {
  property color foreground: "#1f2328"
  property color muted: "#6e7781"
  property color accent: "#2f5fd0"
  property color urgent: "#c62828"
  property color background: "#ffffff"
  property QtObject popups: QtObject { property color text: "#1f2328"; property color background: "#ffffff" }
  property QtObject menu: QtObject {
    property color background: "#ffffff"; property color border: "#d0d7de"; property color scrim: "#80000000"
    property color selectedBackground: "#dbe5fb"; property color selectedText: "#1f2328"; property color text: "#1f2328"
  }
}
