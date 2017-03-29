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

/* Handle unexpected error */
app.use((err, req, res, next) => {
  logger.error(err)
  res.status(500).json({
    messages: 'Internal error.'
  })
})

/* Handle 404 */
app.use((req, res, next) => {
  res.status(404).json({
    messages: 'Not Found.'
  })
})

module.exports = app
