const {
    Router
} = require('express')
const router = Router()
const {
    userLogin,
    userRegister,
    forgetUserPassword,
    resetUserPassword,
    changeRolesToAuthor,
} = require('../controllers/authentication_controller')
const { checkIfLoggedIn } = require('../middlewares/authentication_middleware')
// POST routes
router.post('/login', userLogin)
router.post('/register', userRegister)
router.post('/forget-password', forgetUserPassword)
router.post('/reset-password/:token', resetUserPassword)
router.post('/roles', checkIfLoggedIn, changeRolesToAuthor)

module.exports = router