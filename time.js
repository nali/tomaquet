function convertToSeconds (time) {
  var splitTime = time.split(':')
  var minutes = Number(splitTime[0])
  var seconds = Number(splitTime[1])
  return minutes * 60 + seconds
}

module.exports = {
  convertToSeconds: convertToSeconds
}
