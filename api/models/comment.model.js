const mongodb = require('mongoose')

const commentSchema = new mongodb.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    message: {
        type: String,
        require: true
    },
    userRef: {
        type: mongodb.Schema.Types.ObjectId,
        ref: 'UserModel',
        require: true
    }
}, { timestamps: true })

const CommentModel = mongodb.model('CommentModel', commentSchema)

module.exports = CommentModel