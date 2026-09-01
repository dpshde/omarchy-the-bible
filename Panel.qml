import QtQuick
import Quickshell
import qs.Commons
import qs.Ui

Panel {
  id: root
  moduleName: "dpshade.route-bible"
  manageIpc: false

  property var anchorItem: null
  property var hostWidget: null
  readonly property var barIdentity: hostWidget || root
  readonly property color contentForeground: bar ? bar.foreground : Color.foreground
  readonly property color mutedForeground: Color.muted
  readonly property string contentFontFamily: bar ? bar.fontFamily : Style.font.family
  readonly property string compactLabel: reader.compactLabel
  readonly property string displayLabel: reader.displayLabel
  readonly property string routeLink: reader.routeLink
  readonly property string tooltipLabel: reader.displayLabel + " · BSB"

  function open() {
    root.controller.show()
    Qt.callLater(function() {
      if (root.opened) setCenterHoverRevealSuppressed(true)
      reader.focusSearch()
    })
  }

  function close() {
    setCenterHoverRevealSuppressed(false)
    reader.persist()
    root.controller.hide()
  }

  function toggle() {
    if (root.opened) root.close()
    else root.open()
  }

  function switchPanel(direction) {
    if (root.bar && typeof root.bar.switchPanelFrom === "function")
      return root.bar.switchPanelFrom(root.barIdentity, direction)
    return false
  }

  function setCenterHoverRevealSuppressed(value) {
    if (root.bar && "centerHoverRevealSuppressed" in root.bar)
      root.bar.centerHoverRevealSuppressed = value
  }

  function stepChapter(delta) {
    reader.stepChapter(delta)
  }

  function routeNow() {
    reader.routeNow()
  }

  function expandToOverlay() {
    reader.persist()
    root.close()
    Qt.callLater(function() {
      Util.execArgv(["omarchy-shell", "shell", "summon", "dpshade.route-bible", "{}"])
    })
  }

  KeyboardPanel {
    id: panel
    anchorItem: root.anchorItem
    owner: root.barIdentity
    bar: root.bar
    open: root.opened
    focusTarget: keyCatcher
    contentWidth: panel.fittedContentWidth(Style.space(440))
    contentHeight: panel.cappedContentHeight(Style.space(560))

    Item {
      id: keyCatcher
      anchors.fill: parent
      focus: true
      Keys.priority: Keys.BeforeItem
      Keys.onPressed: function(event) {
        var shift = event.modifiers & Qt.ShiftModifier
        var ctrl = event.modifiers & Qt.ControlModifier

        if (reader.searchActive) {
          if (event.key === Qt.Key_Backtab) {
            root.switchPanel(-1)
            event.accepted = true
          } else if (event.key === Qt.Key_Down) {
            reader.enterVersesFromSearch()
            event.accepted = true
          } else if (event.key === Qt.Key_Up) {
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
          if (!reader.handleEscape()) root.close()
          event.accepted = true
          return
        }
        if (event.key === Qt.Key_Tab || event.key === Qt.Key_Backtab) {
          root.switchPanel((event.modifiers & Qt.ShiftModifier) || event.key === Qt.Key_Backtab ? -1 : 1)
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
          reader.selectVerse(1)
          event.accepted = true
          return
        }
        if (event.key === Qt.Key_End) {
          reader.selectVerse(reader.verseTotal)
          event.accepted = true
          return
        }
        if (event.key === Qt.Key_PageUp) {
          reader.moveFocus(-8, shift)
          event.accepted = true
          return
        }
        if (event.key === Qt.Key_PageDown) {
          reader.moveFocus(8, shift)
          event.accepted = true
          return
        }
        if (event.key === Qt.Key_Return || event.key === Qt.Key_Enter) {
          if (shift) reader.outlineNow()
          else reader.routeNow()
          event.accepted = true
          return
        }
        if (ctrl && (event.key === Qt.Key_Left || event.text === "h")) {
          reader.stepBook(-1)
          event.accepted = true
          return
        }
        if (ctrl && (event.key === Qt.Key_Right || event.text === "l")) {
          reader.stepBook(1)
          event.accepted = true
          return
        }
        if (event.key === Qt.Key_Left || event.text === "h") {
          reader.handleMove(-1, 0, false)
          event.accepted = true
          return
        }
        if (event.key === Qt.Key_Right || event.text === "l") {
          reader.handleMove(1, 0, false)
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
        foreground: root.contentForeground
        muted: root.mutedForeground
        accent: Color.accent
        fontFamily: root.contentFontFamily
        host: root
        expanded: false
        onRequestClose: root.close()
        onRequestExpand: root.expandToOverlay()
        onRequestVerseFocus: keyCatcher.forceActiveFocus()
      }
    }
  }
}
