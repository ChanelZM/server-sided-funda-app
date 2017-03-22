var express = require('express');

var router = express.Router();

router.get('/', function(req, res, next){
    res.render('error/generalerror', {
       title: 'Pagina niet gevonden'
    });
});

module.exports = router;