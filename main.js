const {app, Menu, Tray} = require('electron')
const HID = require('node-hid');
const AVAILABLE_ICON = 'assets/available.png'
const BUSY_ICON = 'assets/busy.png'

const Luxafor = require('luxafor-api')

let tray = null
let device = null

function clickAvailable () {
  tray.setImage(AVAILABLE_ICON)
  device.setColor('#00ff00')
}

function clickBusy () {
  tray.setImage(BUSY_ICON)
  device.setColor('#FF0000')
}
function clickInitial () {
  tray.setTitle('')
  device.setColor('#0000ff')
}
app.on('ready', () => {
  tray = new Tray(AVAILABLE_ICON)
  device = new Luxafor()
  clickInitial()
  const contextMenu = Menu.buildFromTemplate([
    {label: 'Available', type: 'radio', checked: true, click: clickAvailable},
    {label: 'Busy', type: 'radio', click: clickBusy}
  ])
  tray.setToolTip('This is my application.')
  tray.setContextMenu(contextMenu)
})

app.on('quit', () => {
  device.off()
})
