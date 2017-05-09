const mongoose = require('mongoose')

var BookSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  index: {
    type: String,
    required: true
  },
  year: {
    type: Number
  },
  isbn: {
    type: Number,
    required: true
  },
  cover: {
    type: String
  }
})

var UserModel = mongoose.model('book', BookSchema)

module.exports = UserModel
