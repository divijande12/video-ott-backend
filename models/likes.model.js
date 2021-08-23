const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const like = mongoose.Schema(
    {
        user:{
            type: Schema.Types.ObjectId,
            ref: 'user',
        },
        video_id:{
            type: Schema.Types.ObjectId,
            ref: 'video',
        },
    },
    {timestamps:true}
);

const Like = mongoose.model("Like",like)
module.exports = Like;