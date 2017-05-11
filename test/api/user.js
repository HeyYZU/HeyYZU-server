const request = require('request-promise')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect

chai.use(chaiAsPromised)
chai.should()

const sendRequest = (options) => {
  options.resolveWithFullResponse = true
  options.json = true
  return request(options)
}

module.exports = (auth) => {
  describe('User', function() {
    describe('Get curriculum list', function() {
       // get testing token
      let token = ''
      before(function(done) {
        auth.then((r) => {
          token = r.token
          done()
        })
      })
      this.timeout(20 * 1000)
      it('with valid token', function(done) {
        sendRequest({
          uri: 'http://0.0.0.0:8080/user/curriculum/',
          qs: {
            access_token: token
          }
        })
          .then((res) => {
            expect(res.statusCode).to.equal(200)
            expect(res.body).to.be.an('array')
            if (res.body.length > 0) {
              let lesson = res.body[0]
              expect(lesson).to.include.keys('lesson_id')
              expect(lesson).to.include.keys('name')
              expect(lesson).to.include.keys('timeSlots')
              expect(lesson.timeSlots).to.be.an('array')
              if (lesson.timeSlots.length > 0) {
                let timeSlot = lesson.timeSlots[0]
                expect(timeSlot).to.include.keys('day')
                expect(timeSlot).to.include.keys('slot')
                expect(timeSlot).to.include.keys('room')
              }
            }
            done()
          })
          .catch(done)
      })

      it('with invalid token', function(done) {
        sendRequest({
          uri: 'http://0.0.0.0:8080/user/curriculum/',
          qs: {
            access_token: 'invalid token'
          }
        })
          .then((res) => {
            done(new Error('Not throw error when token is invalid'))
          })
          .catch((err) => {
            expect(err.statusCode).to.equal(400)
            expect(err.error.message).to.equal('Token invalid')
            done()
          })
          .catch(done)
      })
    })
  })
}
