const mongoose =require('mongoose');

const schema = mongoose.Schema({
    title: String,
    description: String,
    category: String,
    videoId: String,
    thumbnail: String,


});

schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });


  const Videos = mongoose.model('videos',schema);
  module.exports = Videos;