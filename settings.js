const settings = require('electron-settings')
const Color = require('./color')

settings.defaults({
  busyColor: new Color('#FF0000'),
  availableColor: new Color('#FF8800'),
  finishColor: new Color('#00FF00'),
  neutralColor: new Color('#000000'),
  defaultTime: '25:00',
  lightness: 1
})

module.exports = settings
