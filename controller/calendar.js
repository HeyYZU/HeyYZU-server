const mock = require('./mock.json').calendar
const calendarList = (req, res, next) => {
  res.status(mock.list.status).json({ message: mock.list.message })
}

const getEvent = (req, res, next) => {
  res.status(mock.event.get.status).json({ message: mock.event.get.message })
}

const putEvent = (req, res, next) => {
  res.status(mock.event.putEvent.status).json({ message: mock.event.putEvent.message })
}

const delEvent = (req, res, next) => {
  res.status(mock.event.delEvent.status).json({ message: mock.event.delEvent.message })
}

module.exports = {
  list: calendarList,
  getEvent: getEvent,
  putEvent: putEvent,
  delEvent: delEvent
}
