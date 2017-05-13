'use strict'

const request = require('request-promise')
const logger = log4js.getLogger('proxy')
const response = (options) => {
  return request(options).then((res) => {
    return res.body
  }).catch((e) => {
    if (e.error !== 'Invalid token') {
      logger.debug('[user]' + e)
    }
    return Promise.reject(e)
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
  .then((res) => {
    // Following key name of el is from yzu api response
    // In order to offset time zone to UTC, - 28800 for parse result of time
    return res.map((el) => omitEmpty({
      id: el.bibliosno,
      title: el.bktitle,
      author: el.author,
      attr: {
        order: el.OrderSNo,
        reservedBefore: Date.parse(el.HoldDeadLine) > 0 ? Math.round(Date.parse(el.HoldDeadLine) / 1000) - 28800 : null
      }
    }))
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
  .then((res) => {
      // Following key name of el is from yzu api response
      // In order to offset time zone to UTC, - 28800 for parse result of time
    return res.map((el) => omitEmpty({
      id: parseInt(el.Bibliosno, 10),
      title: el.bktitle,
      author: el.author,
      attr: {
        dueDate: Math.round(Date.parse(el.ReadDueDate) / 1000) - 28800,
        fine: el.Fine > 0 ? el.Fine : null,
        renewable: el.MaxRenewTimes > 0,
        reserved: Math.round(Date.parse(el.RecallDate) / 1000) - 28800 <= 0
      }
    }))
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
  .then((res) => {
      // Following key name of el is from yzu api response
    return res.map((el) => ({
      id: parseInt(el.Bibliosno, 10),
      title: el.bktitle,
      author: el.author
    }))
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
