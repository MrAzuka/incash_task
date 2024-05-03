const Post = require('../models/post_model')
const User = require("../models/user_model");

exports.createPost = async (req, res) => {
    try {
        const { id } = req.user
        const { post } = req.body

        await Post.create({
            post: post,
            userId: id
        })

        return res.status(201).send({
            success: true,
            message: "Post created"
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            error
        });
    }
}

exports.editPost = async (req, res) => {
    try {
        const { id } = req.user
        const { post } = req.body

        // check if user is author of the post
        // req.params.id is the mongo id of the post
        let findPost = await Post.findOne({ _id: req.params.id, userId: id })

        if (!findPost) {
            return res.status(404).send({
                success: false,
                message: "Post not found"
            });
        }

        await Post.updateOne({ _id: req.params.id, userId: id }, { post: post })

        return res.status(200).send({
            success: true,
            message: "Post updated"
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            error
        });
    }
}

exports.getAllPosts = async (req, res) => {
    try {
        // TODO: Add query strings to search for articles by author's username
        const data = await Post.find().populate('userId')
        res.status(200).json({
            success: true,
            message: "All Posts",
            data: data
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            error
        })
    }
}
exports.getOnePost = async (req, res) => {
    try {
        const data = await Post.findById(req.params.id)
        res.status(302).json({
            success: true,
            message: "Get One post with id",
            data: data
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            error
        })
    }
}

exports.getPostByAuthorName = async (req, res) => {
    try {
        const { name } = req.query
        let user = await User.findOne({ username: name })
        if (!user) {
            res.status(400).send({
                success: false,
                message: "Author not found",
            })
        }
        const data = await Post.find({ userId: user._id })
        res.status(200).send({
            success: true,
            message: "All Posts for Author",
            data: data
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            error
        })
    }
}


exports.deletePost = async (req, res) => {
    try {
        const { id } = req.user

        // check if user is author of the post
        // req.params.id is the mongo id of the post
        let findPost = await Post.findOne({ _id: req.params.id, userId: id })

        if (!findPost) {
            return res.status(404).send({
                success: false,
                message: "Post not found"
            });
        }

        const getArticle = await Post.findByIdAndDelete(findPost._id)
        res.status(200).send({
            success: true,
            message: "Post Deleted"
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            error
        })
    }
}