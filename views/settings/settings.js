const ipc = require('electron').ipcRenderer
const colorPicker = document.getElementById('color-picker')

colorPicker.addEventListener('click', () => {
  ipc.send('colorPicker.click', 'someData')
})
