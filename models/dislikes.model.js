const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dislike = mongoose.Schema(
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

const Dislike = mongoose.model("Dislike",dislike)
module.exports = Dislike;