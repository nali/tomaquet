const {app, Menu, Tray} = require('electron')
const path = require('path')

const Luxafor = require('luxafor-api')
const Timer = require('time-counter')

const settings = require('./settings')

const AVAILABLE_ICON = path.join(__dirname, 'assets/available.png')
const BUSY_ICON = path.join(__dirname, 'assets/busy.png')

const MODES = {
  AVAILABLE: 'Available',
  BUSY: 'Busy',
  POMODORO_START: 'Start Pomodoro',
  POMODORO_END: 'Stop Pomodoro'
}

app.dock.hide()

const setTrayMenu = (mode) => {
  const pomodoroLineItem = mode === MODES.POMODORO_START
    ? {label: MODES.POMODORO_END, type: 'checkbox', click: clickStopPomodoro}
    : {label: MODES.POMODORO_START, type: 'checkbox', click: clickStartPomodoro}

  const contextMenu = Menu.buildFromTemplate([
    {label: MODES.AVAILABLE, type: 'checkbox', checked: MODES.AVAILABLE === mode, click: clickAvailable},
    {label: MODES.BUSY, type: 'checkbox', checked: MODES.BUSY === mode, click: clickBusy},
    pomodoroLineItem,
    {type: 'separator'},
    {label: 'Settings'},
    {type: 'separator'},
    {label: 'Close', role: 'quit'}
  ])

  tray.setContextMenu(contextMenu)
}

const resetPomodoroMode = () => {
  countDownTimer.stop()
  tray.setTitle('')
  setTrayMenu(false)
}

const INITIAL_ANIMATION_SPEED = 100
let tray = null
let device = null

const countDownTimer = new Timer({
  direction: 'down',
  startValue: settings.get('defaultTime'),
  interval: 1000
})

countDownTimer.on('change', (remainingTime) => {
  tray.setTitle(remainingTime)

  if (remainingTime === '0:00') {
    clickAvailable()
  }
})

function clickAvailable () {
  resetPomodoroMode()
  device.setColor(settings.get('availableColor'))
  setTrayMenu(MODES.AVAILABLE)
}

function clickBusy () {
  resetPomodoroMode()
  device.setColor(settings.get('busyColor'))
  setTrayMenu(MODES.BUSY)
}

function clickStartPomodoro () {
  resetPomodoroMode()
  clickBusy()
  setTrayMenu(MODES.POMODORO_START)
  countDownTimer.start()
}

function clickStopPomodoro () {
  clickAvailable()
  tray.setTitle('')
  setTrayMenu(MODES.POMODORO_END)
  countDownTimer.stop()
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

function openSettings () {
  console.log('opened settings modal')
}

app.on('ready', () => {
  tray = new Tray(AVAILABLE_ICON)
  device = new Luxafor()
  doInitialAnimation()
  clickAvailable()
  setTrayMenu()
})

app.on('quit', () => {
  device.off()
})
