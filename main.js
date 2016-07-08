const {app, Menu, Tray} = require('electron')
var HID = require('node-hid');

const Luxafor = require('luxafor-api')

let tray = null
let device = null
function clickAvailable () {
  tray.setTitle('available')
  device.setColor('#00ff00')
}

function clickBusy () {
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

app.on('quit', () => {
  device.off()
})
