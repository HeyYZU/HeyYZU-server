const authTesting = require('./auth')
const userTesting = require('./user')

module.exports = (username, password, year, semester, courseId, courseClass) => {
  describe('Proxy Test', function() {
    authTesting(username, password)
    userTesting(username, password, year, semester)
  })
}
