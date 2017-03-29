const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect
const auth = require(BASE_DIR + 'proxy/auth')
const course = require(BASE_DIR + 'proxy/course')

chai.use(chaiAsPromised)
chai.should()

module.exports = (username, password, year, semester, courseId, courseClass) => {
  // get testing token
  let testToken = ''
  const getToken = auth(username, password)
      .then((r) => {
        testToken = r.token
      })
  expect(getToken).to.eventually.be.fulfilled.then(() => {
    describe('Course Proxy Test', function() {
      this.timeout(10 * 1000)
      describe('get materials', function() {
        it('is successful', (done) => {
          course.materials(testToken, year, semester, courseId, courseClass)
            .then((result) => {
              expect(result).to.be.an('array')
              done()
            }, (err) => {
              done(err)
            })
        })
      })

      describe('get announcements', function() {
        it('is successful', (done) => {
          course.announcements(testToken, year, semester, courseId, courseClass)
            .then((result) => {
              expect(result).to.be.an('array')
              done()
            }, (err) => {
              done(err)
            })
        })
      })
    })
  })
}
