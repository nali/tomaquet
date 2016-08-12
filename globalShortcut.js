const {globalShortcut} = require('electron')

const TOGGLE_SHORTCUT = 'CommandOrControl+Shift+Space' // TODO make it configurable in settings
const NEUTRAL_SHORTCUT = 'CommandOrControl+Shift+Esc'

function register ({onToggle, onReset}) {
  if (!globalShortcut.register(TOGGLE_SHORTCUT, onToggle)) {
    console.log('registration failed')
  }
  if (!globalShortcut.register(NEUTRAL_SHORTCUT, onReset)) {
    console.log('registration failed')
  }
}

function unregister () {
  globalShortcut.unregisterAll()
}

module.exports = {
  register,
  unregister
}
