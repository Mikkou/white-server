const { Router } = require('express')
let user = require('./user')

const router = Router()

router.post('/v1/register', user.register)
router.post('/v1/login', user.login)
router.post('/v1/forgot', user.forgot)

router.get('/v1/user/:id', user.getUser)
router.delete('/v1/user/:id', user.deleteUser)
router.put('/v1/user/:id', user.updateUser)

module.exports = router
