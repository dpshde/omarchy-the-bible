pragma Singleton
import QtQuick
QtObject {
  property int cornerRadius: 4
  property int gapsOut: 8
  property QtObject spacing: QtObject { property int panelPadding: 12 }
  property QtObject font: QtObject {
    property string family: "DejaVu Sans Mono"
    property string menuFamily: "DejaVu Sans Mono"
    property int body: 13
    property int bodySmall: 12
    property int caption: 10
    property int subtitle: 13
  }
  function space(n) { return Math.round(Number(n) || 0) }
  function selectionFillFor(fg, accent) { return Qt.rgba(accent.r, accent.g, accent.b, 0.16) }
  function controlFill(selected, hovered, fg, accent) {
    if (selected) return Qt.rgba(accent.r, accent.g, accent.b, 0.16)
    if (hovered) return Qt.rgba(fg.r, fg.g, fg.b, 0.06)
    return Qt.rgba(fg.r, fg.g, fg.b, 0.03)
  }
}
