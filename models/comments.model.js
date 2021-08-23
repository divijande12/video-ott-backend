const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const comment = mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    video_id: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    comment: {
      type: String,
    },
    username: {
      type: String,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", comment);
module.exports = Comment;
