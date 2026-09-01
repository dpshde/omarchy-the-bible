import QtQuick
import Quickshell
import qs.Commons
import qs.Ui

BarWidget {
  id: root
  moduleName: "dpshade.route-bible"

  readonly property bool opened: panelLoader.item ? panelLoader.item.opened === true : false
  readonly property bool popoutSwitchClosing: panelLoader.item
    ? panelLoader.item.popoutSwitchClosing === true
    : false
  readonly property string compactLabel: panelLoader.item && panelLoader.item.compactLabel
    ? panelLoader.item.compactLabel
    : "Jn 3:16"
  readonly property string tooltipLabel: panelLoader.item && panelLoader.item.tooltipLabel
    ? panelLoader.item.tooltipLabel + "\nClick to open · scroll chapter · middle-click route.bible"
    : "route.bible"

  function open() {
    if (panelLoader.item) panelLoader.item.open()
  }

  function close() {
    if (panelLoader.item) panelLoader.item.close()
  }

  function toggle() {
    if (panelLoader.item) panelLoader.item.toggle()
  }

  function closeForPopoutSwitch() {
    if (panelLoader.item) panelLoader.item.closeForPopoutSwitch()
  }

  function injectPanel() {
    var target = panelLoader.item
    if (!target) return
    if ("bar" in target) target.bar = root.bar
    if ("settings" in target) target.settings = root.settings
    if ("anchorItem" in target) target.anchorItem = button
    if ("hostWidget" in target) target.hostWidget = root
  }

  implicitWidth: button.implicitWidth
  implicitHeight: button.implicitHeight

  onBarChanged: injectPanel()
  onSettingsChanged: injectPanel()

  Loader {
    id: panelLoader
    active: true
    source: Qt.resolvedUrl("Panel.qml")
    visible: false
    onLoaded: {
      root.injectPanel()
      Qt.callLater(root.injectPanel)
    }
  }

  WidgetButton {
    id: button
    anchors.fill: parent
    bar: root.bar
    text: root.vertical ? "" : ("󰂻  " + root.compactLabel)
    tooltipText: root.tooltipLabel
    onPressed: function(buttonCode) {
      if (buttonCode === Qt.MiddleButton) {
        if (panelLoader.item && panelLoader.item.routeNow) panelLoader.item.routeNow()
      } else if (buttonCode === Qt.LeftButton) {
        root.toggle()
      }
    }
    onWheelMoved: function(delta) {
      if (!panelLoader.item || !panelLoader.item.stepChapter) return
      panelLoader.item.stepChapter(delta > 0 ? -1 : 1)
    }

    Column {
      visible: root.vertical
      anchors.fill: parent

      Repeater {
        model: ["󰂻", root.compactLabel]

        OpticalGlyph {
          required property string modelData
          width: button.width
          height: Style.bar.iconSlot
          text: modelData
          fontFamily: button.fontFamily
          fontSize: modelData.length > 4 ? button.fontSize * 0.85 : button.fontSize
          color: button.foreground
        }
      }
    }
  }
}
