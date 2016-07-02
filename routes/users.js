var express = require('express');
var router = express.Router();

var Db = require('mongodb').Db,
  MongoClient = require('mongodb').MongoClient,
  Server = require('mongodb').Server,
  ReplSetServers = require('mongodb').ReplSetServers,
  ObjectID = require('mongodb').ObjectID,
  Binary = require('mongodb').Binary,
  GridStore = require('mongodb').GridStore,
  Code = require('mongodb').Code;

var db = new Db('geospatial', new Server("13.68.16.52", 20000,
  { auto_reconnect: true, poolSize: 4 }), { w: 0, native_parser: false });

console.log("config..") 

// Establish connection to db
db.open(function (err, db) {
  // Authenticate
  db.authenticate('dblandit', 'pilar', function (err, result) {
    console.log("mongo ready") 
    console.log(err)
     console.log(result) 
    /* GET users listing. */
    router.get('/getCell', function (req, res, next) {
      if (req.query.radio && req.query.mcc && req.query.net && req.query.area && req.query.cell) {
        console.log("go to mongo")
        db.collection('mycollection').find().toArray(function (err, items) {
          res.json(items);
        });
        /*res.json({
          "radio": req.query.radio,
          "mcc": req.query.mcc,
          "net": req.query.net,
          "area": req.query.area,
          "cell": req.query.cell,
          "range": 33,
          "samples": 3,
          "changeable": 1,
          "created": new Date("2011-03-07T08:33:12Z"),
          "updated": new Date(),
          "averageSignal": -94,
          "geometry": {
            "type": "Point",
            "coordinates": [13.285081, 52.521622]
          },
          "OID": 3
        });*/
      } else {
        console.log("this are your params")
        res.json(req.query)
        /*res.status(404);
        var err = new Error('Not Found');
        err.status = 404;
        res.render('error', {
          message: "Not Found",
          error: err
        });*/
      }
    });

    router.get('/getCellsNearPoint', function (req, res, next) {
      if (req.query.latitude && req.query.longitude) {
        res.json([{
          "radio": "UMTS",
          "mcc": 262,
          "net": 2,
          "area": 801,
          "cell": 211250,
          "range": 33,
          "samples": 3,
          "changeable": 1,
          "created": new Date("2010-08-23T13:19:34Z"),
          "updated": new Date("2011-03-07T08:33:12Z"),
          "averageSignal": -94,
          "geometry": {
            "type": "Point",
            "coordinates": [
              13.285081,
              52.521622
            ]
          },
          "OID": 3
        }, {
            "radio": "UMTS",
            "mcc": 342,
            "net": 4,
            "area": 431,
            "cell": 955251,
            "range": 35,
            "samples": 2,
            "changeable": 1,
            "created": new Date("2010-08-25T13:19:34Z"),
            "updated": new Date("2011-04-31T18:33:12Z"),
            "averageSignal": -50,
            "geometry": {
              "type": "Point",
              "coordinates": [
                15.234580,
                23.534566
              ]
            },
            "OID": 3
          }]);
      } else {
        res.json(req.query)
        /*res.status(404);
        var err = new Error('Not Found');
        err.status = 404;
        res.render('error', {
          message: "Not Found",
          error: err
        });*/
      }
    });
  });
});

/* GET users listing. */
router.get('/getCell', function (req, res, next) {
  if (req.query.radio && req.query.mcc && req.query.net && req.query.area && req.query.cell) {
    res.json({
      "radio": req.query.radio,
      "mcc": req.query.mcc,
      "net": req.query.net,
      "area": req.query.area,
      "cell": req.query.cell,
      "range": 33,
      "samples": 3,
      "changeable": 1,
      "created": new Date("2011-03-07T08:33:12Z"),
      "updated": new Date(),
      "averageSignal": -94,
      "geometry": {
        "type": "Point",
        "coordinates": [13.285081, 52.521622]
      },
      "OID": 3
    });
  } else {
    res.json(req.query)
    /*res.status(404);
    var err = new Error('Not Found');
    err.status = 404;
    res.render('error', {
      message: "Not Found",
      error: err
    });*/
  }
});

router.get('/getCellsNearPoint', function (req, res, next) {
  if (req.query.latitude && req.query.longitude) {
    res.json([{
      "radio": "UMTS",
      "mcc": 262,
      "net": 2,
      "area": 801,
      "cell": 211250,
      "range": 33,
      "samples": 3,
      "changeable": 1,
      "created": new Date("2010-08-23T13:19:34Z"),
      "updated": new Date("2011-03-07T08:33:12Z"),
      "averageSignal": -94,
      "geometry": {
        "type": "Point",
        "coordinates": [
          13.285081,
          52.521622
        ]
      },
      "OID": 3
    }, {
        "radio": "UMTS",
        "mcc": 342,
        "net": 4,
        "area": 431,
        "cell": 955251,
        "range": 35,
        "samples": 2,
        "changeable": 1,
        "created": new Date("2010-08-25T13:19:34Z"),
        "updated": new Date("2011-04-31T18:33:12Z"),
        "averageSignal": -50,
        "geometry": {
          "type": "Point",
          "coordinates": [
            15.234580,
            23.534566
          ]
        },
        "OID": 3
      }]);
  } else {
    res.json(req.query)
    /*res.status(404);
    var err = new Error('Not Found');
    err.status = 404;
    res.render('error', {
      message: "Not Found",
      error: err
    });*/
  }
});

module.exports = router;
