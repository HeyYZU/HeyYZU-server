const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect
const auth = require(BASE_DIR + 'proxy/auth')
const user = require(BASE_DIR + 'proxy/user')

chai.use(chaiAsPromised)
chai.should()

module.exports = (username, password, year, semester) => {
  // User Testing
  describe('user proxy testing', function() {
    this.timeout(10 * 1000)
    // get testing token
    let testToken = ''
    const getToken = auth(username, password)
      .then((r) => {
        testToken = r.token
      })

    expect(getToken).to.eventually.be.fulfilled.then(() => {
      describe('curriculum', function() {
        it('is successful', (done) => {
          user.course.curriculum(testToken, year, semester)
            .then((result) => {
              expect(result).to.be.an('array')
              done()
            }, (err) => {
              done(err)
            })
        })

        it('throw error when token is invalid', (done) => {
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
        it('is successful', (done) => {
          user.course.homeworks(testToken, year, semester)
            .then((result) => {
              expect(result).to.be.an('array')
              done()
            }, (err) => {
              done(err)
            })
        })

        it('throw error when token is invalid', (done) => {
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
          it('throw error when token or id is invalid', (done) => {
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
          it('throw error when token or id is invalid', (done) => {
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
        it('is successful', (done) => {
          user.course.materials(testToken, year, semester)
            .then((result) => {
              expect(result).to.be.an('array')
              done()
            }, (err) => {
              done(err)
            })
        })

        it('throw error when token is invalid', (done) => {
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
        it('is successful', (done) => {
          user.course.announcements(testToken, year, semester)
            .then((result) => {
              expect(result).to.be.an('array')
              done()
            }, (err) => {
              done(err)
            })
        })

        it('throw error when token is invalid', (done) => {
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
        it('is successful', (done) => {
          user.library.reading(testToken)
            .then((result) => {
              expect(result).to.be.an('array')
              done()
            }, (err) => {
              done(err)
            })
        })

        it('throw error when token is invalid', (done) => {
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
        it('is successful', (done) => {
          user.library.read(testToken)
            .then((result) => {
              expect(result).to.be.an('array')
              done()
            }, (err) => {
              done(err)
            })
        })

        it('throw error when token is invalid', (done) => {
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
        it('is successful', (done) => {
          user.library.reserving(testToken)
            .then((result) => {
              expect(result).to.be.an('array')
              done()
            }, (err) => {
              done(err)
            })
        })

        it('throw error when token is invalid', (done) => {
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
