const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect
const auth = require(BASE_DIR + 'proxy/auth')
const user = require(BASE_DIR + 'proxy/user')

chai.use(chaiAsPromised)
chai.should()

module.exports = (username, password, year, semester) => {
  // get testing token
  let testToken = ''
  const getToken = auth(username, password)
    .then((r) => {
      testToken = r.token
    })

  expect(getToken).to.eventually.be.fulfilled.then(function() {
    describe('User Proxy Test', function() {
      this.timeout(10 * 1000)
      describe('curriculum', function() {
        it('is successful', function(done) {
          user.course.curriculum(testToken, year, semester)
            .then((result) => {
              expect(result).to.be.an('array')
              done()
            }, (err) => {
              done(err)
            })
        })

        it('throw error when token is invalid', function(done) {
          user.course.curriculum('invalid')
            .then((r) => {
              done(new Error('No throw error when token is valid.'))
            })
            .catch((err) => {
              expect(err).to.be.an.instanceof(Error)
              done()
            })
            .catch(done)
        })
      })

      describe('get homeworks', function() {
        it('is successful', function(done) {
          user.course.homeworks(testToken, year, semester)
            .then((result) => {
              expect(result).to.be.an('array')
              done()
            }, (err) => {
              done(err)
            })
        })

        it('throw error when token is invalid', function(done) {
          user.course.homeworks('invalid', year, semester)
            .then((result) => {
              done(new Error('No throw error when token is invalid.'))
            })
            .catch((err) => {
              expect(err).to.be.an.instanceof(Error)
              done()
            })
            .catch(done)
        })

        describe('archive', function() {
          it('throw error when token or id is invalid', function(done) {
            user.course.homeworks.archive('invalid', 0)
              .then((result) => {
                done(new Error('No throw error when token or id is invalid.'))
              })
              .catch((err) => {
                expect(err).to.be.an.instanceof(Error)
                done()
              })
              .catch(done)
          })
        })

        describe('attachment', function() {
          it('throw error when token or id is invalid', function(done) {
            user.course.homeworks.attachment('invalid', 0)
              .then((result) => {
                done(new Error('No throw error when token or id is invalid.'))
              })
              .catch((err) => {
                expect(err).to.be.an.instanceof(Error)
                done()
              })
              .catch(done)
          })
        })
      })

      describe('get materials', function() {
        it('is successful', function(done) {
          user.course.materials(testToken, year, semester)
            .then((result) => {
              expect(result).to.be.an('array')
              done()
            }, (err) => {
              done(err)
            })
        })

        it('throw error when token is invalid', function(done) {
          user.course.materials('invalid', year, semester)
            .then((result) => {
              done(new Error('No throw error when token is invalid.'))
            })
            .catch((err) => {
              expect(err).to.be.an.instanceof(Error)
              done()
            })
            .catch(done)
        })
      })

      describe('get announcements', function() {
        it('is successful', function(done) {
          user.course.announcements(testToken, year, semester)
            .then((result) => {
              expect(result).to.be.an('array')
              done()
            }, (err) => {
              done(err)
            })
        })

        it('throw error when token is invalid', function(done) {
          user.course.announcements('12558', year, semester)
            .then((result) => {
              done(new Error('No throw error when token is invalid.'))
            })
            .catch((err) => {
              expect(err).to.be.an.instanceof(Error)
              done()
            })
            .catch(done)
        })
      })

      describe('get library reading list', function() {
        this.timeout(10 * 1000)
        it('is successful', function(done) {
          user.library.reading(testToken)
            .then((result) => {
              expect(result).to.be.an('array')
              done()
            }, (err) => {
              done(err)
            })
        })

        it('throw error when token is invalid', function(done) {
          user.library.reading('sdfasdf')
            .then((result) => {
              done(new Error('No throw error when token is invalid.'))
            })
            .catch((err) => {
              expect(err).to.be.an.instanceof(Error)
              done()
            })
            .catch(done)
        })
      })

      describe('get library read list', function() {
        this.timeout(10 * 1000)
        it('is successful', function(done) {
          user.library.read(testToken)
            .then((result) => {
              expect(result).to.be.an('array')
              done()
            }, (err) => {
              done(err)
            })
        })

        it('throw error when token is invalid', function(done) {
          user.library.read('sdfasdf')
            .then((result) => {
              done(new Error('No throw error when token is invalid.'))
            })
            .catch((err) => {
              expect(err).to.be.an.instanceof(Error)
              done()
            })
            .catch(done)
        })
      })

      describe('get library reserving list', function() {
        this.timeout(10 * 1000)
        it('is successful', function(done) {
          user.library.reserving(testToken)
            .then((result) => {
              expect(result).to.be.an('array')
              done()
            }, (err) => {
              done(err)
            })
        })

        it('throw error when token is invalid', function(done) {
          user.library.reserving('sdfasdf')
            .then((result) => {
              done(new Error('No throw error when token is invalid.'))
            })
            .catch((err) => {
              expect(err).to.be.an.instanceof(Error)
              done()
            })
            .catch(done)
        })
      })
    })
  })
}
