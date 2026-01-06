const mongoose=require('mongoose');
const Schema=mongoose.Schema

const LikeSchema = new Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, { timestamps: true });

const LikeModel=mongoose.model('Like',LikeSchema);
module.exports=LikeModel
