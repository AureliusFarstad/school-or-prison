const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  cloudinary_url: process.env.CLOUDINARY_URL,
  url_origin: process.env.URL_ORIGIN,
};