let User = require('../models/user')

/*
 * GET /users route to retrieve all the books.
 */
function getUsers (req, res) {
  //Query the DB and if no errors, send all the books
  let query = User.find({})
  query.exec((err, books) => {
    if (err) res.send(err)
    //If no errors, send them back to the client
    res.json(books)
  })
}

/*
 * POST /auth to save a new book.
 */
function postUser (req, res) {
  //Creates a new book
  let newUser = new User(req.body)
  //Save it into the DB.
  newUser.save((err, user) => {
    if (err) {
      res.send(err)
    } else { //If no errors, send it back to the client
      res.json({ message: 'User successfully added!', user })
    }
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
module.exports = { getUsers, postUser, getUser, deleteUser, updateUser }
