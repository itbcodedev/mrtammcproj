const express = require("express");
const csvjson = require('csvjson');
const router = express.Router();
const fs = require('fs');
const multer = require("multer");
const loadConfigfile = require('../configfile');
const now = new Date();
let filename = "";

let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/";


const store = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "configfiles/");
  },
  filename: (req, file, cb) => {
    filename = file.originalname;
    cb(
      null,
      now
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "") +
      "-" +
      file.originalname
    );
  }
});

// Accept a single file with the name fieldname
var upload = multer({
  storage: store
});

router.post("/:filename", (req, res, next) => {
  let filename = req.params.filename;
  let singlefile = upload.single(filename);
  singlefile(req, res, error => {
    if (error) {
      res.status(501).json({
        error: "upload error"
      });
    } else {
      console.log('The filename is ' + res.req.file.filename);
      const reply = {
        message: 'success',
        path: 'configfiles/',
        origin: filename,
        filename: res.req.file.filename
      }
      console.log(reply);
      res.send(reply)
    }
  });
});

router.get("/view/:filename", async (req, res) => {
  let filename = req.params.filename;
  console.log(filename);
  const jsonfile = await loadConfigfile(filename);
  console.log(jsonfile)
  res.json(jsonfile);
});

router.get("/deployconfig/:filename", (req, res) => {
  let filename = req.params.filename;
  let oldfile = "configfiles/" + filename;
  let targetfile = "feed/" + filename.split('-')[1];
  let backupfile = "backupfeed/" + filename.split('-')[1];

  // backup file first
  fs.rename(targetfile, backupfile, (err) => {
    if (err) {
      if (err.code == 'ENOENT') {
        console.log(err);
      }
    } else {
      res.json({
        message: "Backup Success"
      });
    }
  });

  // copy note rename
  fs.copyFileSync(oldfile, targetfile, (err) => {
    if (err) {
      if (err.code == 'ENOENT') {
        console.log(err);
      }
    } else {
      res.json({
        message: "Success Deploy"
      });
    }
  });
});


router.get("/delete/:filename", (req, res) => {
  let filename = req.params.filename;

  let fullpath = './configfiles/' + filename
  console.log("delete file:")
  console.log(fullpath);
  // fs.readdir('.', function(err, files) {
  //  console.log(files);
  //});

  fs.unlink(fullpath, (err) => {
    if (err) {
      res.json({
        message: "File cannot access"
      })
    } else {
      res.json({
        message: "File Access"
      })
    }
  })


});

router.get("/savedb/:filename", (req, res) => {
  let filename = req.params.filename;
  const csvFilePath = `./configfiles/${filename}`
  const csv = require('csvtojson');
  csv()
    .fromFile(csvFilePath)
    .then((jsonObj) => {
      console.log("jsonObj");
      console.log(jsonObj);

      if (jsonObj && jsonObj.length) {
        MongoClient.connect(url, {
          useNewUrlParser: true
        }, (err, db) => {
          if (err) throw err;
          var dbo = db.db("mmcmrtadb");
          dbo.collection(`${filename}`).insertMany(jsonObj, (err, res) => {
            if (err) throw err;
            console.log("Number of documents inserted: " + res.insertedCount);
            db.close();
          });
        });

        res.send({
          message: 'success insert obj db',
          error: 0
        });

      } else {
        console.log('blank db')
        res.send({
          message: 'fail insert  db because there is no record in file',
          error: 1
        });
      }

    });
});

router.post("/liveupdate/:filename", (req, res) => {
  let filename = req.params.filename;
  let data = JSON.stringify(req.body,null,2);
  // console.log(filename)
  // console.log(data)
  const csvData = csvjson.toCSV(data, {
    headers: 'key'
  });
  fs.writeFileSync("./configfiles/" + filename, csvData, (err) => {
    // if (err) throw err;
    // console.log('Saved!');
    if (err) {
      throw err
    } else {
      // console.log('Saved!');
    }
  });

  res.send({
    message: 'Live update..' + filename,
    error: 0
  });
});

module.exports = router;
