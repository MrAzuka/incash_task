const {
    Router
} = require('express')
const router = Router()
const {
    createPost, getAllPosts, getPostByAuthorName, getOnePost, editPost, deletePost
} = require('../controllers/post_controller')
const { checkIfLoggedIn, checkIfRoleisAuthor } = require('../middlewares/authentication_middleware')


router.post('/new', checkIfLoggedIn, checkIfRoleisAuthor, createPost)

router.get('/', checkIfLoggedIn, getAllPosts)
router.get('/single/:id', checkIfLoggedIn, getOnePost)
router.get('/find', checkIfLoggedIn, getPostByAuthorName)

router.patch('/edit/:id', checkIfLoggedIn, checkIfRoleisAuthor, editPost)

router.delete('/delete/:id', checkIfLoggedIn, checkIfRoleisAuthor, deletePost)

module.exports = router