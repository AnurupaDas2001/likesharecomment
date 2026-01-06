const mongoose=require('mongoose');
const Schema=mongoose.Schema

const PostSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  }
}, { timestamps: true });


const PostModel=mongoose.model('Post',PostSchema);
module.exports=PostModel

