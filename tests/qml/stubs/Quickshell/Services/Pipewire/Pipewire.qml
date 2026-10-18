pragma Singleton
import QtQuick
QtObject { property var defaultAudioSource: null; property var defaultAudioSink: null; property var nodes: ({ values: [] }); property bool ready: false }
