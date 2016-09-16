const {app, Menu, Tray, BrowserWindow} = require('electron')
const path = require('path')

const convertToSeconds = require('./time').convertToSeconds

const device = require('./devices/luxafor')
const Timer = require('time-counter')

const settings = require('./settings')
const Color = require('./color')

const AVAILABLE_ICON = path.join(__dirname, 'assets/available.png')
const NEUTRAL_ICON = path.join(__dirname, 'assets/neutral.png')
const BUSY_ICON = path.join(__dirname, 'assets/busy.png')
const SETTINGS_VIEW = path.join('file://', __dirname, 'views/settings.html')
const MODES = {
  AVAILABLE: 'Available',
  BUSY: 'Busy',
  NEUTRAL: 'Neutral',
  POMODORO_START: 'Start Pomodoro',
  POMODORO_END: 'Stop Pomodoro'
}

const COLOR_BUSY = new Color(settings.getSync('busyColor'))
const COLOR_AVAILABLE = new Color(settings.getSync('availableColor'))
const COLOR_FINISH = new Color(settings.getSync('finishColor'))
const COLOR_NEUTRAL = new Color(settings.getSync('neutralColor'))

let willQuitApp = false
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
    {label: 'Settings', click: openSettings},
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
  startValue: settings.getSync('defaultTime'),
  interval: 1000
})

countDownTimer.on('change', (remainingTime) => {
  tray.setTitle(remainingTime)
  setTransitionLED(remainingTime)
  if (remainingTime === '0:00') {
    clickAvailable()
  }
})

function setTransitionLED (remainingTime) {
  var ratio = convertToSeconds(remainingTime) / convertToSeconds(settings.getSync('defaultTime'))
  var newColor = COLOR_BUSY.transitionTo(COLOR_FINISH, ratio)
  if (ratio > 0.5) return device.setColor(newColor)
  else if (ratio > 0.25) {
    device.setColor('#000000', 0x01)
    device.setColor(newColor, 0x02)
    device.setColor(newColor, 0x03)
    device.setColor('#000000', 0x04)
    device.setColor(newColor, 0x05)
    device.setColor(newColor, 0x06)
  } else {
    device.setColor('#000000', 0x01)
    device.setColor('#000000', 0x02)
    device.setColor(newColor, 0x03)
    device.setColor('#000000', 0x04)
    device.setColor('#000000', 0x05)
    device.setColor(newColor, 0x06)
  }
}

function clickAvailable () {
  resetPomodoroMode()
  device.setColor(COLOR_AVAILABLE.value)
  tray.setImage(AVAILABLE_ICON)
  setTrayMenu(MODES.AVAILABLE)
}

function clickBusy () {
  resetPomodoroMode()
  device.setColor(COLOR_BUSY.value)
  tray.setImage(BUSY_ICON)
  setTrayMenu(MODES.BUSY)
}

function clickNeutral () {
  resetPomodoroMode()
  tray.setImage(NEUTRAL_ICON)
  device.setColor(COLOR_NEUTRAL.value)
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

function openSettings () {
  let windowSettings = new BrowserWindow({
    width: 200,
    height: 200,
    frame: true,
    minimizable: false,
    maximizable: false,
    resizable: false,
    backgroundColor: '#333',
    title: 'Tomaquet',
    modal: true
  })
  windowSettings.loadURL(SETTINGS_VIEW)
  windowSettings.show()
  windowSettings.on('close', (e) => {
    if (willQuitApp) {
      windowSettings = null
    } else {
      /* the user only tried to close the windowSettings */
      e.preventDefault()
      windowSettings.hide()
    }
  })
}

app.on('before-quit', () => willQuitApp = true)

app.on('ready', () => {
  tray = new Tray(AVAILABLE_ICON)
  device.initialAnimation()
  clickNeutral()
  setTrayMenu()
})

app.on('quit', (e) => {
  device.off()
})
