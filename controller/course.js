'use strict'

const userProxy = require(path.join(BASE_DIR + '/proxy/user'))
const courseProxy = require(path.join(BASE_DIR + '/proxy/course'))
const util = require(path.join(BASE_DIR + '/util'))

const announcement = (req, res, next) => {
  let params = req.params.id.match(/(\d{3})(\d{1})_([\w\d]+)_([\w\d]+)/)
  courseProxy.announcements(req.query.access_token, params[1], params[2], params[3], params[4])
    .then((res) => {
      // Following key name of el is from yzu api response\
      return res.map((el) => omitEmpty({
        subject: el.subject,
        content: el.body.replace(/\r\n/ig, '\n'),
        datetime: Math.round(Date.parse(el.insert_date) / 1000),
        author: el.users,
        attach: el.file_id > 0 ? {
          id: el.file_id,
          filename: el.file_name
        } : null
      }))
      .sort((a, b) => b.datetime - a.datetime)
    })
    .then((content) => {
      res.status(200).json(content)
    })
    .catch((e) => {
      if (e.message === 'token, year, semester, courseId, courseClass must be given.') {
        res.status(400).json({message: 'Course id must be given.'})
      } else {
        res.status(502).json({message: 'Bad Gateway'})
      }
    })
}

announcement.attach = (req, res, next) => {
  res.status(200).send(mock.attach)
}

const material = (req, res, next) => {
  let params = req.params.id.match(/(\d{3})(\d{1})_([\w\d]+)_([\w\d]+)/)
  courseProxy.materials(req.query.access_token, params[1], params[2], params[3], params[4])
    .then((res) => {
      // Following key name of el is from yzu api response
      return res.map((el) => omitEmpty({
        subject: el.description,
        datetime: Math.round(Date.parse(el.Upload_Time) / 1000),
        attach: el.file_id > 0 ? {
          id: el.file_id,
          filename: el.file_name
        } : null,
        website: el.wurl,
        video: el.murl
      }))
      .sort((a, b) => b.datetime - a.datetime)
    })
    .then((content) => {
      res.status(200).json(content)
    })
    .catch((e) => {
      if (e.message === 'token, year, semester, courseId, courseClass must be given.') {
        res.status(400).json({message: 'Course id must be given.'})
      } else {
        res.status(502).json({message: 'Bad Gateway'})
      }
    })
}

material.attach = (req, res, next) => {
  res.status(200).send(mock.attach)
}

const homework = (req, res, next) => {
  let params = req.params.id.match(/(\d{3})(\d{1})_([\w\d]+)_([\w\d]+)/)
  userProxy.course.homeworks(req.query.access_token, params[1], params[2])
    .then((res) => {
      // Following key name of el is from yzu api response
      return res.filter(el => el.cos_id.includes(params[3]))
        .map((el) => omitEmpty({
          subject: el.subject,
          content: el.content,
          datetime: util.time.offsetPM(el.Insert_time, Math.round(Date.parse(el.Insert_time.replace(/下午|上午/, '')) / 1000)),
          deadline: util.time.offsetPM(el.Dead_line, Math.round(Date.parse(el.Dead_line.replace(/下午|上午/, '')) / 1000)),
          group: !el.ISGroup.includes('S'),
          optional: el.ck_free !== '0',
          attach: el.Q_fileid > 0 ? {
            id: parseInt(el.Q_fileid, 10),
            filename: el.Q_filename
          } : null,
          archive: el.SubRecord.map(el => omitEmpty({
            id: parseInt(el.A_fileid, 10) || null,
            filename: el.A_filename || null,
            datetime: util.time.offsetPM(el.Update_time, Math.round(Date.parse(el.Update_time.replace(/下午|上午/, '')) / 1000)) || null,
            valid: el.abandon === '0' ? true : el.abandon === '1' ? false : null
          }))
        }))
        .sort((a, b) => b.datetime - a.datetime)
    })
    .then((content) => {
      res.status(200).json(content)
    })
    .catch((e) => {
      if (e.message === 'token, year, semester, courseId, courseClass must be given.') {
        res.status(400).json({message: 'Course id must be given.'})
      } else {
        res.status(502).json({message: 'Bad Gateway'})
      }
    })
}

homework.archive = (req, res, next) => {
  res.status(200).send(mock.archive)
}

homework.attach = (req, res, next) => {
  res.status(200).send(mock.attach)
}

const absent = (req, res, next) => {
  res.status(mock.absent.status).json({ message: mock.absent.message })
}

module.exports = {
  announcement: announcement,
  material: material,
  homework: homework,
  absent: absent
}
