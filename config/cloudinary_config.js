const cloudinary = require('cloudinary');

const {
    CLOUDINARY_cloud_name,
    CLOUDINARY_api_key,
    CLOUDINARY_api_secret,
} = require('./keys')

cloudinary.config({
    cloud_name: CLOUDINARY_cloud_name,
    api_key: CLOUDINARY_api_key,
    api_secret: CLOUDINARY_api_secret,
});

module.exports = {cloudinary};