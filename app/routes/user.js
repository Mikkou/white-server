const User = require('../models/user')
const bcrypt = require('bcrypt')
const nodeMailer = require('nodemailer')
const jwt = require('jsonwebtoken')
require('dotenv').config()

/*
 * POST /register to save a new user.
 */
async function register (req, res) {

  const errors = []

  if (!req.body.firstName) errors.push('Поле имя обязательно для заполнения')
  if (req.body.firstName.length > 20) errors.push('Поле имя не может содержать более 20 символов')

  if (!req.body.lastName) errors.push('Поле имя обязательно для заполнения')
  if (req.body.lastName.length > 20) errors.push('Поле имя не может содержать более 20 символов')

  if (!req.body.email) errors.push('Поле почты обязательно для заполнения')
  if (req.body.email.length > 30) errors.push('Поле почты не может содержать более 20 символов')
  if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.body.email)) errors.push('Почта невалидна')

  if (!req.body.password) errors.push('Поле пароля обязательно для заполнения')
  if (req.body.password.length >= 20 || req.body.password.length <= 8) errors.push('Поле пароля должно содержать от 8 до 20 символов')

  if ((await User.find({ email: req.body.email }, (err, res) => res)).length > 0) errors.push('Эта почта занята.')

  if (errors.length > 0) {
    res.json({ errors: errors })
    return
  }

  let newUser = new User(req.body)
  newUser.save((err) => {
    if (err) {
      res.send(err)
    } else {
      let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      })
      let mailOptions = {
        to: req.body.email,
        subject: 'Welcome to the white application!',
        body: `Your login - ${req.body.email}, password - ${req.body.password}`
      }
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error)
        }
        console.log('Message %s sent: %s', info.messageId, info.response)
      })
      res.json({ success: true })
    }
  })
}

async function login (req, res) {
  const response = res
  const result = await User.find({ email: req.body.login }, (err, res) => res)
  if (result.length === 0) {
    res.json({ error: 'Пользователя не существует.' })
    return
  }
  bcrypt.compare(req.body.password, result[0].password, (err, res) => {
    if (res) {
      const payload = { user: req.body.email }
      const options = { expiresIn: '2d', issuer: 'https://scotch.io' }
      const secret = process.env.JWT_SECRET
      const token = jwt.sign(payload, secret, options)

      response.status(200).json({ success: true, token: token })
    } else {
      response.json({ error: 'Неверный пароль.' })
    }
  })
}

async function forgot (req, res) {
  const result = await User.find({ email: req.body.email }, (err, res) => res)
  if (result.length === 0) {
    res.json({ error: 'Пользователя не существует.' })
    return
  }

  const newPassword = '' + (Math.floor(Math.random() * Math.floor(10000)))
  User.find({ email: req.body.email }, (err, user) => {
    user[0].password = newPassword
    user[0].save((err, user) => {
      let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      })
      let mailOptions = {
        to: req.body.email,
        subject: `Your new password - ${newPassword}`,
        body: `<table>
                  <tbody>
                    <tr>
                      <td>Password - ${newPassword}</td>
                    </tr>
                  </tbody>
                </table>`
      }
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error)
        }
        console.log('Message %s sent: %s', info.messageId, info.response)
      })
      res.json({ success: true })
    })
  })
}


/*
 * GET /user/:id route to retrieve a book given its id.
 */
function getUser (req, res) {
  User.findById(req.params.id, (err, book) => {
    if (err) res.send(err)
    //If no errors, send it back to the client
    res.json(book)
  })
}

/*
 * DELETE /user/:id to delete a book given its id.
 */
function deleteUser (req, res) {
  User.remove({ _id: req.params.id }, (err, result) => {
    res.json({ message: 'User successfully deleted!', result })
  })
}

/*
 * PUT /user/:id to updatea a book given its id
 */
function updateUser (req, res) {
  User.findById({ _id: req.params.id }, (err, user) => {
    if (err) res.send(err)
    Object.assign(user, req.body).save((err, user) => {
      if (err) res.send(err)
      res.json({ message: 'Book updated!', user })
    })
  })
}

//export all the functions
module.exports = { register, login, forgot, getUser, deleteUser, updateUser }
