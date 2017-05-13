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
  describe('Course', function() {
    // get testing token
    let token = ''
    beforeEach(function(done) {
      auth.then((r) => {
        token = r.token
        done()
      })
    })
    describe('Get announcement list', function() {
      it('with valid token', function(done) {
        sendRequest({
          uri: 'http://0.0.0.0:8080/course/announcement/' + '1042_CS382_A',
          qs: {
            access_token: token
          }
        })
          .then((res) => {
            expect(res.statusCode).to.equal(200)
            expect(res.body).to.be.an('array')
            if (res.body.length > 0) {
              let announcement = res.body[0]
              expect(announcement).to.include.keys('subject')
              expect(announcement).to.include.keys('content')
              expect(announcement).to.include.keys('datetime')
              expect(announcement).to.include.keys('author')
            }
            done()
          })
          .catch(done)
      })

      it('with invalid token', function(done) {
        sendRequest({
          uri: 'http://0.0.0.0:8080/course/announcement/' + '1042_CS382_A',
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

    describe.skip('Get announcement attachment', function() {
      describe('with valid token', function() {
        it('valid attachment id', function(done) {
          sendRequest({
            uri: 'http://0.0.0.0:8080/course/announcement/attach/',
            qs: {
              access_token: token
            }
          })
            .then((res) => {
              expect(res.statusCode).to.equal(200)
              done()
            })
            .catch(done)
        })
        it('invalid attachment id', function(done) {
          sendRequest({
            uri: 'http://0.0.0.0:8080/course/announcement/attach/' + 'invalid_id',
            qs: {
              access_token: 'token'
            }
          })
            .then((res) => {
              done(new Error('Not throw error when attachment id is invalid'))
            })
            .catch((err) => {
              expect(err.statusCode).to.equal(400)
              expect(err.error.message).to.equal('Attachment id invalid')
              done()
            })
            .catch(done)
        })
      })
      it('with invalid token', function(done) {
        sendRequest({
          uri: 'http://0.0.0.0:8080/course/announcement/attach/',
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

    describe('Get material list', function() {
      it('with valid token', function(done) {
        sendRequest({
          uri: 'http://0.0.0.0:8080/course/material/' + '1042_CS382_A',
          qs: {
            access_token: token
          }
        })
          .then((res) => {
            expect(res.statusCode).to.equal(200)
            expect(res.body).to.be.an('array')
            if (res.body.length > 0) {
              let material = res.body[0]
              expect(material).to.include.keys('subject')
              expect(material).to.include.keys('datetime')
            }
            done()
          })
          .catch(done)
      })

      it('with invalid token', function(done) {
        sendRequest({
          uri: 'http://0.0.0.0:8080/course/material/' + '1042_CS382_A',
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

    describe.skip('Get material attachment', function() {
      describe('with valid token', function() {
        it('valid attachment id', function(done) {
          sendRequest({
            uri: 'http://0.0.0.0:8080/course/material/attach/',
            qs: {
              access_token: token
            }
          })
            .then((res) => {
              expect(res.statusCode).to.equal(200)
              done()
            })
            .catch(done)
        })
        it('invalid attachment id', function(done) {
          sendRequest({
            uri: 'http://0.0.0.0:8080/course/material/attach/' + 'invalid_id',
            qs: {
              access_token: token
            }
          })
            .then((res) => {
              done(new Error('Not throw error when attachment id is invalid'))
            })
            .catch((err) => {
              expect(err.statusCode).to.equal(400)
              expect(err.error.message).to.equal('Attachment id invalid')
              done()
            })
            .catch(done)
        })
      })
      it('with invalid token', function(done) {
        sendRequest({
          uri: 'http://0.0.0.0:8080/course/material/attach/',
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

    describe('Get homework list', function() {
      this.timeout(20 * 1000)
      it('with valid token', function(done) {
        sendRequest({
          uri: 'http://0.0.0.0:8080/course/homework/' + '1042_CS382_A',
          qs: {
            access_token: token
          }
        })
          .then((res) => {
            expect(res.statusCode).to.equal(200)
            expect(res.body).to.be.an('array')
            if (res.body.length > 0) {
              let homework = res.body[0]
              expect(homework).to.include.keys('subject')
              expect(homework).to.include.keys('content')
              expect(homework).to.include.keys('datetime')
              expect(homework).to.include.keys('deadline')
              expect(homework).to.include.keys('group')
              expect(homework).to.include.keys('optional')
              expect(homework).to.include.keys('subject')
            }
            done()
          })
          .catch(done)
      })

      it('with invalid token', function(done) {
        sendRequest({
          uri: 'http://0.0.0.0:8080/course/homework/' + '1042_CS382_A',
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

    describe.skip('Get homework archive', function() {
      describe('with valid token', function() {
        it('valid archive id', function(done) {
          sendRequest({
            uri: 'http://0.0.0.0:8080/course/homework/archive/',
            qs: {
              access_token: token
            }
          })
            .then((res) => {
              expect(res.statusCode).to.equal(200)
              done()
            })
            .catch(done)
        })

        it('invalid archive id', function(done) {
          sendRequest({
            uri: 'http://0.0.0.0:8080/course/homework/archive/',
            qs: {
              access_token: token
            }
          })
            .then((res) => {
              done(new Error('Not throw error when archive id is invalid'))
            })
            .catch((err) => {
              expect(err.statusCode).to.equal(400)
              expect(err.error.message).to.equal('Archive id invalid')
              done()
            })
            .catch(done)
        })
      })

      it('with invalid token', function(done) {
        sendRequest({
          uri: 'http://0.0.0.0:8080/course/homework/archive/',
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

    describe.skip('Get homework attachment', function() {
      describe('with valid token', function() {
        it('valid attachment id', function(done) {
          sendRequest({
            uri: 'http://0.0.0.0:8080/course/homework/attach/',
            qs: {
              access_token: token
            }
          })
            .then((res) => {
              expect(res.statusCode).to.equal(200)
              done()
            })
            .catch(done)
        })

        it('invalid attachment id', function(done) {
          sendRequest({
            uri: 'http://0.0.0.0:8080/course/homework/attach/',
            qs: {
              access_token: token
            }
          })
            .then((res) => {
              done(new Error('Not throw error when attachment id is invalid'))
            })
            .catch((err) => {
              expect(err.statusCode).to.equal(400)
              expect(err.error.message).to.equal('Attachment id invalid')
              done()
            })
            .catch(done)
        })
      })

      it('with invalid token', function(done) {
        sendRequest({
          uri: 'http://0.0.0.0:8080/course/homework/attach/',
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

    describe.skip('Get absent information', function() {
      it('with valid token', function(done) {
        sendRequest({
          uri: 'http://0.0.0.0:8080/course/absent/' + '1042_CS382_A',
          qs: {
            access_token: token
          }
        })
          .then((res) => {
            expect(res.statusCode).to.equal(200)
            expect(res.body).to.be.an('array')
            done()
          })
          .catch(done)
      })

      it('with invalid token', function(done) {
        sendRequest({
          uri: 'http://0.0.0.0:8080/course/absent/' + '1042_CS382_A',
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
