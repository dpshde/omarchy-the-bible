import QtQuick
Item {
  property color foreground; property color accent; property string fontFamily
  property var value; property bool focusable; property var options: []
  signal changed(var value)
  implicitHeight: 28; height: 28
}
