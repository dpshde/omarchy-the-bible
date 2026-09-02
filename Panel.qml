import QtQuick
import Quickshell
import qs.Commons
import qs.Ui

Panel {
  id: root
  moduleName: "io.github.dpshde.the-bible"
  manageIpc: false

  property var anchorItem: null
  property var hostWidget: null
  readonly property var barIdentity: hostWidget || root
  readonly property color contentForeground: Color.popups.text
  readonly property color mutedForeground: Color.muted
  readonly property color contentAccent: Color.accent
  readonly property color contentUrgent: Color.urgent
  readonly property string contentFontFamily: Style.font.family
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
      Util.execArgv(["omarchy-shell", "shell", "summon", "io.github.dpshde.the-bible", "{}"])
    })
  }

  KeyboardPanel {
    id: panel
    anchorItem: root.anchorItem
    owner: root.barIdentity
    bar: root.bar
    open: root.opened
    focusTarget: keyCatcher
    contentWidth: panel.fittedContentWidth(Style.space(500))
    contentHeight: panel.cappedContentHeight(Style.space(560))

    Item {
      id: keyCatcher
      anchors.fill: parent
      focus: true
      Keys.priority: Keys.BeforeItem
      Keys.onPressed: function(event) {
        var shift = event.modifiers & Qt.ShiftModifier
        reader.shiftHeld = !!shift
        var ctrl = event.modifiers & Qt.ControlModifier
        var alt = event.modifiers & Qt.AltModifier
        var meta = event.modifiers & Qt.MetaModifier

        if (reader.searchActive) {
          if (event.key === Qt.Key_Backtab) {
            root.switchPanel(-1)
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
          reader.handleMove(-1, 0, false)
          event.accepted = true
          return
        }
        if (event.key === Qt.Key_Right || (event.text === "l" && event.key !== Qt.Key_Space)) {
          reader.handleMove(1, 0, false)
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
      Keys.onReleased: function(event) {
        if (event.key === Qt.Key_Shift) reader.shiftHeld = false
        if (event.key === Qt.Key_Space) reader.endSpaceHold()
      }

      Reader {
        id: reader
        anchors.fill: parent
        foreground: root.contentForeground
        muted: root.mutedForeground
        accent: root.contentAccent
        urgent: root.contentUrgent
        surfaceColor: Color.popups.background
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
