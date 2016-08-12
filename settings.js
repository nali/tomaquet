const settings = require('electron-settings')

settings.defaults({
  busyColor: '#FF0000',
  availableColor: '#00FF00',
  finishColor: '#FF8800',
  neutralColor: '#000000',
  defaultTime: '25:00',
  lightness: 1
})

module.exports = settings
