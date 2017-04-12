'use strict'

const academicYear = (adYear, month) => {
  adYear = adYear || (new Date()).getFullYear()
  month = month || (new Date()).getMonth() + 1
  return month > 7 ? adYear - 1911 : adYear - 1912
}

const semester = (month) => {
  month = month || (new Date()).getMonth() + 1
  return month > 1 && month < 7 ? 2 : 1
}

module.exports = {
  academicYear: academicYear,
  semester: semester
}
