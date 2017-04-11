const auth = require(BASE_DIR + 'proxy/auth')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)
chai.should()

const activityTesting = require('./activity')
const calendarTesting = require('./calendar')
const courseTesting = require('./course')
const infoTesting = require('./info')
const libraryTesting = require('./library')
const userTesting = require('./user')

module.exports = (username, password) => {
  describe('API Response Test', function() {
    activityTesting(auth(username, password))
    calendarTesting(auth(username, password))
    userTesting(auth(username, password))
    courseTesting(auth(username, password))
    infoTesting()
    libraryTesting(auth(username, password))
  })
}
