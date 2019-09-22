const { Router } = require('express')
let user = require('./user')

const router = Router()

router.get('/v1/auth', user.getUsers)
router.post('/v1/auth', user.postUser)

router.get('/v1/user/:id', user.getUser)
router.delete('/v1/user/:id', user.deleteUser)
router.put('/v1/user/:id', user.updateUser)

module.exports = router
