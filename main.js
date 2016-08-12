const {app, Menu, Tray} = require('electron')
const path = require('path')
const AVAILABLE_ICON = path.join(__dirname, 'assets/available.png')
const BUSY_ICON = path.join(__dirname, 'assets/busy.png')
const NEUTRAL_ICON = path.join(__dirname, 'assets/neutral.png')

const Luxafor = require('luxafor-api')
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

function clickNeutral () {
  resetPomodoroMode()
  tray.setImage(NEUTRAL_ICON)
  device.setColor('#000000')
  setTrayMenu(MODES.NEUTRAL)
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

app.on('ready', () => {
  tray = new Tray(AVAILABLE_ICON)
  device = new Luxafor()
  doInitialAnimation()
  clickAvailable()
  tray.setToolTip('No em toquis els tomaquets!')
  setTrayMenu()
})

app.on('quit', () => {
  device.off()
})
