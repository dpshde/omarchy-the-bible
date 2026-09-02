import QtQuick
import QtQuick.Effects
import QtQuick.Window
import Quickshell
import qs.Commons
import qs.Ui

BarWidget {
  id: root
  moduleName: "io.github.dpshde.the-bible"

  readonly property bool opened: panelLoader.item ? panelLoader.item.opened === true : false
  readonly property bool popoutSwitchClosing: panelLoader.item
    ? panelLoader.item.popoutSwitchClosing === true
    : false

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
    text: "󰂼"
    labelVisible: false
    tooltipText: ""
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

    Image {
      id: bookGlyph
      anchors.centerIn: parent
      width: Style.space(16)
      height: Style.space(16)
      source: Qt.resolvedUrl("icons/book-open.svg")
      fillMode: Image.PreserveAspectFit
      visible: false
      asynchronous: true
      sourceSize.width: Math.round(width * Screen.devicePixelRatio)
      sourceSize.height: Math.round(height * Screen.devicePixelRatio)
    }

    MultiEffect {
      anchors.fill: bookGlyph
      source: bookGlyph
      colorization: 1
      colorizationColor: button.foreground
      opacity: bookGlyph.status === Image.Ready ? 1 : 0
    }
  }
}
