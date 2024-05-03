const {
    Router
} = require('express')
const router = Router()
const {
    createComment, getAllCommentsOnAPost, editComment, deleteComment
} = require('../controllers/comment_controller')
const { checkIfLoggedIn, checkIfRoleisAuthor } = require('../middlewares/authentication_middleware')


router.post('/new/:postId', checkIfLoggedIn, createComment)

router.get('/:postId', checkIfLoggedIn, getAllCommentsOnAPost)

router.patch('/edit/:commentId', checkIfLoggedIn, editComment)

router.delete('/delete/:commentId', checkIfLoggedIn, deleteComment)

module.exports = router