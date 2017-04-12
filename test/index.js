global.log4js = require('log4js')
global.path = require('path')
global.BASE_DIR = path.join(__dirname, '../')
try {
  global.CONFIG = require('../config.json')
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

/* Setting log4js */

log4js.configure({
  appenders: [
    {
      type: 'logLevelFilter',
      level: process.env.node_env === 'test' ? 'OFF' : 'INFO',
      category: 'proxy',
      appender: {
        type: 'console',
        filename: BASE_DIR + 'test-log/proxy-access.log',
        pattern: '-yyyy-MM-dd.log',
        alwaysIncludePattern: true
      }
    },
    {
      type: 'logLevelFilter',
      level: process.env.node_env === 'test' ? 'OFF' : 'ERROR',
      category: 'proxy',
      appender: {
        type: 'console',
        filename: BASE_DIR + 'test-log/proxy-error.log',
        pattern: '-yyyy-MM-dd.log',
        alwaysIncludePattern: true
      }
    },
    {
      type: 'logLevelFilter',
      level: process.env.node_env === 'test' ? 'OFF' : 'FATAL',
      category: 'proxy',
      appender: {
        type: 'console',
        filename: BASE_DIR + 'test-log/proxy-fatal.log',
        pattern: '-yyyy-MM-dd.log',
        alwaysIncludePattern: true
      }
    }
  ]
})

const TEST_DATA = CONFIG.testing

const proxyTesting = require('./proxy')
const apiTesting = require('./api')

TEST_DATA.forEach((tester) => {
  // Proxy Testing
  proxyTesting(tester.username, tester.password, tester.year, tester.semester, tester.courseId, tester.courseClass)
  // API testing
  apiTesting(tester.username, tester.password)
})
