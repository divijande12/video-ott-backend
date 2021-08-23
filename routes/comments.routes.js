const express = require("express");
const db = "../models";
const router = express.Router();
const Comment = require("../models/comments.model");

router.post("/saveComment", (req, res) => {
  const comment = new Comment(req.body);

  comment.save((err, comment) => {
    if (err) {
      res.json({ success: false, message: err });
      return;
    }
    res.status(200).json({ success: true, message: comment });
  });
});

router.post("/getComments", (req, res) => {
  Comment.find({ video_id: req.body.video_id })
    .then((comment) => {
      res.status(200).json({ success: true, message: comment });
    })
    .catch((err) => {
      res.json({ success: false, message: err });
      console.log("error", err);
    });
});

module.exports = router;
