const {
    Schema,
    model,
    Types
} = require('mongoose')


const reactionSchema = new Schema({
    postId: {
        type: Types.ObjectId,
        ref: 'Post',
    },
    userId: {
        type: Types.ObjectId,
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