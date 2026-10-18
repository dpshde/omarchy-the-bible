import QtQuick
TextInput {
  property string placeholderText: ""
  property color foreground: "black"
  property color accent: "blue"
  property color placeholderTextColor: "gray"
  topPadding: 6
  bottomPadding: 6
  color: foreground
  verticalAlignment: TextInput.AlignVCenter
  leftPadding: 6
  Rectangle { anchors.fill: parent; z: -1; color: "#f6f8fa"; border.color: parent.activeFocus ? parent.accent : "#d0d7de"; radius: 3 }
}
