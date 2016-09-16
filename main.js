const {app, Menu, Tray, BrowserWindow, ipcMain} = require('electron')

const MODES = require('./constants/modes')
const ICONS = require('./constants/icons')
const VIEWS = require('./views')

const device = require('./devices/luxafor')

const convertToSeconds = require('./time').convertToSeconds
const Timer = require('time-counter')

const settings = require('./settings')
const colors = require('./colors')

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
  var newColor = colors.busy.transitionTo(colors.finish, ratio)
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
  device.setColor(colors.available.value)
  tray.setImage(ICONS.AVAILABLE)
  setTrayMenu(MODES.AVAILABLE)
}

function clickBusy () {
  resetPomodoroMode()
  device.setColor(colors.busy.value)
  tray.setImage(ICONS.BUSY)
  setTrayMenu(MODES.BUSY)
}

function clickNeutral () {
  resetPomodoroMode()
  tray.setImage(ICONS.NEUTRAL)
  device.setColor(colors.neutral.value)
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
  windowSettings.loadURL(VIEWS.SETTINGS)
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

app.on('before-quit', () => { willQuitApp = true })

app.on('ready', () => {
  tray = new Tray(ICONS.AVAILABLE)
  device.initialAnimation()
  clickNeutral()
  setTrayMenu()
})

app.on('quit', (e) => {
  device.off()
})

ipcMain.on('colorPicker.click', (event, data) => {
  console.log(data)
})
