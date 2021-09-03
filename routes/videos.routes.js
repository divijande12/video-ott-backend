const db = require("../models");
const express = require("express");
const route = express.Router();
const { cloudinary } = require("../config/cloudinary_config");
const Videos = require("../models/video.model");
const { response } = require("express");
const jwt = require("jsonwebtoken");
const { secret } = require("../config/auth.config");

route.post("/addVideo", (req, response) => {
  const { title, description, category, thumbnail, videoId } = req.body;
  cloudinary.v2.uploader.upload(
    thumbnail,
    {
      upload_preset: "ml_default",
      folder: "thumbnails",
      resource_type: "image",
    },
    (err, result) => {
      if (err) {
        response.json({ success: false, message: err });
      }
      Videos.findOne({ videoId: { $eq: videoId } })
        .then((res) => {
          if (res === undefined || res === null) {
            const newVideo = new Videos({
              title: title,
              description: description,
              category: category,
              thumbnail: result.public_id,
              videoId: videoId,
            });
            newVideo
              .save()
              .then((res) => {
                response.json({ success: true, video: res });
              })
              .catch((err) => {
                response.json({ success: false, message: err });
                console.log("/addvideos - catch - ", err);
              });
          } else {
            response.json({
              success: false,
              message: "Video Id already present",
            });
          }
        })
        .catch((err) => {
          response.json({ success: false, message: err });
          console.log("/addvideos - catch - ", err);
        });
    }
  );
});

route.get("/getvideos", (req, res) => {
  Videos.find()
    .then((result) => {
      res.json({ success: true, result });
    })
    .catch((err) => {
      console.log(err);
      res.json({ success: false, message: err });
    });
});

route.get("/get/:id", (req, res) => {
  const id = req.params.id;
  // console.log(req.params);
  Videos.findById(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: `Cannot find data for ${id}` });
      } else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err || `Some Error Occrured` });
    });
});

route.put("/:id", (req, res) => {
  const id = req.params.id;
  // console.log(req.params);
  if (!req.body) {
    res.satus(500).send({ message: `Data cannot be empty` });
  }
  Videos.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: `Cannot update data of ${id}` });
      } else res.send({ message: `Edited Successfully!` });
    })
    .catch((err) => {
      res.status(500).send({ message: err || `Some Error occured` });
    });
});

route.delete("/:id", (req, res) => {
  const id = req.params.id;
  Videos.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: `Cannot delete data of ${id}` });
      } else res.send({ message: `deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({ message: err || `Some error occured` });
    });
});

module.exports = route;
