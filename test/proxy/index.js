const authTesting = require('./auth')

module.exports = (username, password, year, semester, courseId, courseClass) => {
  describe('Proxy Test', function() {
    authTesting(username, password)
  })
}
