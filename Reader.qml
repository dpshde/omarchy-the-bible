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
  property color urgent: Color.urgent
  property color selectionFill: Style.selectionFillFor(foreground, accent)
  property color hoverFill: Style.controlFill(false, true, foreground, accent)
  property color surfaceColor: Color.background
  property string fontFamily: Style.font.family
  readonly property color selectedTextColor: root.contrastTextOn(root.selectionFill, root.surfaceColor)
  property var host: null
  property bool expanded: false
  property bool windowed: false
  property bool publication: false
  property bool pubRequested: false
  property var pub: null
  property bool shiftHeld: false
  property bool fullscreen: false

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
  property string focusBook: Bible.defaultBook()
  property int focusChapter: Bible.defaultChapter()
  property double lastNavAt: 0
  property bool ignoreNav: false
  property bool hoverLocked: false
  property bool writingState: false
  property bool spaceHeld: false
  property bool suppressSearchSync: false
  property string pendingStateText: ""
  property string stateOp: ""

  readonly property string statePath: {
    var home = String(Quickshell.env("HOME") || "")
    if (!home || home.charAt(0) !== "/") return ""
    var parts = home.split("/")
    for (var i = 0; i < parts.length; i++) {
      if (parts[i] === "..") return ""
    }
    return home + "/.local/state/omarchy/settings/route-bible.json"
  }
  readonly property string stateHelper: root.fileUrlToPath(Qt.resolvedUrl("safe-state.py"))
  readonly property int stateLimit: Bible.stateMaxBytes()

  readonly property var bookCodeList: GrabBcv.bookCodes()
  readonly property int verseTotal: Bible.lastVerseNumber(root.bible, root.book, root.chapter)
  readonly property var verses: Bible.versesFor(root.bible, root.book, root.chapter)
  readonly property var readerRows: Bible.readerBlocks(root.bible, root.book, root.chapter)
  readonly property var pubRows: Bible.pubBlocks(root.pub, root.book, root.chapter)
  readonly property bool usePublication: root.publication && !!root.pub
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
  signal requestPopout()
  signal requestFullscreen()
  signal requestVerseFocus()

  function colorChannelLum(value) {
    var channel = Number(value)
    if (!isFinite(channel)) return 0
    return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4)
  }

  function colorLum(c) {
    if (!c) return 0
    if (typeof c === "string") c = Qt.color(c)
    return 0.2126 * root.colorChannelLum(c.r) + 0.7152 * root.colorChannelLum(c.g) + 0.0722 * root.colorChannelLum(c.b)
  }

  function blendOver(fg, bg) {
    if (!fg) return bg
    if (typeof fg === "string") fg = Qt.color(fg)
    if (typeof bg === "string") bg = Qt.color(bg)
    var a = fg.a
    if (!(a < 1)) return fg
    return Qt.rgba(fg.r * a + bg.r * (1 - a), fg.g * a + bg.g * (1 - a), fg.b * a + bg.b * (1 - a), 1)
  }

  function contrastRatio(a, b) {
    var l1 = root.colorLum(a)
    var l2 = root.colorLum(b)
    var hi = Math.max(l1, l2)
    var lo = Math.min(l1, l2)
    return (hi + 0.05) / (lo + 0.05)
  }

  function contrastTextOn(fill, surface) {
    var bg = root.blendOver(fill, surface || Color.background)
    var light = Qt.rgba(1, 1, 1, 1)
    var dark = Qt.rgba(0.07, 0.07, 0.08, 1)
    if (root.contrastRatio(root.foreground, bg) >= 4.5) return root.foreground
    return root.contrastRatio(light, bg) >= root.contrastRatio(dark, bg) ? light : dark
  }

  function fileUrlToPath(url) {
    var s = String(url || "")
    if (s.indexOf("file://") === 0) return decodeURIComponent(s.slice(7))
    return s
  }

  function persist() {
    if (!root.stateReady) return
    if (!root.statePath || !root.stateHelper) return
    root.pendingStateText = Bible.serializeState(root.selection, { publication: root.publication })
    root.startStateOp("write")
  }

  function applyDefaultState() {
    root.writingState = false
    root.publication = false
    root.applyPlace(Bible.defaultBook(), Bible.defaultChapter(), Bible.defaultVerse(), Bible.defaultVerse(), false)
    root.stateReady = true
  }

  function applyStateText(raw) {
    var place = Bible.parseState(raw)
    if (!place || !Bible.isKnownBook(place.book) || GrabBcv.chapterCount(place.book) < 1) {
      root.applyDefaultState()
      return
    }
    if (place.publication) {
      root.publication = true
      root.pubRequested = true
    }
    if (root.stateReady
        && place.book === root.book
        && place.chapter === root.chapter
        && place.startVerse === root.startVerse
        && place.endVerse === root.endVerse) {
      root.stateReady = true
      return
    }
    root.applyPlace(place.book, place.chapter, place.startVerse, place.endVerse, false)
    root.stateReady = true
  }

  function startStateOp(op) {
    if (!root.statePath || !root.stateHelper) {
      root.applyDefaultState()
      return
    }
    if (op === "write") root.writingState = true
    root.stateOp = op
    var proc = op === "write" ? stateWriter : (op === "check" ? stateChecker : stateReader)
    proc.running = false
    if (op === "write")
      proc.environment = ({ ROUTE_BIBLE_STATE: root.pendingStateText })
    proc.command = ["python3", root.stateHelper, op, root.statePath, String(root.stateLimit)]
    proc.running = true
  }

  function togglePublication() {
    root.publication = !root.publication
    if (root.publication) root.pubRequested = true
    root.persist()
  }



  function applyPlace(book, chapter, startVerse, endVerse, persistNow) {
    if (!book || !Bible.isKnownBook(book) || GrabBcv.chapterCount(book) < 1) return false
    var nextChapter = Math.max(1, Math.min(GrabBcv.chapterCount(book), Math.floor(chapter || 1)))
    var startNum = Math.floor(Number(startVerse))
    var endNum = Math.floor(Number(endVerse))
    var hasSel = startNum >= 1 && endNum >= 1
    root.book = book
    root.chapter = nextChapter
    if (!hasSel) {
      root.startVerse = 0
      root.endVerse = 0
      root.focusVerse = 1
      root.anchorVerse = 1
    } else {
      var start = Bible.clampVerse(root.bible, book, nextChapter, startNum)
      var end = Bible.clampVerse(root.bible, book, nextChapter, endNum)
      var range = Bible.orderedRange(start, end)
      root.startVerse = range.start
      root.endVerse = range.end
      root.focusVerse = range.end
      root.anchorVerse = range.start
    }
    root.mode = "read"
    root.searchError = ""
    if (persistNow !== false) root.persist()
    if (!root.suppressSearchSync) root.syncSearchToChapter()
    Qt.callLater(root.scrollToFocus)
    return true
  }

  function syncSearchToChapter() {
    var name = GrabBcv.bookName(root.book)
    if (!name) return
    var next = name + " " + root.chapter
    var start = Math.floor(Number(root.startVerse))
    var end = Math.floor(Number(root.endVerse))
    var total = root.verseTotal
    var whole = start <= 1 && end >= total && total > 0
    if (start >= 1 && end >= 1 && !whole) {
      next += ":" + start
      if (end !== start) next += "-" + end
    }
    if (root.searchText === next) return
    root.searchText = next
    if (searchField) {
      searchField.text = next
      if (searchField.activeFocus) searchField.cursorPosition = next.length
    }
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
      startVerse = 0
      endVerse = 0
    }
    return root.applyPlace(passage.startBook, passage.startChapter, startVerse, endVerse, persistNow)
  }

  function selectVerse(n) {
    var verse = Bible.clampVerse(root.bible, root.book, root.chapter, n)
    var alreadyFocused = verse === root.focusVerse
    root.extending = false
    root.anchorVerse = verse
    root.focusVerse = verse
    root.startVerse = verse
    root.endVerse = verse
    root.hoverLocked = true
    if (pointerGate) pointerGate.reset()
    root.persist()
    if (!root.suppressSearchSync) root.syncSearchToChapter()
    if (!alreadyFocused) root.scrollToFocus()
  }

  function selectHovered() {
    var verse = root.focusVerse
    root.ignoreNav = true
    root.selectVerse(verse)
    Qt.callLater(function() {
      root.focusVerse = verse
      root.ignoreNav = false
    })
  }

  function beginSpaceHold() {
    if (root.mode !== "read") return
    if (root.spaceHeld) return
    root.spaceHeld = true
    root.selectVerse(root.focusVerse)
  }

  function endSpaceHold() {
    root.spaceHeld = false
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
    if (!root.suppressSearchSync) root.syncSearchToChapter()
    if (!root.dragging) root.scrollToFocus()
  }

  function selectWholeChapter() {
    root.extending = false
    root.anchorVerse = 1
    root.focusVerse = root.verseTotal
    root.startVerse = 1
    root.endVerse = root.verseTotal
    root.persist()
    if (!root.suppressSearchSync) root.syncSearchToChapter()
  }

  function moveFocus(delta, extend) {
    if (root.mode !== "read") return
    var next = Bible.clampVerse(root.bible, root.book, root.chapter, root.focusVerse + delta)
    if (pointerGate) pointerGate.reset()
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
        root.applyPlace(book, chapter + 1, 0, 0, true)
        return
      }
      var nextIdx = codes.indexOf(book) + 1
      if (nextIdx > 0 && nextIdx < codes.length)
        root.applyPlace(codes[nextIdx], 1, 0, 0, true)
      return
    }
    if (chapter > 1) {
      root.applyPlace(book, chapter - 1, 0, 0, true)
      return
    }
    var prevIdx = codes.indexOf(book) - 1
    if (prevIdx >= 0) {
      var prev = codes[prevIdx]
      var prevMax = GrabBcv.chapterCount(prev)
      root.applyPlace(prev, prevMax > 0 ? prevMax : 1, 0, 0, true)
    }
  }

  function stepBook(delta) {
    var codes = GrabBcv.bookCodes() || []
    var idx = codes.indexOf(root.book) + (delta > 0 ? 1 : -1)
    if (idx < 0 || idx >= codes.length) return
    root.applyPlace(codes[idx], 1, 0, 0, true)
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
    if (parsed && parsed.ok) root.previewTypedPlace(parsed.passage)
  }

  function previewTypedPlace(passage) {
    if (!passage || !passage.startBook) return
    var start = passage.startVerse || 0
    var end = passage.endVerse || 0
    if (passage.startBook === root.book && passage.startChapter === root.chapter
        && start === root.startVerse && end === root.endVerse)
      return
    root.suppressSearchSync = true
    root.applyParsed(passage, true)
    root.suppressSearchSync = false
  }

  function acceptTopSuggestion() {
    var idx = root.suggestionIndex
    if (idx < 0 || idx >= root.suggestions.length) idx = 0
    var row = root.suggestions.length > 0 ? root.suggestions[idx] : null
    if (!row) return false
    var insert = String(row.insertText || "").replace(/\s+$/g, "")
    if (!insert) return false
    insert = insert + " "
    root.searchText = insert
    searchField.text = insert
    searchField.cursorPosition = insert.length
    var parsed = GrabBcv.tryParse(row.insertText || row.canonical)
    if (parsed && parsed.ok) {
      root.suppressSearchSync = true
      root.applyParsed(parsed.passage, true)
      root.suppressSearchSync = false
    }
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

  function followWikiRef(ref) {
    var raw = String(ref || "").trim()
    if (!raw) return
    root.searchError = ""
    root.searchText = raw
    if (searchField) {
      searchField.text = raw
      searchField.cursorPosition = raw.length
    }
    var parsed = GrabBcv.tryParse(Bible.parseRefInput(raw))
    if (!parsed || !parsed.ok) {
      root.searchError = parsed && parsed.message ? parsed.message : "Not a known reference"
      root.focusSearch(false)
      return
    }
    root.suppressSearchSync = true
    root.applyParsed(parsed.passage, true)
    root.suppressSearchSync = false
    if (searchField) searchField.focus = false
    root.requestVerseFocus()
  }

  function queueWikiRef(ref) {
    var raw = String(ref || "").trim()
    if (!raw) return
    Qt.callLater(function() { root.followWikiRef(raw) })
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

  function searchOpensRoute() {
    return root.parsedOrSelection() !== null
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

  function navOnce() {
    var t = Date.now()
    if (t - root.lastNavAt < 8) return false
    root.lastNavAt = t
    return true
  }

  function openBooks() {
    root.testament = Bible.testamentOf(root.book, root.bookCodeList)
    root.mode = "books"
    root.focusBook = root.book
    root.clampFocusBook()
    Qt.callLater(root.scrollBookFocus)
  }

  function openChapters() {
    root.mode = "chapters"
    root.focusChapter = root.chapter
    Qt.callLater(root.scrollChapterFocus)
  }

  function pickBook(code) {
    if (!code) return
    root.book = code
    root.focusBook = code
    root.chapter = 1
    root.focusChapter = 1
    root.mode = "chapters"
    Qt.callLater(root.scrollChapterFocus)
  }

  function pickChapter(n) {
    root.applyPlace(root.book, n, 0, 0, true)
  }

  function clampFocusBook() {
    var books = root.visibleBooks || []
    if (books.length === 0) {
      root.focusBook = ""
      return
    }
    if (books.indexOf(root.focusBook) >= 0) return
    if (books.indexOf(root.book) >= 0) {
      root.focusBook = root.book
      return
    }
    root.focusBook = books[0]
  }

  function scrollBookFocus() {
    if (!bookList.count) return
    var books = root.visibleBooks || []
    var idx = books.indexOf(root.focusBook)
    if (idx < 0) return
    bookList.positionViewAtIndex(idx, ListView.Contain)
  }

  function scrollChapterFocus() {
    if (!chapterGrid.count) return
    var idx = Math.max(0, (root.focusChapter || 1) - 1)
    chapterGrid.positionViewAtIndex(idx, GridView.Contain)
  }

  function chapterColumns() {
    if (!chapterGrid || !(chapterGrid.cellWidth > 0)) return 6
    return Math.max(1, Math.floor(chapterGrid.width / chapterGrid.cellWidth))
  }

  function switchTestament(dx) {
    var next = dx < 0 ? "ot" : "nt"
    if (root.testament === next) return
    root.testament = next
    root.clampFocusBook()
    root.scrollBookFocus()
  }

  function moveBookFocus(dy) {
    var books = root.visibleBooks || []
    if (books.length === 0) return
    var idx = books.indexOf(root.focusBook)
    if (idx < 0) idx = 0
    var next = idx + dy
    if (next < 0) {
      root.focusSearch(false)
      return
    }
    if (next >= books.length) next = books.length - 1
    root.focusBook = books[next]
    root.scrollBookFocus()
  }

  function moveChapterFocus(dx, dy) {
    var total = GrabBcv.chapterCount(root.book)
    if (!(total > 0)) return
    var cols = root.chapterColumns()
    var current = Math.max(1, Math.min(total, root.focusChapter || 1))
    if (dy < 0 && current <= cols) {
      root.mode = "read"
      root.requestVerseFocus()
      return
    }
    var next = current + dx + dy * cols
    if (next < 1) next = 1
    if (next > total) next = total
    root.focusChapter = next
    root.scrollChapterFocus()
  }

  function activateHovered() {
    if (root.mode === "books") {
      root.pickBook(root.focusBook)
      return
    }
    if (root.mode === "chapters") {
      root.pickChapter(root.focusChapter)
      return
    }
    root.selectHovered()
  }

  function handleHome() {
    if (root.mode === "books") {
      var books = root.visibleBooks || []
      if (books.length) root.focusBook = books[0]
      root.scrollBookFocus()
      return
    }
    if (root.mode === "chapters") {
      root.focusChapter = 1
      root.scrollChapterFocus()
      return
    }
    root.selectVerse(1)
  }

  function handleEnd() {
    if (root.mode === "books") {
      var books = root.visibleBooks || []
      if (books.length) root.focusBook = books[books.length - 1]
      root.scrollBookFocus()
      return
    }
    if (root.mode === "chapters") {
      root.focusChapter = Math.max(1, GrabBcv.chapterCount(root.book))
      root.scrollChapterFocus()
      return
    }
    root.selectVerse(root.verseTotal)
  }

  function handlePage(delta, extend) {
    if (root.mode === "books") {
      root.moveBookFocus(delta)
      return
    }
    if (root.mode === "chapters") {
      root.moveChapterFocus(0, delta > 0 ? 2 : -2)
      return
    }
    root.moveFocus(delta, extend === true || root.spaceHeld)
  }

  function focusSearch(selectAll) {
    searchField.forceActiveFocus()
    if (selectAll === false) {
      searchField.cursorPosition = searchField.text.length
    } else {
      searchField.selectAll()
    }
  }

  function typeIntoSearch(ch) {
    var next = String(ch || "")
    if (!next) return
    if (root.mode !== "books") root.mode = "read"
    root.searchError = ""
    root.searchText = next
    searchField.text = next
    searchField.forceActiveFocus()
    searchField.cursorPosition = next.length
    if (root.mode === "books") root.clampFocusBook()
  }

  function moveSuggestion(delta) {
    var rows = root.suggestions || []
    if (root.mode !== "read" || rows.length < 2) return false
    var idx = root.suggestionIndex
    if (idx < 0) idx = 0
    var next = idx + delta
    if (next < 0) {
      root.suggestionIndex = 0
      return true
    }
    if (next >= rows.length) return false
    root.suggestionIndex = next
    return true
  }

  function handleSearchArrow(delta) {
    if (!root.navOnce()) return
    if (root.moveSuggestion(delta)) return
    if (delta > 0) root.enterFromSearch()
  }

  function enterFromSearch() {
    if (root.mode === "books") {
      searchField.focus = false
      root.clampFocusBook()
      root.requestVerseFocus()
      Qt.callLater(root.scrollBookFocus)
      return
    }
    if (root.mode === "chapters") {
      searchField.focus = false
      root.requestVerseFocus()
      return
    }
    root.enterVersesFromSearch()
  }

  function enterVersesFromSearch() {
    root.mode = "read"
    root.suggestionIndex = -1
    root.extending = false
    root.focusVerse = 1
    searchField.focus = false
    if (pointerGate) pointerGate.reset()
    Qt.callLater(function() {
      root.requestVerseFocus()
      root.scrollToFocus()
    })
  }

  function scrollToFocus() {
    if (!verseList.count) return
    var rows = root.usePublication ? root.pubRows : root.readerRows
    var idx = -1
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i]
      if (!row) continue
      if (row.kind === "verse" && row.n === root.focusVerse) {
        idx = i
        break
      }
      if (row.parts && row.parts.length) {
        for (var p = 0; p < row.parts.length; p++) {
          if (row.parts[p] && row.parts[p].n === root.focusVerse) {
            idx = i
            break
          }
        }
        if (idx >= 0) break
      }
    }
    if (idx < 0) return
    verseList.positionViewAtIndex(idx, ListView.Contain)
  }

  function verseAtRow(idx) {
    var rows = root.usePublication ? root.pubRows : root.readerRows
    var row = rows[idx]
    if (!row) return 0
    if (row.kind === "verse") {
      var n = Math.floor(Number(row.n) || 0)
      return n >= 1 ? n : 0
    }
    if (row.parts && row.parts.length) {
      var partN = Math.floor(Number(row.parts[0].n) || 0)
      return partN >= 1 ? partN : 0
    }
    return 0
  }

  function verseIndexAt(mouseY) {
    var mapped = verseList.mapToItem(verseList.contentItem, 8, mouseY)
    return verseList.indexAt(mapped.x, mapped.y)
  }

  function handleEscape() {
    if (root.searchActive) {
      searchField.focus = false
      root.syncSearchToChapter()
      return true
    }
    if (root.mode === "books") {
      root.openChapters()
      return true
    }
    if (root.mode === "chapters") {
      root.mode = "read"
      return true
    }
    return false
  }

  function handleMove(dx, dy, extend) {
    if (root.ignoreNav) return
    if (!root.navOnce()) return
    if (root.mode === "books") {
      if (dx !== 0) root.switchTestament(dx)
      if (dy !== 0) root.moveBookFocus(dy)
      return
    }
    if (root.mode === "chapters") {
      root.moveChapterFocus(dx, dy)
      return
    }
    if (dx !== 0) {
      if (dx < 0 && prevBtn) prevBtn.pulse()
      else if (dx > 0 && nextBtn) nextBtn.pulse()
      root.stepChapter(dx)
      return
    }
    var grow = extend === true || root.spaceHeld
    if (dy < 0 && !grow && root.focusVerse <= 1) {
      root.focusSearch(false)
      return
    }
    if (dy !== 0) root.moveFocus(dy, grow)
  }

  function handleTextKey(text) {
    var t = String(text || "")
    if (t === "b" || t === "B") { if (booksBtn) booksBtn.pulse(); root.openBooks(); return }
    if (t === "c" || t === "C") { root.openChapters(); return }
    if (t === "g" || t === "G" || t === "/") { root.focusSearch(); return }
    if (t === "o" || t === "O") { root.routeNow(); return }
    if (t === "m" || t === "M") { root.outlineNow(); return }
    if (t === "y" || t === "Y") { if (copyBtn) copyBtn.pulse(); root.copyUrl(); return }
    if (t === "p" || t === "P") {
      root.togglePublication()
      return
    }
    if (t === "f" || t === "F") {
      if (root.expanded) {
        if (popoutBtn && root.windowed) popoutBtn.pulse()
        else if (chromeBtn) chromeBtn.pulse()
        root.requestCollapse()
      } else {
        if (chromeBtn) chromeBtn.pulse()
        root.requestExpand()
      }
      return
    }
    if (t.length === 1 && /[A-Za-z0-9]/.test(t)) root.typeIntoSearch(t)
  }

  PointerMoveGate {
    id: pointerGate
    referenceItem: verseList
  }

  FileView {
    id: bibleFile
    path: root.fileUrlToPath(Qt.resolvedUrl("data/bsb.json"))
    printErrors: false
    watchChanges: true
    onLoaded: {
      root.bible = Bible.parseIndex(text())
      Qt.callLater(function() { root.startStateOp("check") })
    }
    onLoadFailed: {
      root.bible = null
      Qt.callLater(function() { root.startStateOp("check") })
    }
    onFileChanged: reload()
  }

  FileView {
    id: pubFile
    path: root.pubRequested ? root.fileUrlToPath(Qt.resolvedUrl("data/pub.json")) : ""
    printErrors: false
    watchChanges: true
    onLoaded: {
      root.pub = Bible.parsePublication(text())
    }
    onFileChanged: reload()
  }

  FileView {
    id: stateWatch
    path: root.statePath
    preload: false
    watchChanges: true
    printErrors: false
    onFileChanged: {
      if (root.writingState) return
      root.startStateOp("check")
    }
  }

  Process {
    id: stateChecker
    stdinEnabled: false
    stdout: StdioCollector {
      id: stateCheckOut
    }
    onExited: function(exitCode) {
      if (root.stateOp !== "check") return
      root.stateOp = ""
      var status = String(stateCheckOut.text || "").trim()
      if (exitCode === 0 && status === "missing") {
        root.applyDefaultState()
        return
      }
      if (exitCode === 0 && status === "ok") {
        root.startStateOp("read")
        return
      }
      root.applyDefaultState()
    }
  }

  Process {
    id: stateReader
    stdinEnabled: false
    stdout: StdioCollector {
      id: stateReadOut
    }
    onExited: function(exitCode) {
      if (root.stateOp !== "read") return
      root.stateOp = ""
      if (exitCode !== 0) {
        root.applyDefaultState()
        return
      }
      root.applyStateText(String(stateReadOut.text || ""))
    }
  }

  Process {
    id: stateWriter
    stdinEnabled: false
    stdout: StdioCollector {}
    onExited: function(exitCode) {
      root.writingState = false
      if (exitCode === 0) root.stateReady = true
    }
  }

  Item {
    id: layout
    anchors.fill: parent

    Item {
      id: header
      anchors.top: parent.top
      anchors.left: parent.left
      anchors.right: parent.right
      height: Math.max(Style.space(28), searchField.implicitHeight, headerRight.implicitHeight)

      TextField {
        id: searchField
        z: 1
        anchors.left: parent.left
        anchors.right: headerRight.left
        anchors.rightMargin: Style.space(6)
        anchors.verticalCenter: parent.verticalCenter
        placeholderText: "jn 3:16–18"
        foreground: root.foreground
        accent: root.accent
        placeholderTextColor: root.muted
        font.family: root.fontFamily
        font.pixelSize: Style.font.body
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
            root.handleSearchArrow(1)
            event.accepted = true
          } else if (event.key === Qt.Key_Tab) {
            if (!root.acceptTopSuggestion()) root.enterVersesFromSearch()
            event.accepted = true
          } else if (event.key === Qt.Key_Up) {
            root.handleSearchArrow(-1)
            event.accepted = true
          } else if (event.key === Qt.Key_Return || event.key === Qt.Key_Enter) {
            if (event.modifiers & Qt.ControlModifier) root.routeNow()
            else if (event.modifiers & Qt.ShiftModifier) root.outlineNow()
            else if (root.searchOpensRoute()) root.routeNow()
            else if (!root.acceptTopSuggestion()) root.submitSearch()
            event.accepted = true
          }
        }
      }

      Row {
        id: headerRight
        z: 2
        anchors.right: parent.right
        anchors.verticalCenter: parent.verticalCenter
        spacing: Style.space(6)

        IconButton {
          id: copyBtn
          iconSource: Qt.resolvedUrl("icons/copy.svg")
          foreground: root.foreground
          tooltipText: "Copy text and URL"
          onClicked: root.copyText()
        }

        IconButton {
          id: pubBtn
          iconSource: Qt.resolvedUrl("icons/publication.svg")
          selected: root.publication
          foreground: root.publication ? root.accent : root.foreground
          tooltipText: root.publication ? "Show verse list" : "Show publication layout"
          onClicked: root.togglePublication()
        }

        IconButton {
          id: popoutBtn
          visible: root.expanded && !root.fullscreen
          iconSource: Qt.resolvedUrl("icons/window.svg")
          foreground: root.foreground
          tooltipText: root.windowed ? "Dock overlay" : "Pop out window"
          onClicked: {
            if (root.windowed) root.requestCollapse()
            else root.requestPopout()
          }
        }

        IconButton {
          id: chromeBtn
          visible: !root.expanded
          iconSource: Qt.resolvedUrl("icons/expand.svg")
          foreground: root.foreground
          tooltipText: "Expand overlay"
          onClicked: root.requestExpand()
        }

        Button {
          text: "Open  ↵"
          foreground: root.foreground
          accent: root.accent
          fontFamily: root.fontFamily
          selected: true
          tooltipText: "Open the current selection on route.bible"
          onClicked: root.routeNow()
        }
      }
    }

    Text {
      id: errorLabel
      anchors.top: header.bottom
      anchors.topMargin: visible ? Style.space(4) : 0
      anchors.left: parent.left
      anchors.right: parent.right
      height: visible ? implicitHeight : 0
      visible: root.searchError !== ""
      text: root.searchError
      textFormat: Text.PlainText
      color: root.urgent
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
      textFormat: Text.PlainText
      color: root.muted
      font.family: root.fontFamily
      font.pixelSize: Style.font.caption
      elide: Text.ElideRight
    }

    BorderSurface {
      id: suggestionBox
      anchors.top: hintLabel.bottom
      anchors.topMargin: visible ? Style.space(4) : 0
      anchors.left: parent.left
      anchors.right: parent.right
      height: visible ? suggestionCol.implicitHeight + contentTopInset + contentBottomInset : 0
      visible: root.searchActive && root.suggestions.length > 0 && root.mode === "read"
      radius: Style.cornerRadius
      color: Style.controlFill(false, false, root.foreground, root.accent)
      borderSpec: Border.controlSpec("normal", root.foreground, root.accent)
      padding: Style.space(4)

      Column {
        id: suggestionCol
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.top: parent.top
        anchors.leftMargin: suggestionBox.contentLeftInset
        anchors.rightMargin: suggestionBox.contentRightInset
        anchors.topMargin: suggestionBox.contentTopInset
        spacing: Style.space(2)

        Repeater {
          model: root.suggestions
          delegate: Button {
            required property var modelData
            required property int index
            width: suggestionCol.width
            text: modelData.label
            selected: index === root.suggestionIndex
            foreground: root.foreground
            accent: root.accent
            fontFamily: root.fontFamily
            leftAlign: true
            onClicked: root.applySuggestion(modelData)
          }
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
        spacing: root.usePublication ? 0 : Style.space(2)
        boundsBehavior: Flickable.StopAtBounds
        interactive: !root.dragging
        keyNavigationEnabled: false
        activeFocusOnTab: false
        focus: false
        model: root.usePublication ? root.pubRows : root.readerRows

        delegate: Item {
          id: blockDelegate
          required property var modelData
          width: ListView.view ? ListView.view.width : 1
          height: (kind === "blank"
            ? Style.space(10)
            : (kind === "refs"
              ? refFlow.implicitHeight
              : (isFlow ? flow.implicitHeight : blockText.implicitHeight))) + topPad + bottomPad

          readonly property string kind: String(modelData.kind || "verse")
          readonly property bool isVerse: kind === "verse"
          readonly property bool isFlow: kind === "para" || kind === "q1" || kind === "q2" || kind === "li" || kind === "d"
          readonly property var refLinks: kind === "refs" ? Bible.splitRefs(String(modelData.text || "")) : []
          readonly property int verseNum: Number(modelData.n)
          readonly property int indent: Number(modelData.indent || 0)
          readonly property bool join: !!modelData.join
          readonly property bool joinNext: !!modelData.joinNext
          readonly property int fillVerse: Math.floor(Number(modelData.fillVerse) || 0)
          readonly property var parts: modelData.parts || []
          readonly property string blockLabel: isVerse
            ? (verseNum + "  " + String(modelData.t || ""))
            : (kind === "refs" ? ("(" + String(modelData.text || "") + ")") : String(modelData.text || ""))
          readonly property bool selected: {
            if (!(root.startVerse >= 1 && root.endVerse >= 1)) return false
            var lo = Math.min(root.startVerse, root.endVerse)
            var hi = Math.max(root.startVerse, root.endVerse)
            if (fillVerse >= 1) return fillVerse >= lo && fillVerse <= hi
            if (isVerse) return verseNum >= lo && verseNum <= hi
            if (!isFlow) return false
            for (var i = 0; i < parts.length; i++) {
              var n = Number(parts[i].n)
              if (n >= lo && n <= hi) return true
            }
            return false
          }
          readonly property bool hovered: {
            if (root.searchActive || selected) return false
            if (fillVerse >= 1) return fillVerse === root.focusVerse
            if (isVerse) return verseNum === root.focusVerse
            if (!isFlow) return false
            for (var i = 0; i < parts.length; i++) {
              if (Number(parts[i].n) === root.focusVerse) return true
            }
            return false
          }
          readonly property int topPad: {
            if (join) return 0
            if (kind === "heading" && modelData.spaced) return Style.space(16)
            if (kind === "subhead" && modelData.spaced) return Style.space(10)
            if (kind === "d") return Style.space(8)
            if (kind === "para") return Style.space(6)
            if (isVerse) return Style.space(3)
            return Style.space(1)
          }
          readonly property int bottomPad: joinNext ? 0 : (isVerse ? Style.space(3) : 0)

          function refAt(x, y) {
            var p = refFlow.mapFromItem(blockDelegate, x, y)
            var kids = refFlow.children
            for (var i = 0; i < kids.length; i++) {
              var child = kids[i]
              if (!child || !child.refText) continue
              if (p.x >= child.x && p.x <= child.x + child.width) return child.refText
            }
            if (blockDelegate.refLinks.length === 1) return blockDelegate.refLinks[0]
            return ""
          }

          Rectangle {
            visible: blockDelegate.isVerse || blockDelegate.isFlow || (blockDelegate.kind === "blank" && (blockDelegate.selected || blockDelegate.hovered))
            anchors.fill: parent
            radius: root.usePublication && (isFlow || kind === "blank") ? 0 : Style.cornerRadius
            color: blockDelegate.selected
              ? root.selectionFill
              : (blockDelegate.hovered ? root.hoverFill : "transparent")
          }

          Rectangle {
            visible: blockDelegate.hovered && blockDelegate.isVerse
            width: Math.max(2, Style.space(2))
            anchors.left: parent.left
            anchors.top: parent.top
            anchors.bottom: parent.bottom
            radius: width
            color: root.accent
          }

          Text {
            id: blockText
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            anchors.leftMargin: Style.space(4)
            anchors.rightMargin: Style.space(4)
            anchors.topMargin: blockDelegate.topPad
            visible: !blockDelegate.isFlow && blockDelegate.kind !== "blank" && blockDelegate.kind !== "refs"
            text: blockDelegate.blockLabel
            textFormat: Text.PlainText
            color: blockDelegate.isVerse
              ? (blockDelegate.selected ? root.selectedTextColor : (blockDelegate.hovered ? root.accent : root.foreground))
              : (blockDelegate.kind === "refs" || blockDelegate.kind === "d" ? root.muted : root.foreground)
            font.family: root.fontFamily
            font.pixelSize: blockDelegate.kind === "heading"
              ? Style.font.subtitle
              : (blockDelegate.kind === "refs" ? Style.font.caption : Style.font.bodySmall)
            font.weight: blockDelegate.kind === "heading" || blockDelegate.kind === "subhead" ? Font.Bold : Font.Normal
            font.italic: blockDelegate.kind === "refs" || blockDelegate.kind === "d"
            font.bold: (blockDelegate.kind === "heading" || blockDelegate.kind === "subhead")
              || (blockDelegate.hovered && blockDelegate.isVerse)
            wrapMode: Text.WordWrap
          }

          Flow {
            id: refFlow
            visible: blockDelegate.kind === "refs"
            z: 3
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            anchors.leftMargin: Style.space(4)
            anchors.rightMargin: Style.space(4)
            anchors.topMargin: blockDelegate.topPad
            spacing: 0

            Text {
              text: "("
              color: root.muted
              font.family: root.fontFamily
              font.pixelSize: Style.font.caption
              font.italic: true
            }

            Repeater {
              model: blockDelegate.refLinks
              delegate: Item {
                id: refChip
                required property var modelData
                required property int index
                readonly property string refText: String(modelData || "")
                width: refRow.implicitWidth
                height: refRow.implicitHeight

                Row {
                  id: refRow
                  spacing: 0

                  Text {
                    visible: refChip.index > 0
                    text: "; "
                    color: root.muted
                    font.family: root.fontFamily
                    font.pixelSize: Style.font.caption
                    font.italic: true
                  }

                  Text {
                    text: refChip.refText
                    textFormat: Text.PlainText
                    color: refHover.containsMouse ? root.accent : root.muted
                    font.family: root.fontFamily
                    font.pixelSize: Style.font.caption
                    font.italic: true
                  }
                }

                MouseArea {
                  id: refHover
                  anchors.fill: parent
                  hoverEnabled: true
                  acceptedButtons: Qt.LeftButton
                  cursorShape: Qt.PointingHandCursor
                  preventStealing: true
                  z: 4
                  onClicked: root.queueWikiRef(refChip.refText)
                }
              }
            }

            Text {
              text: ")"
              color: root.muted
              font.family: root.fontFamily
              font.pixelSize: Style.font.caption
              font.italic: true
            }
          }

          Flow {
            id: flow
            visible: blockDelegate.isFlow
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            anchors.leftMargin: Style.space(4) + Style.space(14) * blockDelegate.indent
            anchors.rightMargin: Style.space(4)
            anchors.topMargin: blockDelegate.topPad
            spacing: 0

            Repeater {
              model: blockDelegate.parts
              delegate: Item {
                id: run
                required property var modelData
                required property int index
                readonly property int n: Math.floor(Number(modelData.n) || 0)
                readonly property bool showNum: !!modelData.showNum
                readonly property int numGap: showNum ? Style.space(4) : 0
                readonly property int numW: showNum ? Math.ceil(numLabel.implicitWidth) + numGap : 0
                readonly property int bodyW: Math.min(Math.ceil(bodyMetrics.implicitWidth), Math.max(1, flow.width - numW))
                width: numW + bodyW
                height: Math.max(showNum ? numLabel.implicitHeight : 0, runText.implicitHeight)

                Text {
                  id: bodyMetrics
                  visible: false
                  text: String(run.modelData.t || "")
                  textFormat: Text.PlainText
                  font.family: root.fontFamily
                  font.pixelSize: Style.font.bodySmall
                  font.italic: blockDelegate.kind === "d"
                  wrapMode: Text.NoWrap
                }

                Text {
                  id: numLabel
                  visible: run.showNum
                  text: String(run.n)
                  textFormat: Text.PlainText
                  color: blockDelegate.selected ? root.selectedTextColor : root.muted
                  opacity: blockDelegate.selected ? 1 : 0.4
                  font.family: root.fontFamily
                  font.pixelSize: Math.max(8, Math.round(Style.font.bodySmall * 0.7))
                  font.weight: Font.Normal
                  wrapMode: Text.NoWrap
                  x: 0
                  y: Math.max(0, Math.round((Style.font.bodySmall - font.pixelSize) * 0.35))
                }

                Text {
                  id: runText
                  x: run.numW
                  width: run.bodyW
                  wrapMode: Text.WordWrap
                  text: String(run.modelData.t || "")
                  textFormat: Text.PlainText
                  color: blockDelegate.selected
                    ? root.selectedTextColor
                    : (blockDelegate.hovered || run.modelData.wj ? root.accent : root.foreground)
                  font.family: root.fontFamily
                  font.pixelSize: Style.font.bodySmall
                  font.italic: blockDelegate.kind === "d"
                }

                MouseArea {
                  anchors.fill: parent
                  hoverEnabled: true
                  cursorShape: Qt.IBeamCursor
                  onEntered: {
                    if (!root.searchActive) root.focusVerse = run.n
                  }
                  onClicked: function(mouse) {
                    root.requestVerseFocus()
                    if (mouse.modifiers & Qt.ShiftModifier) root.selectRange(root.anchorVerse, run.n)
                    else root.selectVerse(run.n)
                  }
                }
              }
            }
          }
        }

        MouseArea {
          anchors.fill: parent
          acceptedButtons: Qt.LeftButton
          hoverEnabled: true
          preventStealing: true
          enabled: !root.usePublication
          cursorShape: Qt.IBeamCursor
          property bool wikiPress: false
          onPressed: function(mouse) {
            var idx = root.verseIndexAt(mouse.y)
            var row = root.readerRows[idx]
            if (row && String(row.kind || "") === "refs") {
              wikiPress = true
              mouse.accepted = true
              return
            }
            wikiPress = false
            root.requestVerseFocus()
            var verse = root.verseAtRow(idx)
            if (!verse) return
            root.dragging = true
            if (mouse.modifiers & Qt.ShiftModifier) root.selectRange(root.anchorVerse, verse)
            else {
              root.anchorVerse = verse
              root.selectVerse(verse)
            }
          }
          onClicked: function(mouse) {
            if (!wikiPress) return
            wikiPress = false
            var idx = root.verseIndexAt(mouse.y)
            var row = root.readerRows[idx]
            if (!(row && String(row.kind || "") === "refs")) return
            var item = verseList.itemAtIndex(idx)
            if (!item || !item.refAt) return
            var local = item.mapFromItem(verseList, mouse.x, mouse.y)
            root.queueWikiRef(item.refAt(local.x, local.y))
          }
          onPositionChanged: function(mouse) {
            var verse = root.verseAtRow(root.verseIndexAt(mouse.y))
            if (!verse) {
              if (root.dragging) {
                if (mouse.y < 24) verseList.flick(0, 420)
                else if (mouse.y > height - 24) verseList.flick(0, -420)
              }
              return
            }
            if (root.dragging) {
              root.selectRange(root.anchorVerse, verse)
              if (mouse.y < 24) verseList.flick(0, 420)
              else if (mouse.y > height - 24) verseList.flick(0, -420)
            } else {
              if (root.ignoreNav) return
              if (!pointerGate.moved(verseList, mouse)) return
              root.hoverLocked = false
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

        Button {
          id: booksBtn
          visible: root.mode === "chapters"
          width: parent.width
          text: "Books"
          bordered: true
          leftAlign: true
          foreground: root.foreground
          accent: root.accent
          fontFamily: root.fontFamily
          tooltipText: "Choose a different book"
          onClicked: root.openBooks()
        }

        ButtonGroup {
          width: parent.width
          visible: root.mode === "books"
          foreground: root.foreground
          accent: root.accent
          fontFamily: root.fontFamily
          value: root.testament
          focusable: false
          options: [
            { value: "ot", label: "Old Testament" },
            { value: "nt", label: "New Testament" }
          ]
          onChanged: function(value) {
            root.testament = value
            root.clampFocusBook()
            root.scrollBookFocus()
          }
        }

        ListView {
          id: bookList
          width: parent.width
          height: parent.height - Style.space(40)
          clip: true
          visible: root.mode === "books"
          model: root.visibleBooks
          boundsBehavior: Flickable.StopAtBounds
          keyNavigationEnabled: false
          activeFocusOnTab: false
          focus: false
          delegate: Item {
            required property var modelData
            width: ListView.view ? ListView.view.width : 1
            height: Style.space(28)

            readonly property bool selected: modelData === root.book
            readonly property bool hovered: !root.searchActive && modelData === root.focusBook

            Rectangle {
              anchors.fill: parent
              radius: Style.cornerRadius
              color: parent.hovered ? root.hoverFill : "transparent"
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
              anchors.verticalCenter: parent.verticalCenter
              anchors.left: parent.left
              anchors.leftMargin: Style.space(8)
              text: GrabBcv.bookName(modelData)
              textFormat: Text.PlainText
              color: parent.hovered || parent.selected ? root.accent : root.foreground
              font.family: root.fontFamily
              font.pixelSize: Style.font.bodySmall
              font.bold: parent.hovered || parent.selected
            }

            MouseArea {
              anchors.fill: parent
              hoverEnabled: true
              cursorShape: Qt.PointingHandCursor
              onClicked: root.pickBook(modelData)
              onEntered: root.focusBook = modelData
            }
          }
        }

        GridView {
          id: chapterGrid
          width: parent.width
          visible: root.mode === "chapters"
          height: parent.height - Style.space(40)
          cellWidth: Style.space(40)
          cellHeight: Style.space(32)
          clip: true
          keyNavigationEnabled: false
          activeFocusOnTab: false
          focus: false
          model: GrabBcv.chapterCount(root.book)
          delegate: Item {
            required property int index
            width: Style.space(36)
            height: Style.space(28)

            readonly property int chapterNumber: index + 1
            readonly property bool selected: chapterNumber === root.chapter
            readonly property bool hovered: !root.searchActive && chapterNumber === root.focusChapter

            Rectangle {
              anchors.fill: parent
              radius: Style.cornerRadius
              color: parent.selected
                ? root.selectionFill
                : (parent.hovered ? root.hoverFill : "transparent")
            }

            Text {
              anchors.centerIn: parent
              text: parent.chapterNumber
              textFormat: Text.PlainText
              color: parent.hovered || parent.selected ? root.accent : root.foreground
              font.family: root.fontFamily
              font.pixelSize: Style.font.bodySmall
              font.bold: parent.hovered
            }

            MouseArea {
              anchors.fill: parent
              hoverEnabled: true
              cursorShape: Qt.PointingHandCursor
              onClicked: root.pickChapter(parent.chapterNumber)
              onEntered: root.focusChapter = parent.chapterNumber
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
      height: Math.max(Style.space(28), titleHit.height)

      IconButton {
        id: prevBtn
        anchors.left: parent.left
        anchors.verticalCenter: parent.verticalCenter
        iconText: "󰒮"
        foreground: root.foreground
        tooltipText: "Previous chapter"
        onClicked: root.stepChapter(-1)
      }

      IconButton {
        id: nextBtn
        anchors.right: parent.right
        anchors.verticalCenter: parent.verticalCenter
        iconText: "󰒭"
        foreground: root.foreground
        tooltipText: "Next chapter"
        onClicked: root.stepChapter(1)
      }

      Item {
        id: titleHit
        anchors.left: prevBtn.right
        anchors.right: nextBtn.left
        anchors.leftMargin: Style.space(6)
        anchors.rightMargin: Style.space(6)
        anchors.verticalCenter: parent.verticalCenter
        height: titleCol.implicitHeight

        Column {
          id: titleCol
          width: parent.width
          spacing: Style.space(2)

          Text {
            width: parent.width
            text: root.displayLabel
            textFormat: Text.PlainText
            color: titleHover.containsMouse || root.mode === "chapters" ? root.accent : root.foreground
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

        MouseArea {
          id: titleHover
          anchors.fill: parent
          hoverEnabled: true
          cursorShape: Qt.PointingHandCursor
          onClicked: {
            if (root.mode === "chapters") root.mode = "read"
            else root.openChapters()
          }
        }
      }
    }
  }

  Shortcut {
    enabled: root.keysLive && root.searchActive
    sequence: "Down"
    onActivated: root.handleSearchArrow(1)
  }
  Shortcut {
    enabled: root.keysLive && root.searchActive
    sequence: "Up"
    onActivated: root.handleSearchArrow(-1)
  }
}
