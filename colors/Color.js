class Color {
  constructor (value) {
    this.value = value
  }
  transitionTo (color, ratio) {
    var a = removeHash(this.value)
    var b = removeHash(color.value)
    return transitionColor(a, b, stepRatio(ratio))
  }
}

function transitionColor (color1, color2, ratio) {
  var r = Math.ceil(parseInt(color1.substring(0,2), 16) * ratio + parseInt(color2.substring(0,2), 16) * (1-ratio))
  var g = Math.ceil(parseInt(color1.substring(2,4), 16) * ratio + parseInt(color2.substring(2,4), 16) * (1-ratio))
  var b = Math.ceil(parseInt(color1.substring(4,6), 16) * ratio + parseInt(color2.substring(4,6), 16) * (1-ratio))

  return hex(r) + hex(g) + hex(b)
}

function hex (x) {
  x = x.toString(16);
  return (x.length == 1) ? '0' + x : x;
}

function removeHash (colorWithHash) {
  return colorWithHash.split('').splice(1).join('')
}

function stepRatio (ratio) {
  if (ratio > 0.2) return 1
  if (ratio > 0.1) return ratio + 0.5
  return ratio
}

module.exports = Color
