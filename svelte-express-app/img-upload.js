const multer = require("multer");
const path = require("path");

const IMGDIR = "../database/user_uploads/images/";
const maxSize = 4 * 1024 * 1024;

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, IMGDIR);
  },
  fileFilter: function (req, file, cb) {
    var ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
      return cb(new Error("Only images are allowed"));
    }
    cb(null, true);
  },
  filename: function (req, file, cb) {
    var id = Date.now() + path.extname(file.originalname);
    cb(null, id);
  },
});

var upload = multer({
  storage: storage,
  limit: { filesize: maxSize },
});

module.exports = upload;
