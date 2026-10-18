import QtQuick
// Test stub: loads a local file with XHR (QML_XHR_ALLOW_FILE_READ=1).
QtObject {
  id: fv
  property string path: ""
  property bool printErrors: true
  property bool watchChanges: false
  property bool preload: true
  property string _text: ""
  signal loaded()
  signal loadFailed()
  signal fileChanged()
  function text() { return _text }
  function reload() { _load() }
  function _load() {
    if (!path || !preload) return
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {
      if (xhr.readyState !== XMLHttpRequest.DONE) return
      if (xhr.responseText) { fv._text = xhr.responseText; fv.loaded() }
      else fv.loadFailed()
    }
    xhr.open("GET", "file://" + path)
    xhr.send()
  }
  onPathChanged: Qt.callLater(_load)
  Component.onCompleted: Qt.callLater(_load)
}
