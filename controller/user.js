'use strict'

const util = require(path.join(BASE_DIR, '/util'))
const userProxy = require(path.join(BASE_DIR + '/proxy/user'))
const curriculum = (req, res, next) => {
  let query = req.query

  userProxy.course.curriculum(query.access_token, util.time.academicYear(), util.time.semester())
    .then((res) => {
      // Following key name of el is from yzu api response
      return res.map((el) =>
        ({
          lesson_id: (
            el.year.replace(/[^0-9]/ig, '') +
            el.smtr.replace(/[^0-9]/ig, '') + '_' +
            el.cos_id.replace(/[^0-9A-Z]/ig, '') + '_' +
            el.cos_class.replace(/[^0-9A-Z]/ig, '')
            ),
          name: el.name,
          timeSlots: el.WeekandRoom.split(',')
                      .filter(el => el.length > 0)
                      .map((el) => {
                        let pattern = el.match(/(\d{1})(\d{2})\(([^ ].+)?\)/)
                        return ({
                          day: parseInt(pattern[1], 10),
                          slot: parseInt(pattern[2], 10),
                          room: pattern[3]
                        })
                      })
        }))
    })
    .then((content) => {
      res.status(200).json(content)
    })
    .catch((e) => {
      res.status(502).json({
        message: 'Bad Gateway'
      })
    })
}

const info = (req, res, next) => {
  res.status(mock.info.status).json({ message: mock.info.message })
}

const dashboard = (req, res, next) => {
  res.status(mock.dashboard.status).json({ message: mock.dashboard.message })
}

module.exports = {
  curriculum: curriculum,
  info: info,
  dashboard: dashboard
}
