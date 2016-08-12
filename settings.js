const settings = require('electron-settings')

settings.defaults({
  busyColor: '#FF0000',
  availableColor: '#00ff00',
  defaultTime: '25:00',
  lightness: 1
})

module.exports = settings
