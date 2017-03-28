const authTesting = require('./auth')
const userTesting = require('./user')
const courseTesting = require('./course')

module.exports = (username, password, year, semester, courseId, courseClass) => {
  describe('Proxy Test', function() {
    authTesting(username, password)
    userTesting(username, password, year, semester)
    courseTesting(username, password, year, semester, courseId, courseClass)
  })
}
