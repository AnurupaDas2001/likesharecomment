const mongoose=require('mongoose');
const Schema=mongoose.Schema

const ShareSchema = new Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, { timestamps: true });


const ShareModel = mongoose.model('Share', ShareSchema);
module.exports=ShareModel
