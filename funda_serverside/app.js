//Require node modules
require('dotenv').config();

var express = require('express');
var ejs = require('ejs');
var path = require('path');
var request = require('request');
var bodyParser = require('body-parser');
var multer = require('multer');
//var critical = require('critical');
var compression = require('compression');

var app = express();

app.use(compression({threshold: 0, filter: function(){return true;}}));
app.use(express.static(path.join(__dirname, 'public')));

var homeRouter = require('./routes/home');
var generalError = require('./routes/error404');
var houseRouter = require('./routes/house');

//Routes
app.use('/', homeRouter);
app.use('/house', houseRouter);
app.use('/*', generalError);

//Views is the same as browser request
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

/*critical.generate({
  inline: false,
  base: './views/content',
  src: 'home.ejs',
  css: 'public/style/style.css',
  width: 1300,
  height: 900,
  dest: 'public/style/home-critical.css',
  minify: true,
  extract: true
});*/

app.listen(3000, function () {
    console.log("Running at port 3000")
});
