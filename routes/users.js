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

const DEFAULT_ENDPOINT_RETURN_LIMIT = 25;

var url = 'mongodb://dblandit:pilar@13.68.16.52:20000/geospatial?authMechanism=DEFAULT&authSource=admin';
MongoClient.connect(url, function (err, db) {
  console.log("Connected correctly to server");

  router.get('/getCell', function (req, res, next) {
    var params = {
      radio: req.query.radio,
      mcc: parseInt(req.query.mcc),
      net: parseInt(req.query.net),
      area: parseInt(req.query.area),
      cell: parseInt(req.query.cell)
    }
    if (params.radio && !isNaN(params.mcc) && !isNaN(params.net) && !isNaN(params.area) && !isNaN(params.cell)) {
      console.log('searching for cell with:')
      console.log(params)
      db.collection('FC_Cell_towers').findOne(params, function (err, item) {
        if (item) {
          res.json(item);
        } else {
          res.status(404);
          var err = {
            message: 'Cell not found for the given params',
            code: 4041,
            searchByParams: params,
          }
          res.json(err);
        }
      });
    } else {
      sendMissingParamsResponse(res, params);
    }
  });

  router.get('/getCellsNearPoint', function (req, res, next) {
    var params = {
      latitude: parseFloat(req.query.latitude),
      longitude: parseFloat(req.query.longitude),
      maximumDistance: req.query.maximumDistance ? parseInt(req.query.maximumDistance) : 10000,
      limit: req.query.limit ? parseInt(req.query.limit) : DEFAULT_ENDPOINT_RETURN_LIMIT,
      skip: req.query.skip ? parseInt(req.query.skip) : 0
    }
    if (!isNaN(params.latitude) && !isNaN(params.longitude)) {
      console.log('searching for cell near point:')
      console.log(params)
      db.collection('FC_Cell_towers').find(
          { 'geometry':
            { $near :
              { $geometry:
                { type: "Point",  coordinates: [ params.latitude, params.longitude ] },
                  $maxDistance: params.maximumDistance
              }
            }
          }
          ).skip(params.skip).limit(params.limit).toArray(function(err, docs) {
            console.log('found:')
            console.log(docs)
            res.json(docs);
          });
    } else {
      sendMissingParamsResponse(res, params);
    }
  });
});

function sendMissingParamsResponse(res, params) {
  res.status(422);
  var err = {
    message: 'Missing or invalid param',
    code: 4221,
    extractedParams: params,
  }
  res.json(err);
  console.log(err);
}

module.exports = router;
