const {
    Schema,
    model
} = require('mongoose')

const commentSchema = new Schema({
    comment: {
        type: String,
        trim: true
    },
    postId: {
        type: ObjectId,
        ref: 'Post'
    },
    userId: {
        type: ObjectId,
        ref: 'User'
    },
    metadata: {
        type: Map,
        of: String
    }

}, {
    timestamps: true,
})

module.exports = model("Comment", commentSchema)