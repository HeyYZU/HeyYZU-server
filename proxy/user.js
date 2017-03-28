'use strict'

const request = require('request-promise')

const response = (options) => {
  return request(options).then((res) => {
    if (res.statusCode !== 200) {
      return Promise.reject(new Error({
        body: res.body,
        status: res.statusCode
      }))
    }
    return res.body
  })
}

const curriculum = (token, year, semester) => {
  if (!token || !year || !semester) {
    return Promise.reject(new Error('token, year and semester must be given.'))
  }
  return response({
    method: 'POST',
    uri: 'https://unipop.yzu.edu.tw/YzuPortalAPI/api/Portal/UserCourseList',
    form: {
      'token': token,
      'year': year,
      'smtr': semester
    },
    resolveWithFullResponse: true,
    json: true
  })
}

const homeworks = (token, year, semester) => {
  if (!token || !year || !semester) {
    return Promise.reject(new Error('token, year and semester must be given.'))
  }
  return response({
    method: 'POST',
    uri: 'https://unipop.yzu.edu.tw/YzuPortalAPI/api/Portal/UserHomeWorkList',
    form: {
      'token': token,
      'year': year,
      'smtr': semester
    },
    resolveWithFullResponse: true,
    json: true
  })
}

homeworks.archive = (token, id) => {
  if (!token || !id) {
    return Promise.reject(new Error('token and id must be given.'))
  }

  return response({
    method: 'POST',
    uri: 'https://unipop.yzu.edu.tw/YzuPortalAPI/api/Portal/UserFileDownLoad',
    form: {
      'token': token,
      'fileType': 'homework',
      'fileID': id
    },
    resolveWithFullResponse: true
  })
}

homeworks.attachment = (token, id) => {
  if (!token || !id) {
    return Promise.reject(new Error('token and id must be given.'))
  }

  return response({
    method: 'POST',
    uri: 'https://unipop.yzu.edu.tw/YzuPortalAPI/api/Portal/UserFileDownLoad',
    form: {
      'token': token,
      'fileType': 'schoolwork',
      'fileID': id
    },
    resolveWithFullResponse: true
  })
}

const materials = (token, year, semester) => {
  if (!token || !year || !semester) {
    return Promise.reject(new Error('token, year and semester must be given.'))
  }

  return response({
    method: 'POST',
    uri: 'https://unipop.yzu.edu.tw/YzuPortalAPI/api/Portal/UserCourseMaterials',
    form: {
      'token': token,
      'year': year,
      'smtr': semester
    },
    resolveWithFullResponse: true,
    json: true
  })
}

materials.attachment = (token, id) => {
  if (!token || !id) {
    return Promise.reject(new Error('token and id must be given.'))
  }

  return response({
    method: 'POST',
    uri: 'https://unipop.yzu.edu.tw/YzuPortalAPI/api/Portal/UserFileDownLoad',
    form: {
      'token': token,
      'fileType': 'material',
      'fileID': id
    },
    resolveWithFullResponse: true
  })
}

const announcements = (token, year, semester) => {
  if (!token || !year || !semester) {
    return Promise.reject(new Error('token, year and semester must be given.'))
  }

  return response({
    method: 'POST',
    uri: 'https://unipop.yzu.edu.tw/YzuPortalAPI/api/Portal/UserCourseNews',
    form: {
      'token': token,
      'year': year,
      'smtr': semester
    },
    resolveWithFullResponse: true,
    json: true
  })
}

announcements.attachment = materials.attachment

const libraryReserving = (token) => {
  if (!token) {
    return Promise.reject(new Error('token must be given.'))
  }

  return response({
    method: 'POST',
    uri: 'https://unipop.yzu.edu.tw/YzuPortalAPI/api/Portal/UserCurrentRequest',
    form: {
      'token': token
    },
    resolveWithFullResponse: true,
    json: true
  })
}

const libraryReading = (token) => {
  if (!token) {
    return Promise.reject(new Error('token must be given.'))
  }

  return response({
    method: 'POST',
    uri: 'https://unipop.yzu.edu.tw/YzuPortalAPI/api/Portal/UserCurrentLoan',
    form: {
      'token': token
    },
    resolveWithFullResponse: true,
    json: true
  })
}

const libraryRead = (token) => {
  if (!token) {
    return Promise.reject(new Error('token must be given.'))
  }

  return response({
    method: 'POST',
    uri: 'https://unipop.yzu.edu.tw/YzuPortalAPI/api/Portal/UserHistoryLoan',
    form: {
      'token': token
    },
    resolveWithFullResponse: true,
    json: true
  })
}

module.exports = {
  course: {
    curriculum: curriculum,
    homeworks: homeworks,
    materials: materials,
    announcements: announcements
  },
  library: {
    reserving: libraryReserving,
    reading: libraryReading,
    read: libraryRead
  }
}
