(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
document.querySelector('#location').addEventListener('keyup', function(){
  getInput();
});

function getInput(){
  var location = document.querySelector('#location').value;
  var type = document.querySelector('input[name="type"]:checked').value;
  makeUrl(location, type);
}

function makeUrl(location, type){
  var url = 'http://zb.funda.info/frontend/geo/suggest/?query=' + location + '&max=7&type=' + type;
  callApi(url);
}

function callApi(url){
  var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random())
  createScript(url, callbackName);
}

function createScript(url, callbackName){
  var script = document.createElement('script')
  script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName
  document.body.appendChild(script)
  removeScript(callbackName, script);
}

function removeScript(callbackName, script){
  window[callbackName] = function(data) {//Credits to Colin and Elton
       delete window[callbackName]
       document.body.removeChild(script)
       renderAutosuggest(data)
   }
}

function renderAutosuggest(data){
  var autocompleteList = document.querySelector('.autocompletelist > ul');
  autocompleteList.innerHTML = '';
  document.querySelector('#location').setAttribute("autocomplete","off");

  for(var i=0; i < data.Results.length; i++){
    autocompleteList.innerHTML += '<li>' + data.Results[i].Display.Naam + '</li>';
  }

  console.log(document.querySelector('#location').value);
  if(!document.querySelector('#location').value){
    document.querySelector('.autocompletelist').style.display = "none";
  } else{
    document.querySelector('.autocompletelist').style.display = "block";
  }
}

},{}],2:[function(require,module,exports){
var autocomplete = require('./autocomplete.js');

console.log('Enhance');

},{"./autocomplete.js":1}]},{},[2]);
