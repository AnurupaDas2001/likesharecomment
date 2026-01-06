const mongoose=require('mongoose');
const Schema=mongoose.Schema

const CommentSchema = new Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    comment: {
        type: String,
        required: true
    }
}, { timestamps: true });

const CommentModel=mongoose.model('Comment',CommentSchema);
module.exports=CommentModel
