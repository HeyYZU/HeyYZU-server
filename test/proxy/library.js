const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect
const library = require(BASE_DIR + 'proxy/library')

chai.use(chaiAsPromised)
chai.should()

module.exports = (keyword) => {
  describe('Library Proxy Test', function() {
    this.timeout(20 * 1000)
    it('Search by keyword', function(done) {
      library.search.title(keyword)
        .then((res) => {
          expect(res).to.be.an('array')
          done()
        })
        .catch(done)
    })

    it('Search by ISBN', function(done) {
      library.search.ISBN(9789868968424)
        .then((res) => {
          expect(res).to.be.an('array')
          done()
        })
        .catch(done)
    })

    it('Book status', function(done) {
      library.book.status(565766)
        .then((res) => {
          expect(res).to.include.keys('collections')
          expect(res).to.include.keys('info')
          done()
        })
        .catch(done)
    })

    this.timeout(100 * 1000)

    let multipleNumber = 10 // + Math.round(Math.random() * 100)
    it('Multiple(' + multipleNumber + ') book status', function(done) {
      Promise.all(
        Array(multipleNumber).fill(565766).map((el, i) => library.book.status(el + i)))
        .then((res) => {
          res.forEach((el) => {
            expect(el).to.include.keys('collections')
            expect(el).to.include.keys('info')
          })
          done()
        }, (err) => {
          if (err.statusCode === 404) {
            done()
          } else {
            done(err)
          }
        })
        .catch(done)
    })
  })
}
