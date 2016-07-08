const {app, Menu, Tray} = require('electron')
var HID = require('node-hid');

// const Luxafor = require('luxafor-api')
//
// const device = new Luxafor({
//   defaults: {
//     wave: {
//       type: 2,
//       speed: 100,
//       repeat: 5
//     }
//   }
// })

let tray = null

function clickAvailable () {
  tray.setTitle('available')
  console.log('devices:', HID.devices());
  // device.setColor('#FFF')
}

function clickBusy () {
  tray.setTitle('busy')
  // device.setColor('#FC0')
}
app.on('ready', () => {
  tray = new Tray('tomato.png')
  const contextMenu = Menu.buildFromTemplate([
    {label: 'Available', type: 'radio', checked: true, click: clickAvailable},
    {label: 'Busy', type: 'radio', click: clickBusy},
    {label: 'Unknown', type: 'radio', click() { tray.setTitle('') }}
  ])
  tray.setToolTip('This is my application.')
  tray.setContextMenu(contextMenu)
})
