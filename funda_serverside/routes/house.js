var express = require('express');
var multer = require('multer');
var request = require('request');

var key = process.env.KEY;

var router = express.Router();
var upload = multer();

router.get('/:id', function(req, res, next){
    var houseID = req.params.id;

    var URL = 'http://partnerapi.funda.nl/feeds/Aanbod.svc/json/detail/' + key + 'koop/' + houseID + '/'

    request(URL, function (error, response, data) {
        var parsedData = JSON.parse(data);
        res.render('house/house', {
            house: parsedData
        });
    });
});

module.exports = router;
