const {app, Menu, Tray} = require('electron')
const path = require('path')
const AVAILABLE_ICON = path.join(__dirname, 'assets/available.png')
const BUSY_ICON = path.join(__dirname, 'assets/busy.png')

const device = require('./devices/luxafor')
const Timer = require('time-counter')

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

let tray = null

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
  resetPomodoroMode()
  tray.setImage(AVAILABLE_ICON)
  device.setColor('#00ff00')
  setTrayMenu(MODES.AVAILABLE)
}

function clickBusy () {
  resetPomodoroMode()
  tray.setImage(BUSY_ICON)
  device.setColor('#FF0000')
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

app.on('ready', () => {
  tray = new Tray(AVAILABLE_ICON)
  device.initialAnimation()
  clickAvailable()
  tray.setToolTip('No em toquis els tomaquets!')
  setTrayMenu()
})

app.on('quit', () => {
  device.off()
})
