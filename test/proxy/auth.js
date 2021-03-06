const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect
const auth = require(BASE_DIR + 'proxy/auth')

chai.use(chaiAsPromised)
chai.should()

module.exports = (username, password) => {
  describe('Auth Proxy Test', function() {
    this.timeout(10 * 1000)
    it('is successful when username & password are correct', function(done) {
      auth(username, password)
        .then(
           (result) => {
             result.should.have.property('token')
             result.should.have.property('expired')
             done()
           },
          (err) => {
            done(err)
          }
        )
    })

    it('throw error when username & password are mistake', function(done) {
      auth('s1010541', 'E2323')
        .then((result) => {
          done(new Error('No throw error when username or password is mistake.'))
        })
        .catch((err) => {
          expect(err).to.be.an('error')
          done()
        })
        .catch(done)
    })
  })
}
