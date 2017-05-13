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
  describe('Library', function() {
    this.timeout(20 * 1000)
    // get testing token
    let token = ''
    beforeEach(function(done) {
      auth.then((r) => {
        token = r.token
        done()
      })
    })
    it('Book information', function(done) {
      sendRequest({
        uri: 'http://0.0.0.0:8080/library/book/' + 565766,
        qs: {
          access_token: token
        }
      })
        .then((res) => {
          expect(res.statusCode).to.equal(200)
          expect(res.body).to.include.keys('title')
          expect(res.body).to.include.keys('author')
          expect(res.body).to.include.keys('publisher')
          expect(res.body).to.include.keys('year')
          expect(res.body).to.include.keys('index')
          expect(res.body).to.include.keys('isbn')
          expect(res.body).to.include.keys('cover')
          expect(res.body).to.include.keys('collections')
          expect(res.body.collections).to.be.an('array')
          done()
        })
        .catch(done)
    })

    describe('Reading list', function() {
      this.timeout(20 * 1000)
      it('with valid token', function(done) {
        sendRequest({
          uri: 'http://0.0.0.0:8080/library/reading/',
          qs: {
            access_token: token
          }
        })
          .then((res) => {
            expect(res.statusCode).to.equal(200)
            expect(res.body).to.be.an('array')
            if (res.body.length > 0) {
              let favoriteBook = res.body[0]
              expect(favoriteBook).to.include.keys('id')
              expect(favoriteBook).to.include.keys('title')
              expect(favoriteBook).to.include.keys('author')
              expect(favoriteBook).to.include.keys('attr')
              expect(favoriteBook.attr).to.include.keys('dueDate')
              expect(favoriteBook.attr).to.include.keys('renewable')
              expect(favoriteBook.attr).to.include.keys('reserved')
            }
            done()
          })
          .catch(done)
      })

      it('with invalid token', function(done) {
        sendRequest({
          uri: 'http://0.0.0.0:8080/library/reading/',
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

    describe('Read list', function() {
      this.timeout(50 * 1000)
      it('with valid token', function(done) {
        sendRequest({
          uri: 'http://0.0.0.0:8080/library/read/',
          qs: {
            access_token: token
          }
        })
          .then((res) => {
            expect(res.statusCode).to.equal(200)
            expect(res.body).to.be.an('array')
            if (res.body.length > 0) {
              let favoriteBook = res.body[0]
              expect(favoriteBook).to.include.keys('id')
              expect(favoriteBook).to.include.keys('title')
              expect(favoriteBook).to.include.keys('author')
              expect(favoriteBook).to.include.keys('attr')
              expect(favoriteBook.attr).to.include.keys('index')
              expect(favoriteBook.attr).to.include.keys('reserved')
              done()
            }
          })
          .catch(done)
      })

      it('with invalid token', function(done) {
        sendRequest({
          uri: 'http://0.0.0.0:8080/library/read/',
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

    describe('Reserving list', function() {
      this.timeout(20 * 1000)
      it('with valid token', function(done) {
        sendRequest({
          uri: 'http://0.0.0.0:8080/library/reserving/',
          qs: {
            access_token: token
          }
        })
          .then((res) => {
            expect(res.statusCode).to.equal(200)
            expect(res.body).to.be.an('array')
            if (res.body.length > 0) {
              let favoriteBook = res.body[0]
              expect(favoriteBook).to.include.keys('id')
              expect(favoriteBook).to.include.keys('title')
              expect(favoriteBook).to.include.keys('author')
              expect(favoriteBook).to.include.keys('attr')
              expect(favoriteBook.attr).to.include.keys('order')
            }
            done()
          })
          .catch(done)
      })

      it('with invalid token', function(done) {
        sendRequest({
          uri: 'http://0.0.0.0:8080/library/reserving/',
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

    describe.skip('Favorite', function() {
      describe('Get favorite list', function() {
        it('with valid token', function(done) {
          sendRequest({
            uri: 'http://0.0.0.0:8080/library/favorite/',
            qs: {
              access_token: token
            }
          })
            .then((res) => {
              expect(res.statusCode).to.equal(200)
              expect(res.body).to.be.an('array')
              if (res.body.length > 0) {
                let favoriteBook = res.body[0]
                expect(favoriteBook).to.include.keys('id')
                expect(favoriteBook).to.include.keys('title')
                expect(favoriteBook).to.include.keys('author')
                expect(favoriteBook).to.include.keys('attr')
                expect(favoriteBook.attr).to.include.keys('index')
                expect(favoriteBook.attr).to.include.keys('renewable')
                expect(favoriteBook.attr).to.include.keys('reserved')
                done()
              }
            })
            .catch(done)
        })
        it('with invalid token', function(done) {
          sendRequest({
            uri: 'http://0.0.0.0:8080/library/favorite/',
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

      describe('Put book into favorite list', function() {
        describe('with valid token', function() {
          it('valid book id', function(done) {
            sendRequest({
              method: 'put',
              uri: 'http://0.0.0.0:8080/library/favorite/',
              qs: {
                access_token: token
              }
            })
              .then((res) => {
                expect(res.statusCode).to.equal(200)
                expect(res.body.message).to.equal('ok')
                done()
              })
              .catch(done)
          })

          it('invalid book id', function(done) {
            sendRequest({
              method: 'put',
              uri: 'http://0.0.0.0:8080/library/favorite/',
              qs: {
                access_token: 'invalid token'
              }
            })
              .then((res) => {
                done(new Error('Not throw error when book id is invalid'))
              })
              .catch((err) => {
                expect(err.statusCode).to.equal(400)
                expect(err.body.message).to.equal('Invalid book id')
              })
              .catch(done)
          })
        })

        it('with invalid token', function(done) {
          sendRequest({
            method: 'put',
            uri: 'http://0.0.0.0:8080/library/favorite/',
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

      describe('Delete book from favorite list', function() {
        describe('with valid token', function() {
          it('valid book id', function(done) {
            sendRequest({
              method: 'delete',
              uri: 'http://0.0.0.0:8080/library/favorite/',
              qs: {
                access_token: token
              }
            })
              .then((res) => {
                expect(res.statusCode).to.equal(200)
                expect(res.body.message).to.equal('ok')
                done()
              })
              .catch(done)
          })

          it('invalid book id', function(done) {
            sendRequest({
              method: 'delete',
              uri: 'http://0.0.0.0:8080/library/favorite/',
              qs: {
                access_token: token
              }
            })
              .then((res) => {
                done(new Error('Not throw error when book id is invalid'))
              })
              .catch((err) => {
                expect(err.statusCode).to.equal(400)
                expect(err.body.message).to.equal('Invalid book id')
              })
              .catch(done)
          })
        })

        it('with invalid token', function(done) {
          sendRequest({
            method: 'delete',
            uri: 'http://0.0.0.0:8080/library/favorite/',
            qs: {
              access_token: 'invalid token'
            }
          })
            .then((res) => {
              done(new Error('Not throw error when token is invalid'))
            })
            .catch((res) => {
              expect(res.statusCode).to.equal(400)
              expect(res.body.message).to.equal('Token invalid')
              done()
            })
            .catch(done)
        })
      })
    })
  })
}
