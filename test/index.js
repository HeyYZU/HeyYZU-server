const path = require('path')
global.BASE_DIR = path.join(__dirname, '../')
try {
  global.CONFIG = require('../config.json')
} catch (e) {
  global.CONFIG = {
    YZU_API: {
      appID: process.env.YZU_API_appID,
      sceret: {
        username: process.env.YZU_API_sceret_username,
        password: process.env.YZU_API_sceret_password
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
const TEST_DATA = CONFIG.testing

const proxyTesting = require('./proxy')

TEST_DATA.forEach((tester) => {
  // Proxy Testing
  proxyTesting(tester.username, tester.password, tester.year, tester.semester, tester.courseId, tester.courseClass)
})
