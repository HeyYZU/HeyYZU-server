const mock = require('./mock.json').info
const systemInfo = (req, res, next) => {
  res.status(200).json(mock.sysInfo)
}

const androidInfo = (req, res, next) => {
  res.status(mock.android.status).json({ message: mock.android.message })
}

const iosInfo = (req, res, next) => {
  res.status(mock.ios.status).json({ message: mock.ios.message })
}

module.exports = {
  sysInfo: systemInfo,
  androidInfo: androidInfo,
  iosInfo: iosInfo
}
