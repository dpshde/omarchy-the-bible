import QtQuick
import QtQuick.Effects
import QtQuick.Window
import qs.Commons
import qs.Ui

Button {
  id: root

  property url iconSource: ""

  width: Style.space(28)
  implicitWidth: Style.space(28)
  implicitHeight: Style.space(28)
  horizontalPadding: 0
  verticalPadding: 0
  bordered: true
  text: ""
  transformOrigin: Item.Center

  function pulse() {
    pulseAnim.restart()
  }

  onClicked: root.pulse()

  SequentialAnimation {
    id: pulseAnim
    NumberAnimation {
      target: root
      property: "scale"
      to: 0.82
      duration: 70
      easing.type: Easing.OutCubic
    }
    NumberAnimation {
      target: root
      property: "scale"
      to: 1
      duration: 180
      easing.type: Easing.OutBack
      easing.overshoot: 2.4
    }
  }

  Image {
    id: glyph
    anchors.centerIn: parent
    width: Style.space(16)
    height: Style.space(16)
    source: root.iconSource
    fillMode: Image.PreserveAspectFit
    visible: false
    asynchronous: true
    sourceSize.width: Math.round(width * Screen.devicePixelRatio)
    sourceSize.height: Math.round(height * Screen.devicePixelRatio)
  }

  MultiEffect {
    anchors.fill: glyph
    source: glyph
    colorization: 1
    colorizationColor: root.foreground
    opacity: glyph.status === Image.Ready ? 1 : 0
  }
}
