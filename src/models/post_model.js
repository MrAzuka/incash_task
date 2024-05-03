const {
    Schema,
    model,
    Types
} = require('mongoose')

const postSchema = new Schema({
    post: {
        type: String,
        trim: true
    },
    userId: {
        type: Types.ObjectId,
        ref: 'User'
    },
    likeCount: {
        type: Number,
        default: 0,
    },
    dislikeCount: {
        type: Number,
        default: 0,
    },

    commentCount: {
        type: Number,
        default: 0,
    },
    metadata: {
        type: Map,
        of: String
    }
}, {
    timestamps: true,
})



module.exports = model("Post", postSchema)