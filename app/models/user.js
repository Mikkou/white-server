let mongoose = require('mongoose')
let Schema = mongoose.Schema

let UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  {
    versionKey: false
  }
)

UserSchema.pre('save', next => {
  if (!this.createdAt) {
    this.createdAt = new Date()
  }
  next()
})

module.exports = mongoose.model('user', UserSchema)
