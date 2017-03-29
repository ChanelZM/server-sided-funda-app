var express = require('express');
var multer = require('multer');
var request = require('request');

var key = process.env.KEY;

var router = express.Router();
var upload = multer();

router.get('/', function(req, res, next){
    res.render('content/home');
});

router.post('/', upload.single(), function(req, res, next) {
    var location = req.body.location,
        type = req.body.type,
        minprice = req.body.minprijs,
        maxprice = req.body.maxprijs,
        minRooms = req.body.minkamers || 1,
        maxRooms = req.body.maxkamers || 10,
        priceRange = function(){
          if(maxprice == "Geen maximum"){
            return '';
          } else {
            return minprice +  '-' + maxprice + '-kamers';
          }
        };

    var URL = 'http://funda.kyrandia.nl/feeds/Aanbod.svc/json/' + key + '?type=' + type + '&zo=/' + location + '/' + priceRange + '/' + minRooms + '-' + maxRooms + '-kamers' + '/&page=1&pagesize=25';
    var URL2 = 'http://funda.kyrandia.nl/feeds/Aanbod.svc/json/' + key + '?type=' + type + '&zo=/' + location + '/' + (Number(maxprice) + 1) + '-' + (Number(maxprice) + 10000) + '/' + minRooms + '-' + maxRooms + '-kamers' + '/&page=1&pagesize=3';
    request(URL, function (error, response, data) {
        var parsedData = JSON.parse(data);
        if(maxprice == "Geen maximum"){
          res.render('results/result', {
            houses: parsedData.Objects,
            teaseHouses: "undefined"
          });
        } else {
          request(URL2, function (error, response, dat) {
            var parsedTeasedData = JSON.parse(dat);
            res.render('results/result', {
              houses: parsedData.Objects,
              teaseHouses: parsedTeasedData.Objects
            });
        });
        }

    });
});

module.exports = router;
