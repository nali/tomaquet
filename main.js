const {app, Menu, Tray} = require('electron')
const path = require('path')
const AVAILABLE_ICON = path.join(__dirname, 'assets/available.png')
const BUSY_ICON = path.join(__dirname, 'assets/busy.png')

const Luxafor = require('luxafor-api')
const Timer = require('time-counter')

app.dock.hide()

const INITIAL_ANIMATION_SPEED = 100
let tray = null
let device = null

const countDownTimer = new Timer({
  direction: 'down',
  startValue: '25:00',
  interval: 1000
})

countDownTimer.on('change', (remainingTime) => {
  tray.setTitle(remainingTime)

  if (remainingTime === '0:00') {
    clickAvailable()
  }
})

function clickAvailable () {
  tray.setImage(AVAILABLE_ICON)
  device.setColor('#00ff00')
}

function clickBusy () {
  tray.setImage(BUSY_ICON)
  device.setColor('#FF0000')
}

function clickStartPomodoro () {
  clickBusy()
  countDownTimer.start()
}

function clickStopPomodoro () {
  clickAvailable()
  countDownTimer.stop()
  tray.setTitle('')
}

function doInitialAnimation () {
  const colors = ['#0000ff', '#00ff00', '#ff0000', '#0000ff', '#00ff00', '#ff0000']
  colors.forEach((color, index) => {
    console.log('INDEX', index)
    setTimeout(() => {
      device.wave(color, 1, 1, 1)
    }, index * INITIAL_ANIMATION_SPEED)
  })
}

app.on('ready', () => {
  tray = new Tray(AVAILABLE_ICON)
  device = new Luxafor()
  doInitialAnimation()
  clickAvailable()
  const contextMenu = Menu.buildFromTemplate([
    {label: 'Available', type: 'radio', checked: true, click: clickAvailable},
    {label: 'Busy', type: 'radio', click: clickBusy},
    {label: 'Start Pomodoro', type: 'radio', click: clickStartPomodoro},
    {label: 'Stop Pomodoro', type: 'radio', click: clickStopPomodoro},
    {type: 'separator'},
    {label: 'Settings'},
    {type: 'separator'},
    {label: 'Close', role: 'quit'}
  ])
  tray.setToolTip('No em toquis els tomaquets!')
  tray.setContextMenu(contextMenu)
})

app.on('quit', () => {
  device.off()
})
