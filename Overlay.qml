import QtQuick
import Quickshell
import Quickshell.Wayland
import qs.Commons
import qs.Ui

Item {
  id: root

  property string omarchyPath: Quickshell.env("OMARCHY_PATH")
  property var shell: null
  property var manifest: null
  property bool opened: false

  property color background: Color.menu.background
  property color foreground: Color.menu.text
  property color border: Color.menu.border
  property var borderSpec: Border.surfaceSpec("menu", "border", border, Math.max(1, Style.space(2)))
  property color scrim: Color.menu.scrim
  readonly property int cornerRadius: Style.cornerRadius
  property string fontFamily: Style.font.menuFamily
  property int contentMargin: Style.spacing.panelPadding
  property int cardWidth: Math.min(Style.space(720), panel.width - Style.gapsOut * 2)
  property int cardHeight: Math.min(Style.space(640), panel.height - Style.gapsOut * 2)

  function open(payloadJson) {
    root.opened = true
    Qt.callLater(function() {
      keyCatcher.forceActiveFocus()
      reader.focusSearch()
      if (payloadJson) {
        try {
          var payload = JSON.parse(payloadJson)
          if (payload && payload.q) {
            reader.searchText = String(payload.q)
            reader.submitSearch()
          }
        } catch (e) {}
      }
    })
  }

  function close() {
    reader.persist()
    root.opened = false
  }

  function dismiss() {
    root.close()
    if (root.shell && typeof root.shell.hide === "function")
      root.shell.hide((root.manifest && root.manifest.id) || "dpshade.route-bible")
  }

  function toggle() {
    if (root.opened) root.dismiss()
    else root.open("{}")
  }

  function collapseToPopup() {
    reader.persist()
    root.dismiss()
    Qt.callLater(function() {
      if (root.shell && root.shell.bar && typeof root.shell.bar.summonBarWidget === "function")
        root.shell.bar.summonBarWidget("dpshade.route-bible")
    })
  }

  PanelWindow {
    id: panel
    visible: root.opened
    anchors { top: true; bottom: true; left: true; right: true }
    color: "transparent"
    WlrLayershell.namespace: "omarchy-route-bible"
    WlrLayershell.layer: WlrLayer.Overlay
    WlrLayershell.keyboardFocus: WlrKeyboardFocus.Exclusive
    exclusionMode: ExclusionMode.Ignore

    Rectangle {
      anchors.fill: parent
      color: root.scrim
    }

    MouseArea {
      anchors.fill: parent
      onClicked: root.dismiss()
    }

    BorderSurface {
      id: card
      width: root.cardWidth
      height: root.cardHeight
      radius: root.cornerRadius
      anchors.centerIn: parent
      color: root.background
      borderSpec: root.borderSpec
      padding: root.contentMargin

      MouseArea { anchors.fill: parent; onClicked: {} }

      Item {
        id: keyCatcher
        anchors.fill: parent
        focus: true
        Keys.priority: Keys.BeforeItem
        Keys.onPressed: function(event) {
          var shift = event.modifiers & Qt.ShiftModifier
          var ctrl = event.modifiers & Qt.ControlModifier

          if (reader.searchActive) {
            if (event.key === Qt.Key_Escape) {
              if (!reader.handleEscape()) root.dismiss()
              event.accepted = true
            } else if (event.key === Qt.Key_Left) {
              reader.stepChapter(-1)
              event.accepted = true
            } else if (event.key === Qt.Key_Right) {
              reader.stepChapter(1)
              event.accepted = true
            }
            return
          }

          if (event.key === Qt.Key_Escape) {
            if (!reader.handleEscape()) root.dismiss()
            event.accepted = true
            return
          }
          if (ctrl && event.key === Qt.Key_A) {
            reader.selectWholeChapter()
            event.accepted = true
            return
          }
          if (ctrl && event.key === Qt.Key_C) {
            reader.copyText()
            event.accepted = true
            return
          }
          if (ctrl && event.key === Qt.Key_L) {
            reader.copyUrl()
            event.accepted = true
            return
          }
          if (event.key === Qt.Key_Return || event.key === Qt.Key_Enter) {
            if (shift) reader.outlineNow()
            else reader.routeNow()
            event.accepted = true
            return
          }
          if (event.key === Qt.Key_Left || event.text === "h") {
            reader.handleMove(ctrl ? 0 : -1, 0, false)
            if (ctrl) reader.stepBook(-1)
            event.accepted = true
            return
          }
          if (event.key === Qt.Key_Right || event.text === "l") {
            reader.handleMove(ctrl ? 0 : 1, 0, false)
            if (ctrl) reader.stepBook(1)
            event.accepted = true
            return
          }
          if (event.key === Qt.Key_Up || event.text === "k") {
            reader.handleMove(0, -1, shift)
            event.accepted = true
            return
          }
          if (event.key === Qt.Key_Down || event.text === "j") {
            reader.handleMove(0, 1, shift)
            event.accepted = true
            return
          }
          if (event.key === Qt.Key_Space) {
            reader.handleMove(0, shift ? -1 : 1, true)
            event.accepted = true
            return
          }
          if (event.text && event.text.length === 1) {
            reader.handleTextKey(event.text)
            event.accepted = true
          }
        }

        Reader {
          id: reader
          anchors.fill: parent
          anchors.topMargin: card.contentTopInset
          anchors.rightMargin: card.contentRightInset
          anchors.bottomMargin: card.contentBottomInset
          anchors.leftMargin: card.contentLeftInset
          foreground: root.foreground
          muted: Color.muted
          accent: Color.accent
          fontFamily: root.fontFamily
          expanded: true
          onRequestClose: root.dismiss()
          onRequestCollapse: root.collapseToPopup()
          onRequestVerseFocus: keyCatcher.forceActiveFocus()
        }
      }
    }
  }
}
