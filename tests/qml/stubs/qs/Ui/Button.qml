import QtQuick
Item {
  id: b
  property string text: ""
  property string iconText: ""
  property color foreground: "black"
  property color accent: "blue"
  property string fontFamily: ""
  property bool selected: false
  property bool bordered: false
  property bool leftAlign: false
  property string tooltipText: ""
  property real horizontalPadding: 8
  property real verticalPadding: 4
  signal clicked()
  implicitWidth: Math.max(28, label.implicitWidth + horizontalPadding * 2)
  implicitHeight: 28
  width: implicitWidth
  height: implicitHeight
  Rectangle { anchors.fill: parent; radius: 3; color: b.selected ? "#e7ebf0" : "transparent"; border.color: b.bordered ? "#d0d7de" : "transparent" }
  Text { id: label; anchors.centerIn: parent; text: b.text || b.iconText; color: b.foreground; font.family: b.fontFamily; font.pixelSize: 12; font.bold: b.selected }
  MouseArea { anchors.fill: parent; onClicked: b.clicked() }
}
