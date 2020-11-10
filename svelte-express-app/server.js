const express = require('express');
// import express from 'express';
const app = express();

const path = require('path');
// import path from 'path'
const fs = require('fs');

const port = process.env.PORT || 5000;
var bodyParser = require('body-parser');

var db = require('./database.js');
// import { db } from './database.js'
var imgUpload = require('./img-upload.js');

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/api/card/total_count', (req, res, next) => {
  console.log("GET card total_count")
  var sql = 'SELECT COUNT(*) as count FROM buildings'
  var params = []
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({
        "error": err.message
      });
      return
    }
    res.json({
      "message": "success",
      "data": row
    })
  });
});

app.get('/api/card/:id', (req, res, next) => {
  console.log("GET card by id")
  var sql = 'SELECT id, img_filename, building FROM buildings WHERE id = ?'
  var params = [req.params.id]
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({
        "error": err.message
      });
      return
    }
    res.json({
      "message": "success",
      "data": row
    })
  });
});

app.post('/api/card', imgUpload.single('image'), (req, res, next) => {
  console.log("POST card")
  var errors = []
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
    console.log(errors)
    res.status(400).json({
      "error": errors.join(",")
    });
    return;
  }
  
    //TODO: Input sanitization

  var imgFileName = req.file.filename;
  var imgExtension = path.extname(imgFileName);
  var fileName = path.basename(imgFileName,imgExtension);
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var data = {
    img_filename: imgFileName,
    building: req.body.building,
    city: req.body.city,
    country: req.body.country,
    source: req.body.source || "",
    upload_dt: fileName,
    upload_ip: ip
  }

  var jsonDestination = '../database/user_uploads/' + fileName.concat(".json")
  let dataString = JSON.stringify(data);
  fs.writeFileSync(jsonDestination, dataString);
  
  res.json({
    "message": "success",
    "data": data
  })
})

app.get('/api/vote/total_count', (req, res, next) => {
  console.log("GET vote total_count")
  var sql = 'SELECT COUNT(*) as count FROM votes'
  var params = []
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({
        "error": err.message
      });
      return
    }
    res.json({
      "message": "success",
      "data": row
    })
  });
});

app.post('/api/vote/', (req, res, next) => {
  console.log("POST vote")
  var errors = []
  console.log(req.body)
  if (!req.body.id) {
    errors.push("No id specified.");
  }
  if (!req.body.vote) {
    errors.push("No vote specified.");
  }
  if (errors.length) {
    console.log(errors)
    res.status(400).json({
      "error": errors.join(",")
    });
    return;
  }

  //TODO: Input sanitization

  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var data = {
    id: req.body.id,
    ip: ip,
    vote: req.body.vote,
  }

  var sql = 'INSERT INTO votes (building_id, ip_address, vote) VALUES (?,?,?);'
  var params = [data.id, data.ip, data.vote]
  db.get(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({
        "error": err.message
      });
      return;
    }
    res.json({
      "message": "success",
      "data": data
    })
  });
});

//Serve Svelte App
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});
