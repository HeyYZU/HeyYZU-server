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

module.exports = function() {
  describe.skip('Info', function() {
    it('System information', function(done) {
      sendRequest({
        uri: 'http://0.0.0.0:8080/info/sysInfo/'
      })
        .then((res) => {
          expect(res.statusCode).to.equal(200)
          expect(res.body).to.include.keys('api-version')
          expect(res.body).to.include.keys('system-time')
          done()
        })
        .catch(done)
    })

    it('Android APP Client information', function(done) {
      sendRequest({
        uri: 'http://0.0.0.0:8080/info/app/android/'
      })
        .then((res) => {
          expect(res.statusCode).to.equal(200)
          expect(res.body).to.include.keys('min-version')
          expect(res.body).to.include.keys('latest-version')
          done()
        })
        .catch(done)
    })

    it('iOS APP Client information', function(done) {
      sendRequest({
        uri: 'http://0.0.0.0:8080/info/app/ios/'
      })
        .then((res) => {
          expect(res.statusCode).to.equal(200)
          expect(res.body).to.include.keys('min-version')
          expect(res.body).to.include.keys('latest-version')
          done()
        })
        .catch(done)
    })
  })
}
