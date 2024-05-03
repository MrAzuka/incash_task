const {
    Schema,
    model
} = require('mongoose')


const reactionSchema = new Schema({
    postId: {
        type: ObjectId,
        ref: 'Post',
    },
    userId: {
        type: ObjectId,
        ref: 'User'
    },
    like: {
        type: Boolean
    },
    dislikeCount: {
        type: Boolean
    },
    metadata: {
        type: Map,
        of: String
    }
}, {
    timestamps: true,
})



module.exports = model("Reaction", reactionSchema)