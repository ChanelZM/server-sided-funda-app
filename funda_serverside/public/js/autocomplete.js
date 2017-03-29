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
