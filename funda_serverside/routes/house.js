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
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        var parsedData = JSON.parse(data);
        console.log('body:', parsedData); // Print the HTML for the Google homepage.
        res.render('house/house', {
            house: parsedData
        });
    });
});

module.exports = router;