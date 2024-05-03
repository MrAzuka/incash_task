const Post = require('../models/post_model')
const User = require("../models/user_model")
const Comment = require("../models/comment_model")

exports.createComment = async (req, res) => {
    try {
        const { id } = req.user
        const { comment } = req.body
        const { postId } = req.params

        await Comment.create({
            postId: postId,
            userId: id,
            comment: comment
        })

        return res.status(201).send({
            success: true,
            message: "Comment created"
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            error
        });
    }
}

exports.editComment = async (req, res) => {
    try {
        const { id } = req.user
        const { comment } = req.body
        const { commentId } = req.params
        console.log(commentId)
        // check if user is author of the comment
        // req.params.id is the mongo id of the comment
        let findComment = await Comment.findOne({ _id: commentId, userId: id })

        if (!findComment) {
            return res.status(404).send({
                success: false,
                message: "Comment not found"
            });
        }

        await Comment.updateOne({ _id: req.params.id, userId: id }, { comment: comment })

        return res.status(200).send({
            success: true,
            message: "comment updated"
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            error
        });
    }
}

exports.getAllCommentsOnAPost = async (req, res) => {
    try {
        const { postId } = req.params
        const data = await Comment.find({ postId: postId })
        res.status(200).json({
            success: true,
            message: "All Comments for the post",
            data: data
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            error
        })
    }
}

exports.deleteComment = async (req, res) => {
    try {
        const { id } = req.user
        const { commentId } = req.params

        // check if user is author of the comment
        // req.params.id is the mongo id of the comment
        let findComment = await Comment.findOne({ _id: commentId })

        if (!findComment) {
            return res.status(404).send({
                success: false,
                message: "Comment not found"
            });
        }
        // Check if the personing making this request is the owner of the
        // post that recieved the comment.
        // Or the author of the comment. They are both allowed to delete the comment
        let findAuthorOfPost = await Post.findOne({ _id: findComment.postId }).populate('userId')
        let user = (JSON.stringify(id) === JSON.stringify(findComment.userId)) || (JSON.stringify(id) === JSON.stringify(findAuthorOfPost.userId._id))

        if (!user) {
            res.status(400).send({
                success: false,
                message: "Cannot Delete comment"
            })
        }
        await Comment.findByIdAndDelete(findComment._id)
        res.status(200).send({
            success: true,
            message: "Comment Deleted"
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            error
        })
    }
}