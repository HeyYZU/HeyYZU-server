'use strict'

const mock = require('./mock.json').activity
const activityList = (req, res, next) => {
  res.status(mock.list.status).json({ message: mock.list.message })
}

module.exports = {
  list: activityList
}
