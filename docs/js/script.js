/*jslint browser: true, devel: true, eqeq: true, plusplus: true, sloppy: true, vars: true, white: true*/
(function(){
    var app = {
        init: function(){
            document.querySelector('.zoeken').addEventListener('submit', function(event){
                event.preventDefault();
                location.hash = '#zoekresultaten';
            });
    
            routes.init();
        }
    };

    var routes = {
        init: function(){
            routie({
                'zoekresultaten' : function(){
                    getUserInput();
                }
            });
        }
    };
    
    function getUserInput(){
        //When an error occured and user submits again, hide error
        document.querySelector('#loadingscreen').hidden = false;
        document.querySelector('#zoekresultaten').hidden = false;
        document.querySelector('#error').hidden = true;
        
        var place = document.querySelector('#location').value || 'heel-nederland',
            minPriceDropDown = document.querySelector('#min-prijs'),
            maxPriceDropDown = document.querySelector('#max-prijs'),
            minPrice = minPriceDropDown.options[minPriceDropDown.selectedIndex].value,
            maxPrice = maxPriceDropDown.options[maxPriceDropDown.selectedIndex].value,
            minRooms = document.querySelector('#minkamers').value,
            maxRooms = document.querySelector('#maxkamers').value,
            rooms = (function(){
                if(minRooms == '' && maxRooms == ''){
                    return '';
                } else if(minRooms == '' && maxRooms != ''){
                    return '0-' + maxRooms + '/';
                } else if(minRooms != '' && maxRooms == ''){
                    return minRooms + '+kamers/';
                } else if(minRooms > maxRooms) {
                    console.log('bla');
                    return maxRooms + '-' + maxRooms + '-kamers/';
                } else {
                    return minRooms + '-' + maxRooms + '-kamers/';
                }
            })(),
            type = document.querySelector('input[name="type"]:checked').value;
        
        data.getExact(place, minPrice, maxPrice, type, rooms);
    }
    
    var data = {
        getExact: function(location, minprice, maxprice, typeOfHouse, rooms){
            var url = {
                base : 'http://funda.kyrandia.nl/feeds/Aanbod.svc/json/',
                type : '?type=',
                query : '&zo=',
                page : '&page=1',
                pagesize : '&pagesize='
            };
            
            var userInput = {
                type: typeOfHouse,
                place: location,
                minPrice: minprice,
                maxPrice: maxprice,
                amountOfRooms: rooms
            };
            
            var newUrl = url.base + key + url.type + typeOfHouse + url.query + '/' + location + '/' + minprice + '-' + maxprice + '/' + rooms + url.page + url.pagesize + '25';
            
            console.log(newUrl);

            aja()
            .method('get')
            .url(newUrl)
            .on('200', function(exactData){
                if(exactData.Objects.length == 0){
                    var noResults = '<p class="errormessage">Er zijn geen resultaten gevonden die overeen komen met jouw zoekopdracht.</p>';
                    sections.fail(noResults);
                } else {
                    //sections.render(data);
                    data.getTeaser(key, url, userInput, exactData);
                }
            })
            .on('error', function(){
                document.querySelector('#zoekbalk').hidden = true;
                var noData = '<h1>Oops...</h1><h2>Er is iets misgegaan</h2><p class="errormessage">Op dit moment hebben we problemen met het tonen van de huizen. Probeer het later nog eens.</p>';
                sections.fail(noData);
            })
            .go();
        },
        getTeaser: function(apiKey, urlComponents, inputValues, apiData){
            var newURL = urlComponents.base + apiKey + urlComponents.type + inputValues.type + urlComponents.query + '/' + inputValues.place + '/' + Number(inputValues.maxPrice) + '-' + (Number(inputValues.maxPrice) + 20000) + '/' + inputValues.amountOfRooms + urlComponents.page + urlComponents.pagesize + '3';
            
            console.log(newURL);
            //(Number(inputValues.minPrice) - 10000)
            
            aja()
            .method('get')
            .url(newURL)
            .on('200', function(teaserData){
                if(teaserData.Objects.length == 0){
                    sections.render(apiData);
                    console.log('Couldnt get teaserdata');
                } else {
                    sections.render(apiData, teaserData);
                }
            })
            .on('error', function(){
                document.querySelector('#zoekbalk').hidden = true;
                var noData = '<h1>Oops...</h1><h2>Er is iets misgegaan</h2><p class="errormessage">Op dit moment hebben we problemen met het tonen van de huizen. Probeer het later nog eens.</p>';
                sections.fail(noData);
            })
            .go();
        }
    };

    var sections = {
        render: function(data1, data2){
            var livingArea, rooms;

            var directives = {
                pictureofhouse : {
                    src: function(){
                        return this.FotoLarge;
                    }
                },
                streetandnumber : {
                    text: function(){
                        return this.Adres;
                    }
                },
                zipcodeandcity : {
                    text: function(){
                        return this.Postcode + ' ' + this.Woonplaats;
                    }
                },
                price : {
                    html: function(){
                        return this.PrijsGeformatteerdHtml;
                    }
                },
                livingareaandrooms : {
                    text: function(){
                        
                        if(this.Woonoppervlakte != null){livingArea = this.Woonoppervlakte + ' m2';}
                        else if (this.Perceeloppervlakte != null){livingArea = this.Perceeloppervlakte + ' m2';}
                        else {livingArea = '';}
                        
                        if(this.AantalKamers == null){rooms = '';} else {rooms = this.AantalKamers + ' kamers';}
                        
                        return livingArea + '  ●  ' + rooms;
                    }
                },
                livingarea : {
                    text: function(){
                        return livingArea;
                    }
                },
                rooms : {
                    text: function(){
                        return rooms;
                    }
                }
            };
            
            Transparency.render(document.querySelector('.houses > div'), data1.Objects, directives);
            Transparency.render(document.querySelector('.ookinteressant > div'), data2.Objects, directives);
            
            document.querySelector('#loadingscreen').hidden = true;
            
            document.querySelector('.zoeken').addEventListener('submit', function(){
                getUserInput();
            });
            
            location.href = '#zoekresultaten';
        },
        fail : function(errorMessage){
            document.querySelector('#loadingscreen').hidden = true;
            document.querySelector('#zoekresultaten').hidden = true;
            document.querySelector('#error').hidden = false;
            document.querySelector('#error').innerHTML = errorMessage;
            
            document.querySelector('.zoeken').addEventListener('submit', function(){
                getUserInput();
            });
            location.href = '#error';
        }
    };

    app.init();
})();