global.BASE_DIR = __dirname
global.log4js = require('log4js')
global.path = require('path')
global.omitEmpty = require('omit-empty')

/* Loading Config */
try {
  global.CONFIG = require('./config.json')
} catch (e) {
  global.CONFIG = {
    YZU_API: {
      appID: process.env.YZU_API_appID,
      secret: {
        username: process.env.YZU_API_secret_username,
        password: process.env.YZU_API_secret_password
      }
    },
    testing: [{
      username: process.env.testing_username,
      password: process.env.testing_password,
      year: process.env.testing_year,
      semester: process.env.testing_semester,
      courseId: process.env.testing_courseId,
      courseClass: process.env.testing_courseClass
    }]
  }
}

const http = require('http')
const app = require('./app')

/* Loading env variable */

const env = {
  bind: process.env.httpPort
}

/* Setting log4js */

log4js.configure({
  appenders: [
    {
      type: 'logLevelFilter',
      level: 'INFO',
      category: ['api', 'httpService'],
      appender: {
        type: 'DateFile',
        filename: BASE_DIR + '/log/access.log',
        pattern: '-yyyy-MM-dd.log',
        alwaysIncludePattern: true
      }
    },
    {
      type: 'logLevelFilter',
      level: 'ERROR',
      category: ['api', 'httpService'],
      appender: {
        type: 'DateFile',
        filename: BASE_DIR + '/log/error.log',
        pattern: '-yyyy-MM-dd.log',
        alwaysIncludePattern: true
      }
    },
    {
      type: 'logLevelFilter',
      level: 'FATAL',
      category: ['api', 'httpService'],
      appender: {
        type: 'DateFile',
        filename: BASE_DIR + '/log/fatal.log',
        pattern: '-yyyy-MM-dd.log',
        alwaysIncludePattern: true
      }
    },
    {
      type: 'logLevelFilter',
      level: 'INFO',
      category: 'proxy',
      appender: {
        type: 'DateFile',
        filename: BASE_DIR + '/log/proxy-access.log',
        pattern: '-yyyy-MM-dd.log',
        alwaysIncludePattern: true
      }
    },
    {
      type: 'logLevelFilter',
      level: 'ERROR',
      category: 'proxy',
      appender: {
        type: 'DateFile',
        filename: BASE_DIR + '/log/proxy-error.log',
        pattern: '-yyyy-MM-dd.log',
        alwaysIncludePattern: true
      }
    },
    {
      type: 'logLevelFilter',
      level: 'FATAL',
      category: 'proxy',
      appender: {
        type: 'DateFile',
        filename: BASE_DIR + '/log/proxy-fatal.log',
        pattern: '-yyyy-MM-dd.log',
        alwaysIncludePattern: true
      }
    }
  ]
})

/* Create HTTP Server */

var logger = log4js.getLogger('httpService')

var httpServer = http.createServer(app)
httpServer.listen(env.bind)


httpServer.on('error', function(err) {
  if (err.syscall !== 'listen') {
    logger.fatal(err)
    throw err
  }
  switch (err.code) {
    case 'EACCES':
      logger.fatal('port - ' + env.bind + 'requires elevated privileges.')
      process.exit(1)
      break
    case 'EADDRINUSE':
      logger.fatal('port - ' + env.bind + 'is already in use.')
  }
})

httpServer.on('listening', () => {
  logger.info('app active in port - ' + env.bind)
})
