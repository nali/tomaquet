const {app, Menu, Tray} = require('electron')
const Luxafor = require('luxafor-api')
const Timer = require('time-counter')

let tray = null
let device = null

const countDownTimer = new Timer({
  direction: 'down',
  startValue: '1:00'
})

countDownTimer.on('change', (remainingTime) => {
  tray.setTitle(remainingTime)
})

function clickAvailable () {
  device.setColor('#00ff00')
  countDownTimer.start()
}

function clickBusy () {
  countDownTimer.stop()
  tray.setTitle('busy')
  device.setColor('#FF0000')
}
function clickInitial () {
  tray.setTitle('')
  device.setColor('#0000ff')
}
app.on('ready', () => {
  tray = new Tray('tomato.png')
  device = new Luxafor()
  clickInitial()
  const contextMenu = Menu.buildFromTemplate([
    {label: 'Initial', type: 'radio', checked: true, click: clickInitial},
    {label: 'Available', type: 'radio', click: clickAvailable},
    {label: 'Busy', type: 'radio', click: clickBusy}
  ])
  tray.setToolTip('This is my application.')
  tray.setContextMenu(contextMenu)
})
