const {app, Menu, Tray} = require('electron')
const path = require('path')
const AVAILABLE_ICON = path.join(__dirname, 'assets/available.png')
const BUSY_ICON = path.join(__dirname, 'assets/busy.png')
const NEUTRAL_ICON = path.join(__dirname, 'assets/neutral.png')
const Color = require('./color')
const convertToSeconds = require('./time').convertToSeconds

const device = require('./devices/luxafor')
const Timer = require('time-counter')

const MODES = {
  AVAILABLE: 'Available',
  BUSY: 'Busy',
  NEUTRAL: 'Neutral',
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
    {label: MODES.NEUTRAL, type: 'checkbox', checked: MODES.NEUTRAL === mode, click: clickNeutral},
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

const POMODORO_TIME = '25:00'
const countDownTimer = new Timer({
  direction: 'down',
  startValue: POMODORO_TIME,
  interval: 1000
})

var busyColor = new Color('#FF0000')
var finishPomodoro = new Color('#ff8800')
var availableColor = new Color('#00ff00')

countDownTimer.on('change', (remainingTime) => {
  tray.setTitle(remainingTime)
  var ratio = convertToSeconds(remainingTime) / convertToSeconds(POMODORO_TIME)
  var newColor = busyColor.transitionTo(finishPomodoro, ratio)
  device.setColor(newColor)
  if (remainingTime === '0:00') {
    clickAvailable()
  }
})

function clickAvailable () {
  resetPomodoroMode()
  tray.setImage(AVAILABLE_ICON)
  setTrayMenu(MODES.AVAILABLE)
  device.setColor(availableColor.value)
}

function clickBusy () {
  resetPomodoroMode()
  tray.setImage(BUSY_ICON)
  device.setColor('#FF0000')
  setTrayMenu(MODES.BUSY)
}

function clickNeutral () {
  resetPomodoroMode()
  tray.setImage(NEUTRAL_ICON)
  setTrayMenu(MODES.NEUTRAL)
  device.setColor(busyColor.value)
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
