const util = require('util')
const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const router = require(path.join(BASE_DIR, './router'))

const app = express()
const logger = log4js.getLogger('api')

/* Setting module */
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

/* Log access */
app.use(log4js.connectLogger(logger, { level: log4js.levels.INFO }))

/* Setting router */
app.use(router)

/* Setting mongoDB */
var uri
if (CONFIG.mongoDB.username !== undefined) {
  uri = util.format('mongodb://%s:%s@%s:%s/%s',
    encodeURIComponent(CONFIG.mongoDB.username),
    encodeURIComponent(CONFIG.mongoDB.password),
    CONFIG.mongoDB.host, CONFIG.mongoDB.port,
    CONFIG.mongoDB.database
  )
} else {
  uri = util.format('mongodb://%s:%s/%s',
    CONFIG.mongoDB.host, CONFIG.mongoDB.port,
    CONFIG.mongoDB.database
  )
}

mongoose.connect(uri)
mongoose.Promise = Promise

mongoose.connection.on('error', (err) => {
  console.log(err)
})

/* Handle unexpected error */
app.use((err, req, res, next) => {
  logger.error(err)
  res.status(500).json({
    message: 'Internal error.'
  })
})

/* Handle 404 */
app.use((req, res, next) => {
  res.status(404).json({
    message: 'Not Found.'
  })
})

module.exports = app
