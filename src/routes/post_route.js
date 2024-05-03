const {
    Router
} = require('express')
const router = Router()
const {
    createPost, getAllPosts, getPostByAuthorName, getOnePost, editPost, deletePost
} = require('../controllers/post_controller')
const { checkIfLoggedIn, checkIfRoleisAuthor } = require('../middlewares/authentication_middleware')


router.post('/new-post', checkIfLoggedIn, checkIfRoleisAuthor, createPost)

router.get('/post', checkIfLoggedIn, getAllPosts)
router.get('/post/single/:id', checkIfLoggedIn, getOnePost)
router.get('/post/find', checkIfLoggedIn, getPostByAuthorName)

router.patch('/post/edit/:id', checkIfLoggedIn, checkIfRoleisAuthor, editPost)

router.delete('/post/delete/:id', checkIfLoggedIn, checkIfRoleisAuthor, deletePost)

module.exports = router