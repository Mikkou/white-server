const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema

let UserSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now }
  },
  {
    versionKey: false
  }
)

UserSchema.pre('save', function (next) {
  const user = this
  if (!user.createdAt) {
    user.createdAt = new Date()
  }

  if (!user.isNew) {
    next()
  } else {
    bcrypt.hash(user.password, 10, function (err, hash) {
      if (err) {
        console.log('Error hashing password for user', user.name)
        next(err)
      } else {
        user.password = hash
        next()
      }
    })
  }
})

module.exports = mongoose.model('user', UserSchema)
