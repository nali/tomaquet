const Luxafor = require('luxafor-api')

const INITIAL_ANIMATION_SPEED = 100

let dongle = null

function isDonglePresent () {
  return dongle && !(dongle.device instanceof Error)
}

function getDongle () {
  if (isDonglePresent()) {
    return dongle
  }

  dongle = new Luxafor()

  return dongle
}

function setColor (color) {
  const result = getDongle().setColor(color)

  if (result instanceof Error) {
    dongle = null
    getDongle().setColor(color)
  }

  return result
}

function off () {
  if (isDonglePresent()) {
    return getDongle().off()
  }
}

function initialAnimation () {
  const colors = ['#0000ff', '#00ff00', '#ff0000', '#0000ff', '#00ff00', '#ff0000']
  getDongle().off()
  colors.forEach((color, index) => {
    setTimeout(() => {
      const result = getDongle().wave(color, 1, 1, 1)

      if (result instanceof Error) {
        dongle = null
      }
    }, index * INITIAL_ANIMATION_SPEED)
  })
}

exports.initialAnimation = initialAnimation
exports.setColor = setColor
exports.off = off
