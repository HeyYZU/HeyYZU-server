'use strict'

const request = require('request-promise')

const response = (options) => {
  return request(options).then((res) => {
    if (res.statusCode !== 200) {
      throw new Error({
        body: res.body,
        status: res.statusCode
      })
    }
    return res.body
  })
}

const materials = (token, year, semester, courseId, courseClass) => {
  if (!token || !year || !semester) {
    throw new Error('token, year and semester must be given.')
  }

  return response({
    method: 'POST',
    uri: 'https://unipop.yzu.edu.tw/YzuPortalAPI/api/Course/CourseMaterials',
    form: {
      'token': token,
      'year': year,
      'smtr': semester,
      'cosId': courseId,
      'cosClass': courseClass
    },
    resolveWithFullResponse: true,
    json: true
  })
}

const announcements = (token, year, semester, courseId, courseClass) => {
  if (!token || !year || !semester) {
    throw new Error('token, year and semester must be given.')
  }

  return response({
    method: 'POST',
    uri: 'https://unipop.yzu.edu.tw/YzuPortalAPI/api/Course/CourseNews',
    form: {
      'token': token,
      'year': year,
      'smtr': semester,
      'cosid': courseId,
      'cosclass': courseClass
    },
    resolveWithFullResponse: true,
    json: true
  })
}

module.exports = {
  materials: materials,
  announcements: announcements
}
