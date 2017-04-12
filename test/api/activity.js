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
  describe.skip('Activity', function() {
    // get testing token
    let token = ''
    before(function(done) {
      auth.then((r) => {
        token = r.token
        done()
      })
    })
    it('get list with valid token', (done) => {
      sendRequest({
        uri: 'http://0.0.0.0:8080/activity/list',
        qs: {
          access_token: token
        },
        json: true
      })
        .then((res) => {
          expect(res.statusCode).to.equal(501)
          expect(res.body.message).to.equal('Not implement')
          done()
        })
        .catch(done)
    })
    it('get list with invalid token', (done) => {
      sendRequest({
        uri: 'http://0.0.0.0:8080/activity/list',
        qs: {
          access_token: token
        },
        json: true
      })
        .then((res) => {
          done(new Error('Not throw error when token is invalid'))
        })
        .catch((err) => {
          expect(err.statusCode).to.equal(400)
          expect(err.body.message).to.equal('Token invalid')
          done()
        })
        .catch(done)
    })
  })
}
