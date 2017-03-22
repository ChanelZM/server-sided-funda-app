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
        maxRooms = req.body.maxkamers || 10;
    
    var URL = 'http://funda.kyrandia.nl/feeds/Aanbod.svc/json/' + key + '?type=' + type + '&zo=/' + location + '/' + minprice + '-' + maxprice + '/' + minRooms + '-' + maxRooms + '-kamers' + '/&page=1&pagesize=25';
    
    request(URL, function (error, response, data) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        var parsedData = JSON.parse(data);
        res.render('results/result', {
            houses: parsedData.Objects
        });
    });
});

module.exports = router;