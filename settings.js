const settings = require('electron-settings')

settings.defaults({
  busyColor: '#FF0000',
  availableColor: '#FF8800',
  finishColor: '#00FF00',
  defaultTime: '25:00',
  lightness: 1
})

module.exports = settings
