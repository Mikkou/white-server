let express = require('express')
let app = express()
let mongoose = require('mongoose')
require('dotenv').config()
let bodyParser = require('body-parser')
const apiRoutes = require('./app/routes/api-routes')
let port = 8080

let options = {
  server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
}

mongoose.connect(process.env.DBHost, options)
let db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.text())
app.use(bodyParser.json({ type: 'application/json' }))

app.use('/api', apiRoutes)

app.get('/', (req, res) => res.json({ message: 'Welcome to our Bookstore!' }))

app.listen(port)
console.log('Listening on port ' + port)

module.exports = app
