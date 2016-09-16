const settings = require('../settings')
const Color = require('./Color')

module.exports = {
  busy: new Color(settings.getSync('busyColor')),
  available: new Color(settings.getSync('availableColor')),
  finish: new Color(settings.getSync('finishColor')),
  neutral: new Color(settings.getSync('neutralColor'))
}
