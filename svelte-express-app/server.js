const express = require("express");
const app = express();

const path = require("path");
const fs = require("fs");

let bodyParser = require("body-parser");
let db = require("./database.js");
let imgUpload = require("./img-upload.js");

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
app.set("trust proxy", true); // Client’s IP address is understood as the left-most entry in the X-Forwarded-* header

app.use(express.static("public"));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/api/card/total_count", (req, res, next) => {
  let sql = "SELECT COUNT(*) as count FROM buildings";
  let params = [];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({
        error: err.message,
      });
      return;
    }
    res.json({
      message: "success",
      data: row,
    });
  });
});

app.get("/api/card/:id", (req, res, next) => {
  let sql = "SELECT id, img_filename, building FROM buildings WHERE id = ?";
  let params = [req.params.id];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({
        error: err.message,
      });
      return;
    }
    res.json({
      message: "success",
      data: row,
    });
  });
});

app.post("/api/card", imgUpload.single("image"), (req, res, next) => {
  let errors = [];
  if (req.body.building !== "SCHOOL" && req.body.building !== "PRISON") {
    errors.push("Building type not specified correctly.");
  }
  if (!req.body.city) {
    errors.push("No city specified.");
  }
  if (!req.body.country) {
    errors.push("No country specified.");
  }
  if (!req.body.building) {
    errors.push("No building type specified.");
  }
  if (errors.length) {
    res.status(400).json({
      error: errors.join(","),
    });
    return;
  }

  let imgFileName = req.file.filename;
  let imgExtension = path.extname(imgFileName);
  let fileName = path.basename(imgFileName, imgExtension);
  let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  let data = {
    img_filename: imgFileName,
    building: req.body.building,
    city: req.body.city,
    country: req.body.country,
    source: req.body.source || "",
    upload_dt: fileName,
    upload_ip: ip,
  };

  let jsonDestination = "../database/user_uploads/" + fileName.concat(".json");
  let dataString = JSON.stringify(data);
  fs.writeFileSync(jsonDestination, dataString);

  res.json({
    message: "success",
    data: data,
  });
});

app.get("/api/vote/total_count", (req, res, next) => {
  let sql = "SELECT COUNT(*) as count FROM votes";
  let params = [];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({
        error: err.message,
      });
      return;
    }
    res.json({
      message: "success",
      data: row,
    });
  });
});

app.post("/api/vote/", (req, res, next) => {
  let errors = [];
  if (!req.body.id) {
    errors.push("No id specified.");
  }
  if (!req.body.vote) {
    errors.push("No vote specified.");
  }
  if (errors.length) {
    res.status(400).json({
      error: errors.join(","),
    });
    return;
  }

  let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  console.log("REMOTE ADDRESS")
  console.log(req.headers["x-forwarded-for"])
  console.log("X FORWARDED FOR")
  console.log(req.connection.remoteAddress)

  let data = {
    id: req.body.id,
    ip: ip,
    vote: req.body.vote,
  };

  console.log(data);

  let sql = "INSERT INTO votes (building_id, ip_address, vote) VALUES (?,?,?);";
  let params = [data.id, data.ip, data.vote];
  db.get(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({
        error: err.message,
      });
      return;
    }
    res.json({
      message: "success",
      data: data,
    });
  });
});

//Serve Svelte App
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});
