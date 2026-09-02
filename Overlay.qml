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
  property bool closingFromHost: false
  property string surface: "overlay"
  property bool overlayFullscreen: false

  property color background: Color.menu.background
  property color foreground: Color.menu.text
  property color muted: Color.muted
  property color accent: Color.menu.selectedText
  property color urgent: Color.urgent
  property color selectionFill: Color.menu.selectedBackground
  property color border: Color.menu.border
  property var borderSpec: Border.surfaceSpec("menu", "border", border, Math.max(1, Style.space(2)))
  property color scrim: Color.menu.scrim
  readonly property int cornerRadius: Style.cornerRadius
  property string fontFamily: Style.font.menuFamily
  property int contentMargin: Style.spacing.panelPadding
  property int cardWidth: Math.min(Style.space(720), panel.width - Style.gapsOut * 2)
  property int cardHeight: Math.min(Style.space(640), panel.height - Style.gapsOut * 2)
  readonly property bool windowed: root.surface === "window"
  readonly property bool isFullscreen: root.windowed ? floatWin.fullscreen : root.overlayFullscreen

  function pluginId() {
    return (root.manifest && root.manifest.id) || "io.github.dpshde.the-bible"
  }

  function open(payloadJson) {
    root.closingFromHost = false
    root.opened = true
    if (root.surface !== "window") {
      root.surface = "overlay"
      root.overlayFullscreen = false
      attachReader(overlaySlot)
    }
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
    reader.endSpaceHold()
    floatWin.fullscreen = false
    root.overlayFullscreen = false
    root.surface = "overlay"
    attachReader(overlaySlot)
    root.opened = false
  }

  function dismiss() {
    root.close()
    if (root.shell && typeof root.shell.hide === "function")
      root.shell.hide(root.pluginId())
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
        root.shell.bar.summonBarWidget(root.pluginId())
    })
  }

  function attachReader(slot) {
    if (!slot) return
    readerHost.parent = slot
    readerHost.anchors.fill = slot
  }

  function popOut() {
    reader.persist()
    root.overlayFullscreen = false
    root.surface = "window"
    floatWin.fullscreen = false
    attachReader(windowSlot)
    Qt.callLater(function() {
      keyCatcher.forceActiveFocus()
      reader.requestVerseFocus()
    })
  }

  function dockOverlay() {
    reader.persist()
    floatWin.fullscreen = false
    root.overlayFullscreen = false
    root.surface = "overlay"
    attachReader(overlaySlot)
    Qt.callLater(function() {
      keyCatcher.forceActiveFocus()
      reader.requestVerseFocus()
    })
  }

  function toggleFullscreen() {
    if (root.surface === "window")
      floatWin.fullscreen = !floatWin.fullscreen
    else
      root.overlayFullscreen = !root.overlayFullscreen
  }

  function handleOverlayKey(event) {
    var shift = event.modifiers & Qt.ShiftModifier
    reader.shiftHeld = !!shift
    var ctrl = event.modifiers & Qt.ControlModifier
    var alt = event.modifiers & Qt.AltModifier
    var meta = event.modifiers & Qt.MetaModifier

    if (event.key === Qt.Key_F11) {
      root.toggleFullscreen()
      event.accepted = true
      return
    }

    if (reader.searchActive) {
      if (event.key === Qt.Key_Escape) {
        if (!reader.handleEscape()) {
          if (root.isFullscreen) root.toggleFullscreen()
          else if (root.windowed) root.dockOverlay()
          else root.collapseToPopup()
        }
        event.accepted = true
      } else if (event.key === Qt.Key_Down) {
        reader.handleSearchArrow(1)
        event.accepted = true
      } else if (event.key === Qt.Key_Up) {
        reader.handleSearchArrow(-1)
        event.accepted = true
      }
      return
    }

    if (event.key === Qt.Key_Escape) {
      if (!reader.handleEscape()) {
        if (root.isFullscreen) root.toggleFullscreen()
        else if (root.windowed) root.dockOverlay()
        else root.collapseToPopup()
      }
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
    if (event.key === Qt.Key_Home) {
      reader.handleHome()
      event.accepted = true
      return
    }
    if (event.key === Qt.Key_End) {
      reader.handleEnd()
      event.accepted = true
      return
    }
    if (event.key === Qt.Key_PageUp) {
      reader.handlePage(-8, shift)
      event.accepted = true
      return
    }
    if (event.key === Qt.Key_PageDown) {
      reader.handlePage(8, shift)
      event.accepted = true
      return
    }
    if (event.key === Qt.Key_Return || event.key === Qt.Key_Enter) {
      if (reader.mode === "books" || reader.mode === "chapters") reader.activateHovered()
      else if (shift) reader.outlineNow()
      else reader.routeNow()
      event.accepted = true
      return
    }
    if (event.key === Qt.Key_Space) {
      if (reader.mode === "books" || reader.mode === "chapters") {
        if (!event.isAutoRepeat) reader.activateHovered()
        event.accepted = true
        return
      }
      if (!event.isAutoRepeat) reader.beginSpaceHold()
      event.accepted = true
      return
    }
    if (event.key === Qt.Key_Left || (event.text === "h" && event.key !== Qt.Key_Space)) {
      reader.handleMove(ctrl ? 0 : -1, 0, false)
      if (ctrl) reader.stepBook(-1)
      event.accepted = true
      return
    }
    if (event.key === Qt.Key_Right || (event.text === "l" && event.key !== Qt.Key_Space)) {
      reader.handleMove(ctrl ? 0 : 1, 0, false)
      if (ctrl) reader.stepBook(1)
      event.accepted = true
      return
    }
    if (event.key === Qt.Key_Up || (event.text === "k" && event.key !== Qt.Key_Space)) {
      reader.handleMove(0, -1, false)
      event.accepted = true
      return
    }
    if (event.key === Qt.Key_Down || (event.text === "j" && event.key !== Qt.Key_Space)) {
      reader.handleMove(0, 1, false)
      event.accepted = true
      return
    }
    if (!ctrl && !alt && !meta && event.text && event.text.length === 1) {
      reader.handleTextKey(event.text)
      event.accepted = true
    }
  }

  PanelWindow {
    id: panel
    visible: root.opened && root.surface === "overlay"
    anchors { top: true; bottom: true; left: true; right: true }
    color: "transparent"
    WlrLayershell.namespace: "omarchy-the-bible"
    WlrLayershell.layer: WlrLayer.Overlay
    WlrLayershell.keyboardFocus: root.opened && root.surface === "overlay" ? WlrKeyboardFocus.Exclusive : WlrKeyboardFocus.None
    exclusionMode: ExclusionMode.Ignore

    Rectangle {
      anchors.fill: parent
      color: root.overlayFullscreen ? root.background : root.scrim
    }

    MouseArea {
      anchors.fill: parent
      enabled: !root.overlayFullscreen
      onClicked: root.dismiss()
    }

    BorderSurface {
      id: card
      width: root.overlayFullscreen ? parent.width : root.cardWidth
      height: root.overlayFullscreen ? parent.height : root.cardHeight
      radius: root.overlayFullscreen ? 0 : root.cornerRadius
      anchors.centerIn: parent
      color: root.background
      borderSpec: root.borderSpec
      padding: root.overlayFullscreen ? Style.space(12) : root.contentMargin

      MouseArea { anchors.fill: parent; onClicked: {} }

      Item {
        id: overlaySlot
        anchors.fill: parent
      }
    }
  }

  FloatingWindow {
    id: floatWin
    title: reader.displayLabel ? ("The Bible · " + reader.displayLabel) : "The Bible"
    color: root.background
    visible: root.opened && root.surface === "window"
    implicitWidth: 720
    implicitHeight: 640
    minimumSize: Qt.size(420, 360)

    onVisibleChanged: {
      if (!visible && root.surface === "window" && !root.closingFromHost && root.opened)
        root.dismiss()
    }

    Item {
      id: windowSlot
      anchors.fill: parent
    }
  }

  Item {
    id: readerHost
    parent: overlaySlot
    anchors.fill: parent

    Item {
      id: keyCatcher
      anchors.fill: parent
      focus: true
      Keys.priority: Keys.BeforeItem
      Keys.onPressed: function(event) { root.handleOverlayKey(event) }
      Keys.onReleased: function(event) {
        if (event.key === Qt.Key_Shift) reader.shiftHeld = false
        if (event.key === Qt.Key_Space) reader.endSpaceHold()
      }

      Reader {
        id: reader
        anchors.fill: parent
        anchors.topMargin: root.windowed ? Style.space(12) : card.contentTopInset
        anchors.rightMargin: root.windowed ? Style.space(12) : card.contentRightInset
        anchors.bottomMargin: root.windowed ? Style.space(12) : card.contentBottomInset
        anchors.leftMargin: root.windowed ? Style.space(12) : card.contentLeftInset
        foreground: root.foreground
        muted: root.muted
        accent: root.accent
        urgent: root.urgent
        selectionFill: root.selectionFill
        surfaceColor: root.background
        fontFamily: root.fontFamily
        expanded: true
        windowed: root.windowed
        fullscreen: root.isFullscreen
        onRequestClose: root.dismiss()
        onRequestCollapse: {
          if (root.windowed) root.dockOverlay()
          else root.collapseToPopup()
        }
        onRequestPopout: root.popOut()
        onRequestFullscreen: root.toggleFullscreen()
        onRequestVerseFocus: keyCatcher.forceActiveFocus()
      }
    }
  }
}
