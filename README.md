# Server Sided Funda app
## Introduction
In one of my other repositories (the one you can't see because it's private. I made a copy [Funda Client side](https://github.com/ChanelZM/server-sided-funda-app/tree/master/funda_clientside)) I made a Single Page Webapplication based on client-sided JavaScript. It worked fine on mobile although one problem can occur when you're using client-sided JS: your SPA may fail from time to time because JS is failing. Now why would JS fail? For numerous reasons such as: your user has JS turned off and your internet connection fails between loading html and js (more reasons [here](https://kryogenix.org/code/browser/everyonehasjs.html)). Booom! Your SPA just broke.

So what now? How are we going to build an SPA without depending on client-sided JS? You use the server. And we are in luck, because we have Node.js, server-sided JS, to help us with this job. So basically what I did is create a SPA that is written in Node.js and I'm going to tell you all about it in this readme.

## About
Funda is a platform where you can put your house up for sale or find one to buy. They have a wide offer of houses across the Netherlands and they even have vacation homes. But because of that the user has to be able to filter a lot so they will easily find a home that fits their needs and wants. Funda came to us (students of the Hogeschool van Amsterdam) for help in finding a new creative way of filtering.

Funda thought of four user stories and the one I chose was:
*As a Funda user, I want to see search results that will probably interest me, so that I will still view properties just outside the search range.*
What I created was a column at the bottom of the page after the search results that matched the users requirements with three houses that fell just outside the search range. The column has a light blue background that indicates it's not really a part of the search results. The parts that fit the users requirements have a green background with a finch and the part that doesn't fit has a orange background with a cross, so the user immediately knows what aspect of the house doesn't fit the requirements.

## How to Install
Download the zip for this repository, unzip it and type the following code into your terminal:
```
npm install
```

## How to Build
**(Install Node.js) Create a folder and navigate to that folder with your terminal. Type in the following code:**
```
npm init
```
**Install these packages**
```
express
body-parser
multer
nodemon
path
request
ejs
dotenv
```
**by using the terminal**
```
npm install --save <package>
```
**Create an app.js, public folder, routes folder and views folder.**
Require the packages, create the needed paths, js files and ejs files.

**API Call**
In the script for the homepage create a post:
```javascript
router.post('/', upload.single(), function(req, res, next) {}
```
Inside the post get the information from the form to make an API call
```javascript
var location = req.body.location,
    type = req.body.type,
    minprice = req.body.minprijs,
    maxprice = req.body.maxprijs,
    minRooms = req.body.minkamers || 1,
    maxRooms = req.body.maxkamers || 10;
```
Then use request to make an API call. The first parameter should be the URL from the API
```javascript
request(URL, function (error, response, data) {}
```
Inside the request you can tell what to do with the data
```javascript
var parsedData = JSON.parse(data);
res.render('results/result', {
    houses: parsedData.Objects
});
```

## Performance
