import QtQuick
import QtTest
import "../.."
import "../../js/Bible.js" as Bible

// Headless Qt Quick checks for the reader popup: selection highlight and
// click-drag verse ranges. Run with scripts/qml-test.sh.
Item {
  id: top
  width: 470
  height: 620

  property string shotDir: ""

  Rectangle { anchors.fill: parent; color: "#ffffff" }

  Item {
    id: keyCatcher
    focus: true
  }

  Reader {
    id: reader
    anchors.fill: parent
    anchors.margins: 10
    onRequestVerseFocus: keyCatcher.forceActiveFocus()
  }

  TestCase {
    id: tc
    name: "Reader"
    when: windowShown
    property var list: null
    property var search: null

    function initTestCase() {
      tryVerify(function() { return reader.bible !== null && reader.stateReady }, 5000)
      list = findChild(reader, "verseList")
      search = findChild(reader, "searchField")
      verify(list !== null, "verseList")
      verify(search !== null, "searchField")
      top.shotDir = String(Qt.resolvedUrl("../../.qml-shots")).replace("file://", "")
    }

    function init() {
      if (reader.publication) reader.togglePublication()
      reader.applyPlace("PHP", 4, 0, 0, false)
      wait(30)
    }

    function shot(name) {
      if (!top.shotDir) return
      var img = grabImage(top)
      img.save(top.shotDir + "/" + name + ".png")
    }

    function rowItem(n) {
      var rows = reader.usePublication ? reader.pubRows : reader.readerRows
      var idx = Bible.pubRowIndexForVerse(rows, n)
      verify(idx >= 0, "row for verse " + n)
      list.positionViewAtIndex(idx, ListView.Contain)
      wait(20)
      var item = list.itemAtIndex(idx)
      verify(item !== null, "delegate for verse " + n)
      return item
    }

    // Point (in `top` coordinates) at the middle of verse n, publication runs included.
    function versePoint(n) {
      var item = rowItem(n)
      var lx = item.width / 2
      var ly = item.height / 2
      if (reader.usePublication) {
        var flow = null
        for (var i = 0; i < item.children.length; i++)
          if (item.children[i].visible && String(item.children[i]).indexOf("QQuickFlow") === 0) flow = item.children[i]
        verify(flow !== null, "flow row")
        for (var j = 0; j < flow.children.length; j++) {
          var run = flow.children[j]
          if (typeof run.n === "number" && run.n === n) {
            var p = run.mapToItem(top, Math.min(run.width / 2, 20), run.height / 2)
            return p
          }
        }
        fail("run for verse " + n)
      }
      return item.mapToItem(top, lx, ly)
    }

    function selectedRowVerses() {
      var out = []
      for (var i = 0; i < list.count; i++) {
        var item = list.itemAtIndex(i)
        if (item && item.isVerse && item.selected) out.push(item.verseNum)
      }
      return out
    }

    function test_searchedRangeStaysHighlightedWhileSearchFocused() {
      reader.focusSearch()
      search.text = ""
      search.text = "Philippians 4:11-13"
      wait(50)
      verify(reader.searchActive, "search field still has focus")
      compare(reader.startVerse, 11)
      compare(reader.endVerse, 13)
      tryVerify(function() { return list.contentY > 0 }, 1000, "scrolled to the selection")
      for (var n = 11; n <= 13; n++) {
        var item = list.itemAtIndex(Bible.pubRowIndexForVerse(reader.readerRows, n))
        verify(item !== null && item.selected, "verse " + n + " highlighted while searching")
        var top11 = item.mapToItem(list, 0, 0).y
        verify(top11 >= -1 && top11 + item.height <= list.height + 1, "verse " + n + " in view")
      }
      verify(!list.itemAtIndex(Bible.pubRowIndexForVerse(reader.readerRows, 10)).selected, "verse 10 not highlighted")
      shot("search-highlight")
    }

    function test_dragSelectsRangeWhenScrolled() {
      reader.applyPlace("PHP", 4, 11, 13, false)
      wait(50)
      list.positionViewAtIndex(Bible.pubRowIndexForVerse(reader.readerRows, 13), ListView.Contain)
      wait(20)
      verify(list.contentY > 0, "chapter is scrolled, like the bug report")
      var a = versePoint(6)
      var b = versePoint(9)
      verify(a.y > 0 && b.y < top.height, "both verses on screen")
      mousePress(top, a.x, a.y)
      for (var i = 1; i <= 8; i++) mouseMove(top, a.x, a.y + (b.y - a.y) * i / 8)
      mouseRelease(top, b.x, b.y)
      compare(reader.startVerse, 6)
      compare(reader.endVerse, 9)
      verify(/^Philippians 4:6.9$/.test(reader.displayLabel), "footer label " + reader.displayLabel)
      compare(search.text, "Philippians 4:6-9")
      compare(reader.dragging, false)
      compare(JSON.stringify(selectedRowVerses().filter(function(n) { return n >= 5 && n <= 13 })), JSON.stringify([6, 7, 8, 9]))
      shot("drag-range")
    }

    function test_dragUpwardOrdersRange() {
      var a = versePoint(9)
      var b = versePoint(6)
      mousePress(top, a.x, a.y)
      for (var i = 1; i <= 6; i++) mouseMove(top, a.x, a.y + (b.y - a.y) * i / 6)
      mouseRelease(top, b.x, b.y)
      compare(reader.startVerse, 6)
      compare(reader.endVerse, 9)
    }

    function test_singleClickSelectsOneVerse() {
      reader.applyPlace("PHP", 4, 11, 13, false)
      wait(30)
      var p = versePoint(7)
      mouseClick(top, p.x, p.y)
      compare(reader.startVerse, 7)
      compare(reader.endVerse, 7)
      compare(search.text, "Philippians 4:7")
    }

    function test_shiftClickExtends() {
      var p = versePoint(4)
      mouseClick(top, p.x, p.y)
      var q = versePoint(8)
      mouseClick(top, q.x, q.y, Qt.LeftButton, Qt.ShiftModifier)
      compare(reader.startVerse, 4)
      compare(reader.endVerse, 8)
    }

    function test_dragAutoScrollsPastBottomEdge() {
      reader.applyPlace("PHP", 4, 1, 1, false)
      wait(30)
      list.positionViewAtBeginning()
      wait(20)
      var a = versePoint(2)
      list.positionViewAtBeginning()
      wait(20)
      var listTop = list.mapToItem(top, 0, 0)
      var bottomY = listTop.y + list.height - 4
      mousePress(top, a.x, a.y)
      mouseMove(top, a.x, a.y + 10)
      mouseMove(top, a.x, bottomY)
      tryVerify(function() { return reader.endVerse >= 15 }, 4000, "range grows while holding at the bottom edge")
      mouseRelease(top, a.x, bottomY)
      compare(reader.startVerse, 2)
      verify(list.contentY > 0)
    }

    function test_selectionStaysInViewWhenReaderResizes() {
      reader.applyPlace("PHP", 4, 11, 13, false)
      wait(50)
      reader.anchors.margins = 0
      reader.anchors.fill = undefined
      reader.width = top.width
      reader.height = 300
      wait(60)
      for (var n = 11; n <= 13; n++) {
        var item = list.itemAtIndex(Bible.pubRowIndexForVerse(reader.readerRows, n))
        verify(item !== null, "delegate " + n)
        var y = item.mapToItem(list, 0, 0).y
        verify(y >= -1 && y + item.height <= list.height + 1, "verse " + n + " still in view after resize (y=" + y + ")")
      }
      reader.anchors.fill = top
      reader.anchors.margins = 10
      wait(30)
    }

    function test_publicationDragAcrossRuns() {
      reader.togglePublication()
      tryVerify(function() { return reader.usePublication }, 5000, "publication data loaded")
      reader.applyPlace("PHP", 4, 0, 0, false)
      wait(50)
      var a = versePoint(6)
      var b = versePoint(8)
      mousePress(top, a.x, a.y)
      for (var i = 1; i <= 6; i++) mouseMove(top, a.x + (b.x - a.x) * i / 6, a.y + (b.y - a.y) * i / 6)
      mouseRelease(top, b.x, b.y)
      compare(reader.startVerse, 6)
      compare(reader.endVerse, 8)
      shot("publication-drag")
      reader.togglePublication()
    }
  }
}
