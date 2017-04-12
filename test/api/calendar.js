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
  describe.skip('Calendar', function() {
    // get testing token
    let token = ''
    beforeEach(function(done) {
      auth.then((r) => {
        token = r.token
        done()
      })
    })
    describe('get list', function() {
      it('with valid token', (done) => {
        sendRequest({
          uri: 'http://0.0.0.0:8080/calendar/list',
          qs: {
            access_token: token
          },
          json: true
        })
          .then((res) => {
            expect(res.statusCode).to.equal(501)
            expect(res.body.message).to.equal('Not Implemented')
            done()
          })
          .catch(done)
      })
      it('with invalid token', (done) => {
        sendRequest({
          uri: 'http://0.0.0.0:8080/calendar/list',
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
            expect(err.error.message).to.equal('Token invalid')
            done()
          })
          .catch(done)
      })
    })

    let eventId = 0

    describe('put event', function() {
      describe('with valid token', function() {
        it('all column are filled', (done) => {
          sendRequest({
            method: 'put',
            uri: 'http://0.0.0.0:8080/calendar/event',
            qs: {
              access_token: token
            },
            form: {
              'start': 1490822210,
              'end': 1490840210,
              'subject': 'Mock new event',
              'place': 'Mock event place',
              'remark': 'Mock remark. It can be url or any world.'
            },
            json: true
          })
            .then((res) => {
              expect(res.statusCode).to.equal(200)
              expect(res.body.message).to.equal('ok')
              expect(res.body).to.have.property('id')
              eventId = res.body.id
              done()
            })
            .catch(done)
        })

        it('only required column', (done) => {
          sendRequest({
            method: 'put',
            uri: 'http://0.0.0.0:8080/calendar/event',
            qs: {
              access_token: token
            },
            form: {
              'start': 1490822210,
              'end': 1490840210,
              'subject': 'Mock new event'
            },
            json: true
          })
            .then((res) => {
              expect(res.statusCode).to.equal(200)
              expect(res.body.message).to.equal('ok')
              expect(res.body).to.have.property('id')
              done()
            })
            .catch(done)
        })

        it('some column are missing', (done) => {
          sendRequest({
            method: 'put',
            uri: 'http://0.0.0.0:8080/calendar/event',
            qs: {
              access_token: token
            },
            form: {
              'start': 1490822210,
              'end': 1490840210,
              'subject': 'Mock new event'
            },
            json: true
          })
            .then((res) => {
              done(new Error('Not throw error when required column is missing'))
            })
            .catch((err) => {
              expect(err.statusCode).to.equal(400)
              expect(err.error.message).to.equal('start, end and subject are required')
            })
            .catch(done)
        })
      })

      it('with invalid token', (done) => {
        sendRequest({
          method: 'put',
          uri: 'http://0.0.0.0:8080/calendar/event',
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
            expect(err.error.message).to.equal('Token invalid')
            done()
          })
          .catch(done)
      })
    })

    describe('get event', () => {
      it('with valid token', (done) => {
        sendRequest({
          uri: 'http://0.0.0.0:8080/calendar/event/' + eventId,
          qs: {
            access_token: token
          },
          json: true
        })
          .then((res) => {
            expect(res.statusCode).to.equal(501)
            expect(res.error.message).to.equal('Not implement')
            done()
          })
          .catch(done)
      })

      it('with invalid token', (done) => {
        sendRequest({
          uri: 'http://0.0.0.0:8080/calendar/event/' + eventId,
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
            expect(err.error.message).to.equal('Token invalid')
            done()
          })
          .catch(done)
      })
    })

    describe('delete event', () => {
      describe('with valid token', () => {
        it('valid event id', (done) => {
          sendRequest({
            method: 'delete',
            uri: 'http://0.0.0.0:8080/calendar/event/' + eventId,
            qs: {
              access_token: token
            },
            json: true
          })
            .then((res) => {
              expect(res.statusCode).to.equal(200)
              expect(res.body.message).to.equal('ok')
              done()
            })
            .catch(done)
        })

        it('invalid event id', (done) => {
          sendRequest({
            method: 'delete',
            uri: 'http://0.0.0.0:8080/calendar/event/' + 'invalid_id',
            qs: {
              access_token: token
            },
            json: true
          })
            .then((res) => {
              done(new Error('Not throw error when event id is invalid'))
            })
            .catch((err) => {
              expect(err.statusCode).to.equal(400)
              expect(err.error.message).to.equal('Event id invalid')
              done()
            })
            .catch(done)
        })
      })

      describe('with invalid token', () => {
        it('fail whatever event id', (done) => {
          sendRequest({
            method: 'delete',
            uri: 'http://0.0.0.0:8080/calendar/event/' + eventId,
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
              expect(err.error.message).to.equal('Token invalid')
              done()
            })
            .catch(done)
        })
      })
    })
  })
}
