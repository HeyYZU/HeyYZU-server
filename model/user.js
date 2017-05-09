const mongoose = require('mongoose')

var UserSchema = new mongoose.Schema({
  account: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  token: {
    type: String
  },
  meta: {
    registered: {
      type: Date,
      default: Date.now
    },
    leastActive: {
      type: Date,
      default: Date.now
    }
  },
  library: {
    read: [Number],
    favorite: [Number]
  }
})

var UserModel = mongoose.model('user', UserSchema)

module.exports = UserModel
