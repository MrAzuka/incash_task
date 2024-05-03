const {
    Schema,
    model,
    Types
} = require('mongoose')

const commentSchema = new Schema({
    comment: {
        type: String,
        trim: true
    },
    postId: {
        type: Types.ObjectId,
        ref: 'Post'
    },
    userId: {
        type: Types.ObjectId,
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