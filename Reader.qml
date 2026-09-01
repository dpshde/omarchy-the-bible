import QtQuick
import QtQuick.Window
import Quickshell
import Quickshell.Io
import qs.Commons
import qs.Ui
import "js/GrabBcv.js" as GrabBcv
import "js/Bible.js" as Bible
import "js/Route.js" as Route

Item {
  id: root

  property var bible: null
  property color foreground: Color.foreground
  property color muted: Color.muted
  property color accent: Color.accent
  property string fontFamily: Style.font.family
  property var host: null
  property bool expanded: false

  property string book: Bible.defaultBook()
  property int chapter: Bible.defaultChapter()
  property int startVerse: Bible.defaultVerse()
  property int endVerse: Bible.defaultVerse()
  property int focusVerse: Bible.defaultVerse()
  property int anchorVerse: Bible.defaultVerse()
  property string mode: "read"
  property string testament: "nt"
  property string searchText: ""
  property string searchError: ""
  property var suggestions: []
  property int suggestionIndex: -1
  property bool searchParsed: false
  property string searchHint: ""
  property bool stateReady: false
  property bool dragging: false
  property bool extending: false

  readonly property var bookCodeList: GrabBcv.bookCodes()
  readonly property int verseTotal: Bible.lastVerseNumber(root.bible, root.book, root.chapter)
  readonly property var verses: Bible.versesFor(root.bible, root.book, root.chapter)
  readonly property var selection: ({
    book: root.book,
    chapter: root.chapter,
    startVerse: root.startVerse,
    endVerse: root.endVerse
  })
  readonly property string canonical: Bible.toCanonical(root.selection, root.verseTotal)
  readonly property string compactLabel: Bible.formatCompact(root.selection, root.verseTotal)
  readonly property string displayLabel: Bible.formatDisplay(root.selection, GrabBcv.bookName(root.book), root.verseTotal)
  readonly property string routeLink: Route.routeUrl(root.canonical)
  readonly property string marginLink: Route.marginUrl(root.canonical)
  readonly property bool searchActive: searchField.activeFocus
  readonly property bool keysLive: root.Window.window ? root.Window.window.visible : false
  readonly property var visibleBooks: {
    var codes = Bible.booksForTestament(root.testament, root.bookCodeList)
    var filter = String(root.searchText || "").trim().split(/\s+/)[0] || ""
    filter = filter.replace(/[^a-z0-9]+/gi, "").toLowerCase()
    if (!filter) return codes
    var out = []
    for (var i = 0; i < codes.length; i++) {
      var code = codes[i]
      var name = String(GrabBcv.bookName(code) || "").replace(/[^a-z0-9]+/gi, "").toLowerCase()
      if (code.toLowerCase().indexOf(filter) === 0 || name.indexOf(filter) === 0)
        out.push(code)
    }
    return out
  }

  signal requestClose()
  signal requestExpand()
  signal requestCollapse()
  signal requestVerseFocus()

  function fileUrlToPath(url) {
    var s = String(url || "")
    if (s.indexOf("file://") === 0) return decodeURIComponent(s.slice(7))
    return s
  }

  function persist() {
    if (!root.stateReady) return
    stateFile.setText(Bible.serializeState(root.selection))
  }

  function applyPlace(book, chapter, startVerse, endVerse, persistNow) {
    if (!book || GrabBcv.chapterCount(book) < 1) return false
    var nextChapter = Math.max(1, Math.min(GrabBcv.chapterCount(book), Math.floor(chapter || 1)))
    var start = Bible.clampVerse(root.bible, book, nextChapter, startVerse || 1)
    var end = Bible.clampVerse(root.bible, book, nextChapter, endVerse || start)
    var range = Bible.orderedRange(start, end)
    root.book = book
    root.chapter = nextChapter
    root.startVerse = range.start
    root.endVerse = range.end
    root.focusVerse = range.end
    root.anchorVerse = range.start
    root.mode = "read"
    root.searchError = ""
    if (persistNow !== false) root.persist()
    Qt.callLater(root.scrollToFocus)
    return true
  }

  function applyParsed(passage, persistNow) {
    if (!passage) return false
    var startVerse = passage.startVerse || 1
    var endVerse = passage.endVerse || startVerse
    if (passage.startBook !== passage.endBook || passage.startChapter !== passage.endChapter) {
      startVerse = passage.startVerse || 1
      endVerse = startVerse
    }
    if (!passage.startVerse && !passage.endVerse) {
      var total = Bible.lastVerseNumber(root.bible, passage.startBook, passage.startChapter)
      startVerse = 1
      endVerse = total
    }
    return root.applyPlace(passage.startBook, passage.startChapter, startVerse, endVerse, persistNow)
  }

  function selectVerse(n) {
    var verse = Bible.clampVerse(root.bible, root.book, root.chapter, n)
    root.extending = false
    root.anchorVerse = verse
    root.focusVerse = verse
    root.startVerse = verse
    root.endVerse = verse
    root.persist()
    root.scrollToFocus()
  }

  function selectRange(a, b) {
    var range = Bible.orderedRange(
      Bible.clampVerse(root.bible, root.book, root.chapter, a),
      Bible.clampVerse(root.bible, root.book, root.chapter, b)
    )
    root.startVerse = range.start
    root.endVerse = range.end
    root.focusVerse = Bible.clampVerse(root.bible, root.book, root.chapter, b)
    root.persist()
    root.scrollToFocus()
  }

  function selectWholeChapter() {
    root.extending = false
    root.anchorVerse = 1
    root.focusVerse = root.verseTotal
    root.startVerse = 1
    root.endVerse = root.verseTotal
    root.persist()
  }

  function moveFocus(delta, extend) {
    if (root.mode !== "read") return
    var next = Bible.clampVerse(root.bible, root.book, root.chapter, root.focusVerse + delta)
    if (extend) {
      if (!root.extending) {
        root.anchorVerse = root.focusVerse
        root.extending = true
      }
      root.focusVerse = next
      root.selectRange(root.anchorVerse, next)
      return
    }
    root.extending = false
    root.focusVerse = next
    root.scrollToFocus()
  }

  function stepChapter(delta) {
    var book = root.book
    var chapter = root.chapter
    var codes = GrabBcv.bookCodes() || []
    var max = GrabBcv.chapterCount(book)
    if (!(max > 0)) max = 1
    if (delta > 0) {
      if (chapter < max) {
        root.applyPlace(book, chapter + 1, 1, 1, true)
        return
      }
      var nextIdx = codes.indexOf(book) + 1
      if (nextIdx > 0 && nextIdx < codes.length)
        root.applyPlace(codes[nextIdx], 1, 1, 1, true)
      return
    }
    if (chapter > 1) {
      root.applyPlace(book, chapter - 1, 1, 1, true)
      return
    }
    var prevIdx = codes.indexOf(book) - 1
    if (prevIdx >= 0) {
      var prev = codes[prevIdx]
      var prevMax = GrabBcv.chapterCount(prev)
      root.applyPlace(prev, prevMax > 0 ? prevMax : 1, 1, 1, true)
    }
  }

  function stepBook(delta) {
    var codes = GrabBcv.bookCodes() || []
    var idx = codes.indexOf(root.book) + (delta > 0 ? 1 : -1)
    if (idx < 0 || idx >= codes.length) return
    root.applyPlace(codes[idx], 1, 1, 1, true)
  }

  function refreshSuggestions() {
    var parsed = GrabBcv.tryParse(root.searchText)
    root.searchParsed = !!(parsed && parsed.ok)
    var rows = GrabBcv.suggest(root.searchText, 6)
    root.suggestions = rows
    root.suggestionIndex = rows.length > 0 ? 0 : -1
    root.searchHint = GrabBcv.typingHint(root.searchText)
    if (!root.searchHint && rows.length > 0 && rows[0].extra)
      root.searchHint = rows[0].extra
  }

  function acceptTopSuggestion() {
    var row = root.suggestions.length > 0 ? root.suggestions[0] : null
    if (!row) return false
    var insert = String(row.insertText || "").replace(/\s+$/g, "")
    if (!insert) return false
    insert = insert + " "
    root.searchText = insert
    searchField.text = insert
    searchField.cursorPosition = insert.length
    var parsed = GrabBcv.tryParse(row.insertText || row.canonical)
    if (parsed && parsed.ok) root.applyParsed(parsed.passage, true)
    Qt.callLater(function() {
      searchField.forceActiveFocus()
      searchField.cursorPosition = searchField.text.length
    })
    return true
  }

  function applySuggestion(row) {
    if (!row) return
    root.suggestions = [row]
    root.acceptTopSuggestion()
  }

  function submitSearch() {
    if (root.acceptTopSuggestion()) return
    var parsed = GrabBcv.tryParse(root.searchText)
    if (!parsed || !parsed.ok) {
      root.searchError = parsed && parsed.message ? parsed.message : "Not a known reference"
      return
    }
    root.applyParsed(parsed.passage, true)
    root.searchText = ""
    searchField.text = ""
    root.suggestions = []
    root.suggestionIndex = -1
    root.searchHint = ""
  }

  function parsedOrSelection() {
    if (root.searchText && String(root.searchText).trim()) {
      var parsed = GrabBcv.tryParse(root.searchText)
      if (parsed && parsed.ok) return parsed.passage
    }
    return null
  }

  function routeNow() {
    var parsed = root.parsedOrSelection()
    if (parsed) root.applyParsed(parsed, true)
    Util.execArgv(["omarchy", "launch", "browser", root.routeLink])
    root.requestClose()
  }

  function outlineNow() {
    var parsed = root.parsedOrSelection()
    if (parsed) root.applyParsed(parsed, true)
    Util.execArgv(["omarchy", "launch", "browser", root.marginLink])
    root.requestClose()
  }

  function copyUrl() {
    Quickshell.execDetached(["bash", "-c", "printf %s " + Util.shellQuote(root.routeLink) + " | wl-copy"])
  }

  function copyText() {
    var body = Bible.selectedText(root.bible, root.selection)
    var payload = root.displayLabel + " (BSB)\n" + body + "\n" + root.routeLink
    Quickshell.execDetached(["bash", "-c", "printf %s " + Util.shellQuote(payload) + " | wl-copy"])
  }

  function openBooks() {
    root.testament = Bible.testamentOf(root.book, root.bookCodeList)
    root.mode = "books"
  }

  function pickBook(code) {
    root.book = code
    root.chapter = 1
    root.mode = "chapters"
  }

  function pickChapter(n) {
    root.applyPlace(root.book, n, 1, 1, true)
  }

  function focusSearch(selectAll) {
    searchField.forceActiveFocus()
    if (selectAll === false) {
      searchField.cursorPosition = searchField.text.length
    } else {
      searchField.selectAll()
    }
  }

  function enterVersesFromSearch() {
    root.mode = "read"
    root.suggestionIndex = -1
    root.extending = false
    root.focusVerse = 1
    searchField.focus = false
    Qt.callLater(function() {
      root.requestVerseFocus()
      root.scrollToFocus()
    })
  }

  function scrollToFocus() {
    if (!verseList.count) return
    var idx = Math.max(0, Math.min(verseList.count - 1, root.focusVerse - 1))
    verseList.positionViewAtIndex(idx, ListView.Contain)
  }

  function verseIndexAt(mouseY) {
    var mapped = verseList.mapToItem(verseList.contentItem, 8, mouseY)
    var idx = verseList.indexAt(mapped.x, mapped.y)
    return idx
  }

  function handleEscape() {
    if (root.searchText) {
      root.searchText = ""
      searchField.text = ""
      root.suggestions = []
      root.searchError = ""
      return true
    }
    if (root.mode === "chapters") {
      root.mode = "books"
      return true
    }
    if (root.mode === "books") {
      root.mode = "read"
      return true
    }
    return false
  }

  function handleMove(dx, dy, extend) {
    if (dx !== 0) {
      root.stepChapter(dx)
      return
    }
    if (root.mode === "books" || root.mode === "chapters") return
    if (dy < 0 && !extend && root.focusVerse <= 1) {
      root.focusSearch(false)
      return
    }
    if (dy !== 0) root.moveFocus(dy, extend === true)
  }

  function handleTextKey(text) {
    var t = String(text || "")
    if (t === "b" || t === "B") { root.openBooks(); return }
    if (t === "c" || t === "C") { root.mode = "chapters"; return }
    if (t === "g" || t === "G" || t === "/") { root.focusSearch(); return }
    if (t === "o" || t === "O") { root.routeNow(); return }
    if (t === "m" || t === "M") { root.outlineNow(); return }
    if (t === "y" || t === "Y") { root.copyUrl(); return }
    if (t === "f" || t === "F") {
      if (root.expanded) root.requestCollapse()
      else root.requestExpand()
      return
    }
    if (t.length === 1 && t.charCodeAt(0) >= 32) root.focusSearch()
  }

  FileView {
    id: bibleFile
    path: root.fileUrlToPath(Qt.resolvedUrl("data/bsb.json"))
    printErrors: false
    onLoaded: {
      try { root.bible = JSON.parse(text()) } catch (e) { root.bible = null }
      stateFile.reload()
    }
  }

  FileView {
    id: stateFile
    path: Quickshell.env("HOME") + "/.local/state/omarchy/settings/route-bible.json"
    watchChanges: true
    atomicWrites: true
    printErrors: false
    onLoaded: {
      var place = Bible.parseState(text())
      root.applyPlace(place.book, place.chapter, place.startVerse, place.endVerse, false)
      root.stateReady = true
    }
    onLoadFailed: {
      root.applyPlace(Bible.defaultBook(), Bible.defaultChapter(), Bible.defaultVerse(), Bible.defaultVerse(), false)
      root.stateReady = true
    }
    onFileChanged: reload()
  }

  Item {
    id: layout
    anchors.fill: parent

    Item {
      id: header
      anchors.top: parent.top
      anchors.left: parent.left
      anchors.right: parent.right
      height: Math.max(Style.space(28), titleCol.implicitHeight)

      Button {
        id: prevBtn
        anchors.left: parent.left
        anchors.verticalCenter: parent.verticalCenter
        width: Style.space(28)
        implicitHeight: Style.space(28)
        horizontalPadding: 0
        verticalPadding: 0
        iconText: "󰒮"
        foreground: root.foreground
        tooltipText: "Previous chapter"
        onClicked: root.stepChapter(-1)
      }

      Button {
        id: booksBtn
        anchors.right: parent.right
        anchors.verticalCenter: parent.verticalCenter
        width: Style.space(28)
        implicitHeight: Style.space(28)
        horizontalPadding: 0
        verticalPadding: 0
        iconText: "󰂻"
        foreground: root.mode === "read" ? root.muted : root.accent
        tooltipText: "Books"
        onClicked: {
          if (root.mode === "read") root.openBooks()
          else root.mode = "read"
        }
      }

      IconButton {
        id: expandBtn
        anchors.right: booksBtn.left
        anchors.rightMargin: Style.space(6)
        anchors.verticalCenter: parent.verticalCenter
        iconSource: Qt.resolvedUrl(root.expanded ? "icons/restore.svg" : "icons/expand.svg")
        foreground: root.foreground
        tooltipText: root.expanded ? "Restore popup" : "Expand"
        onClicked: {
          if (root.expanded) root.requestCollapse()
          else root.requestExpand()
        }
      }

      Button {
        id: nextBtn
        anchors.right: expandBtn.left
        anchors.rightMargin: Style.space(6)
        anchors.verticalCenter: parent.verticalCenter
        width: Style.space(28)
        implicitHeight: Style.space(28)
        horizontalPadding: 0
        verticalPadding: 0
        iconText: "󰒭"
        foreground: root.foreground
        tooltipText: "Next chapter"
        onClicked: root.stepChapter(1)
      }

      Column {
        id: titleCol
        anchors.left: prevBtn.right
        anchors.right: nextBtn.left
        anchors.leftMargin: Style.space(6)
        anchors.rightMargin: Style.space(6)
        anchors.verticalCenter: parent.verticalCenter
        spacing: Style.space(2)

        Text {
          width: parent.width
          text: root.displayLabel
          color: root.foreground
          font.family: root.fontFamily
          font.pixelSize: Style.font.subtitle
          font.bold: true
          elide: Text.ElideRight
          horizontalAlignment: Text.AlignHCenter
        }

        Text {
          width: parent.width
          text: "BSB"
          color: root.muted
          font.family: root.fontFamily
          font.pixelSize: Style.font.caption
          horizontalAlignment: Text.AlignHCenter
        }
      }
    }

    TextField {
      id: searchField
      anchors.top: header.bottom
      anchors.topMargin: Style.space(8)
      anchors.left: parent.left
      anchors.right: parent.right
      placeholderText: "jn 3:16–18"
      foreground: root.foreground
      font.family: root.fontFamily
      text: root.searchText
      onTextChanged: {
        root.searchText = text
        root.searchError = ""
        root.refreshSuggestions()
      }
      Keys.onPressed: function(event) {
        if (event.key === Qt.Key_Escape) {
          if (!root.handleEscape()) {
            searchField.focus = false
            root.requestVerseFocus()
          }
          event.accepted = true
        } else if (event.key === Qt.Key_Down) {
          root.enterVersesFromSearch()
          event.accepted = true
        } else if (event.key === Qt.Key_Tab) {
          if (!root.acceptTopSuggestion()) root.enterVersesFromSearch()
          event.accepted = true
        } else if (event.key === Qt.Key_Up) {
          event.accepted = true
        } else if (event.key === Qt.Key_Left) {
          root.stepChapter(-1)
          event.accepted = true
        } else if (event.key === Qt.Key_Right) {
          root.stepChapter(1)
          event.accepted = true
        } else if (event.key === Qt.Key_Return || event.key === Qt.Key_Enter) {
          if (event.modifiers & Qt.ControlModifier) root.routeNow()
          else if (event.modifiers & Qt.ShiftModifier) root.outlineNow()
          else if (!root.acceptTopSuggestion()) root.submitSearch()
          event.accepted = true
        }
      }
    }

    Text {
      id: errorLabel
      anchors.top: searchField.bottom
      anchors.topMargin: visible ? Style.space(4) : 0
      anchors.left: parent.left
      anchors.right: parent.right
      height: visible ? implicitHeight : 0
      visible: root.searchError !== ""
      text: root.searchError
      color: Color.urgent
      font.family: root.fontFamily
      font.pixelSize: Style.font.caption
      wrapMode: Text.WordWrap
    }

    Text {
      id: hintLabel
      anchors.top: errorLabel.bottom
      anchors.topMargin: visible ? Style.space(2) : 0
      anchors.left: parent.left
      anchors.right: parent.right
      height: visible ? implicitHeight : 0
      visible: root.searchActive && root.searchHint !== "" && root.searchError === ""
      text: root.searchHint
      color: root.muted
      font.family: root.fontFamily
      font.pixelSize: Style.font.caption
      elide: Text.ElideRight
    }

    Column {
      id: suggestionBox
      anchors.top: hintLabel.bottom
      anchors.topMargin: visible ? Style.space(4) : 0
      anchors.left: parent.left
      anchors.right: parent.right
      height: visible ? implicitHeight : 0
      spacing: Style.space(2)
      visible: root.searchActive && root.suggestions.length > 0 && root.mode === "read"

      Repeater {
        model: root.suggestions
        delegate: Button {
          required property var modelData
          required property int index
          width: suggestionBox.width
          text: modelData.label
          selected: index === root.suggestionIndex
          foreground: root.foreground
          leftAlign: true
          onClicked: root.applySuggestion(modelData)
        }
      }
    }

    Item {
      id: body
      anchors.top: suggestionBox.bottom
      anchors.topMargin: Style.space(8)
      anchors.left: parent.left
      anchors.right: parent.right
      anchors.bottom: footer.top
      anchors.bottomMargin: Style.space(8)

      ListView {
        id: verseList
        anchors.fill: parent
        clip: true
        visible: root.mode === "read"
        spacing: Style.space(6)
        boundsBehavior: Flickable.StopAtBounds
        interactive: !root.dragging
        keyNavigationEnabled: false
        activeFocusOnTab: false
        focus: false
        model: root.verses

        delegate: Item {
          required property var modelData
          width: ListView.view ? ListView.view.width : 1
          height: verseText.implicitHeight

          readonly property bool selected: modelData.n >= Math.min(root.startVerse, root.endVerse)
            && modelData.n <= Math.max(root.startVerse, root.endVerse)
          readonly property bool hovered: !root.searchActive && modelData.n === root.focusVerse

          Rectangle {
            anchors.fill: parent
            radius: Style.cornerRadius
            color: parent.selected
              ? Style.selectionFillFor(root.foreground, root.accent)
              : (parent.hovered ? Style.controlFill(false, true, root.foreground, root.accent) : "transparent")
          }

          Rectangle {
            visible: parent.hovered
            width: Math.max(2, Style.space(2))
            anchors.left: parent.left
            anchors.top: parent.top
            anchors.bottom: parent.bottom
            radius: width
            color: root.accent
          }

          Text {
            id: verseText
            width: parent.width
            text: modelData.n + "  " + modelData.t
            color: parent.hovered ? root.accent : root.foreground
            font.family: root.fontFamily
            font.pixelSize: Style.font.bodySmall
            font.bold: parent.hovered
            wrapMode: Text.WordWrap
            padding: Style.space(4)
          }
        }

        MouseArea {
          anchors.fill: parent
          acceptedButtons: Qt.LeftButton
          hoverEnabled: true
          preventStealing: root.dragging
          cursorShape: Qt.IBeamCursor
          onPressed: function(mouse) {
            root.requestVerseFocus()
            var idx = root.verseIndexAt(mouse.y)
            if (idx < 0) return
            var verse = root.verses[idx] ? root.verses[idx].n : idx + 1
            root.dragging = true
            if (mouse.modifiers & Qt.ShiftModifier) root.selectRange(root.anchorVerse, verse)
            else {
              root.anchorVerse = verse
              root.selectVerse(verse)
            }
          }
          onPositionChanged: function(mouse) {
            var idx = root.verseIndexAt(mouse.y)
            if (idx < 0) return
            var verse = root.verses[idx] ? root.verses[idx].n : idx + 1
            if (root.dragging) {
              root.selectRange(root.anchorVerse, verse)
              if (mouse.y < 24) verseList.flick(0, 420)
              else if (mouse.y > height - 24) verseList.flick(0, -420)
            } else {
              root.focusVerse = verse
            }
          }
          onReleased: root.dragging = false
          onCanceled: root.dragging = false
          onWheel: function(wheel) {
            wheel.accepted = false
          }
        }
      }

      Column {
        anchors.fill: parent
        visible: root.mode !== "read"
        spacing: Style.space(8)

        ButtonGroup {
          width: parent.width
          visible: root.mode === "books"
          foreground: root.foreground
          value: root.testament
          options: [
            { value: "ot", label: "Old Testament" },
            { value: "nt", label: "New Testament" }
          ]
          onChanged: function(value) {
            root.testament = value
          }
        }

        ListView {
          width: parent.width
          height: parent.height - (root.mode === "books" ? Style.space(40) : 0)
          clip: true
          visible: root.mode === "books"
          model: root.visibleBooks
          boundsBehavior: Flickable.StopAtBounds
          delegate: Item {
            required property var modelData
            width: ListView.view ? ListView.view.width : 1
            height: Style.space(28)

            Text {
              anchors.verticalCenter: parent.verticalCenter
              text: GrabBcv.bookName(modelData)
              color: modelData === root.book ? root.accent : root.foreground
              font.family: root.fontFamily
              font.pixelSize: Style.font.bodySmall
              font.bold: modelData === root.book
            }

            MouseArea {
              anchors.fill: parent
              cursorShape: Qt.PointingHandCursor
              onClicked: root.pickBook(modelData)
            }
          }
        }

        GridView {
          width: parent.width
          height: parent.height
          visible: root.mode === "chapters"
          cellWidth: Style.space(40)
          cellHeight: Style.space(32)
          clip: true
          model: GrabBcv.chapterCount(root.book)
          delegate: Item {
            required property int index
            width: Style.space(36)
            height: Style.space(28)

            Rectangle {
              anchors.fill: parent
              radius: Style.cornerRadius
              color: (index + 1) === root.chapter ? Style.selectionFillFor(root.foreground, root.accent) : "transparent"
            }

            Text {
              anchors.centerIn: parent
              text: index + 1
              color: (index + 1) === root.chapter ? root.accent : root.foreground
              font.family: root.fontFamily
              font.pixelSize: Style.font.bodySmall
            }

            MouseArea {
              anchors.fill: parent
              cursorShape: Qt.PointingHandCursor
              onClicked: root.pickChapter(index + 1)
            }
          }
        }
      }
    }

    Item {
      id: footer
      anchors.left: parent.left
      anchors.right: parent.right
      anchors.bottom: parent.bottom
      height: footerRow.implicitHeight

      Row {
        id: footerRow
        anchors.right: parent.right
        spacing: Style.space(6)

        IconButton {
          iconSource: Qt.resolvedUrl("icons/copy.svg")
          foreground: root.foreground
          tooltipText: "Copy text and URL"
          onClicked: root.copyText()
        }

        Button {
          text: "Outline"
          bordered: true
          foreground: root.foreground
          tooltipText: "Open this passage in the margin.bible outliner"
          onClicked: root.outlineNow()
        }

        Button {
          text: "Open route.bible  ↵"
          foreground: root.foreground
          accent: root.accent
          selected: true
          tooltipText: "Open the current selection on route.bible"
          onClicked: root.routeNow()
        }
      }
    }
  }

  Shortcut { enabled: root.keysLive; sequence: "Left"; onActivated: root.stepChapter(-1) }
  Shortcut { enabled: root.keysLive; sequence: "Right"; onActivated: root.stepChapter(1) }
  Shortcut {
    enabled: root.keysLive
    sequence: "Down"
    onActivated: {
      if (root.searchActive) root.enterVersesFromSearch()
      else root.handleMove(0, 1, false)
    }
  }
  Shortcut {
    enabled: root.keysLive
    sequence: "Up"
    onActivated: {
      if (root.searchActive) return
      root.handleMove(0, -1, false)
    }
  }
  Shortcut { enabled: root.keysLive; sequence: "Shift+Down"; onActivated: root.handleMove(0, 1, true) }
  Shortcut { enabled: root.keysLive; sequence: "Shift+Up"; onActivated: root.handleMove(0, -1, true) }
  Shortcut { enabled: root.keysLive && !root.searchActive; sequence: "Space"; onActivated: root.selectVerse(root.focusVerse) }
  Shortcut { enabled: root.keysLive && !root.searchActive; sequence: "Shift+Space"; onActivated: root.handleMove(0, -1, true) }
}
