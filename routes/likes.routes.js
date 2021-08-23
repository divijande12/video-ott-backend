const express = require("express");
const router = express.Router();
const Like = require("../models/likes.model");
const Dislike = require("../models/dislikes.model");

router.post("/getLikes", (req, res) => {
  Like.find({ video_id: req.body.video_id })
    .then((like) => {
      res.status(200).json({ success: true, message: like });
    })
    .catch((err) => {
      res.json({ success: false, message: err });
      console.log("error", err);
    });
});

router.post("/getDisLikes", (req, res) => {
  Dislike.find({ video_id: req.body.video_id })
    .then((dislike) => {
      res.status(200).json({ success: true, message: dislike });
    })
    .catch((err) => {
      res.json({ success: false, message: err });
      console.log("error", err);
    });
});

router.post("/uplike", (req, res) => {
  const like = new Like({ user: req.body.user, video_id: req.body.video_id });
  like.save((err, like) => {
    if (err) return res.json({ success: false, err });
    // res.status(200).json({ success: true, message: like });
    Dislike.findOneAndDelete({
      user: req.body.user,
      video_id: req.body.video_id,
    }).exec((err, dislike) => {
      if (err) return res.status(400).json({ success: false, err });
      res.status(200).json({ success: true, message: like });
    });
  });
});

router.post("/unlike", (req, res) => {
  Like.findOneAndDelete({
    user: req.body.user,
    video_id: req.body.video_id,
  }).exec((err, result) => {
    if (err) return res.status(400).json({ success: false, message: err });
    res.status(200).json({ success: true });
  });
});

router.post("/updislike", (req, res) => {
  const dislike = new Dislike({
    user: req.body.user,
    video_id: req.body.video_id,
  });
  dislike.save((err, dislike) => {
    if (err) return res.json({ success: false, err });
    // res.status(200).json({ success: true, message: dislike });
    Like.findOneAndDelete({
      user: req.body.user,
      video_id: req.body.video_id,
    }).exec((err, like) => {
      if (err) return res.status(400).json({ success: false, err });
      res.status(200).json({ success: true, message: dislike });
    });
  });
});

router.post("/undislike", (req, res) => {
  Dislike.findOneAndDelete({
    user: req.body.user,
    video_id: req.body.video_id,
  }).exec((err, result) => {
    if (err) return res.status(400).json({ success: false, message: err });
    res.status(200).json({ success: true });
  });
});

module.exports = router;
