const authTesting = require('./auth')
const userTesting = require('./user')
const courseTesting = require('./course')
const libraryTesting = require('./library')

module.exports = (username, password, year, semester, courseId, courseClass) => {
  authTesting(username, password)
  userTesting(username, password, year, semester)
  courseTesting(username, password, year, semester, courseId, courseClass)
  libraryTesting('多益')
}
