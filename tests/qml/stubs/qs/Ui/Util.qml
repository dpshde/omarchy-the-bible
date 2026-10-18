pragma Singleton
import QtQuick
QtObject { property var launched: []; function execArgv(argv) { launched = launched.concat([argv]) } }
