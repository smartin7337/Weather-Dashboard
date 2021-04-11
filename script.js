  
// local storage functions
initListCity();
initWeather();

// global variables
var listCity = [];
var cityName;


// displays the city entered into the DOM
function renderCities(){
    $("#listCity").empty();
    $("#inputCity").val("");
    
    for (i=0; i<listCity.length; i++){
        var a = $("<a>");
        a.addClass("list-group-item list-group-item-action list-group-item-primary city");
        a.attr("data-name", listCity[i]);
        a.text(listCity[i]);
        $("#listCity").prepend(a);
    } 
}
// grabs the current city from local storage and then displays current weather 
function initWeather() {
    var storedWeather = JSON.parse(localStorage.getItem("currentCity"));

    if (storedWeather !== null) {
        cityName = storedWeather;

        displayWeather();
        displayFiveDayForecast();
    }
}

// grabs the city list array from local storage
function initListCity() {
    var storedCities = JSON.parse(localStorage.getItem("cities"));
    
    if (storedCities !== null) {
        listCity = storedCities;
    }
    
    renderCities();
    }


// saves the current city to local storage
function storeCurrentCity() {

    localStorage.setItem("currentCity", JSON.stringify(cityName));
}
//  saves the city array to local storage
function storeCityArray() {
    localStorage.setItem("cities", JSON.stringify(listCity));
    }

// on click event handler for city search button
$("#citySearchBtn").on("click", function(event){
    event.preventDefault();

    cityName = $("#cityInput").val().trim();
    if(cityName === ""){
        alert("Search a city")

    }else if (listCity.length >= 5){  
        listCity.shift();
        listCity.push(cityName);

    }else{
    listCity.push(cityName);
    }
    storeCurrentCity();
    storeCityArray();
    renderCities();
    displayWeather();
    displayFiveDayForecast();
});

// event handler for when the user hits enter for the city search
$("#cityInput").keypress(function(e){
    if(e.which == 13){
        $("#citySearchBtn").click();
    }
})

// runs the OWA call for current weather/city/forecast to the DOM
async function displayWeather() {

    var queryURL ="https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&units=imperial&appid=b11cce79379fda35f3b0785fbc1df214";

    var response = await $.ajax({
        url: queryURL,
        method: "GET"
      })
        console.log(response);

        var date = new Date();
        var getCurrentCity = response.name;
        var currentWeatherDiv = $("<div class='card-body' id='currentWeather'>");
        var val=(date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear();
        var getCurrentWeatherIcon = response.weather[0].icon;
        var showCurrentWeatherIcon = $("<img src = http://openweathermap.org/img/wn/" + getCurrentWeatherIcon + "@2x.png />");


        var currentCityEl = $("<h3 class = 'card-body'>").text(getCurrentCity+" ("+val+")");
        currentCityEl.append(showCurrentWeatherIcon);
        currentWeatherDiv.append(currentCityEl);
        var getTemp = response.main.temp.toFixed(1);
        var tempEl = $("<p class='card-text'>").text("Temperature: "+getTemp+"° F");
        currentWeatherDiv.append(tempEl);
        var getHumidity = response.main.humidity;
        var humidityEl = $("<p class='card-text'>").text("Humidity: "+getHumidity+"%");
        currentWeatherDiv.append(humidityEl);
        var getWindSpeed = response.wind.speed.toFixed(1);
        var windSpeedEl = $("<p class='card-text'>").text("Wind Speed: "+getWindSpeed+" mph");
        currentWeatherDiv.append(windSpeedEl);
        var getLong = response.coord.lon;
        var getLat = response.coord.lat;
        
        var OPW = "https://api.openweathermap.org/data/2.5/uvi?appid=b11cce79379fda35f3b0785fbc1df214="+getLat+"&lon="+getLong;
        var uvResponse = await $.ajax({
            url: OPW,
            method: "GET"
        })

        // getting uv info and setting colors relative to value
        var getUVIndex = uvResponse.value;
        var uvNumber = $("<span>");
        if (getUVIndex > 0 && getUVIndex <= 2.99){
            uvNumber.addClass("low");
        }else if(getUVIndex >= 3 && getUVIndex <= 5.99){
            uvNumber.addClass("moderate");
        }else if(getUVIndex >= 6 && getUVIndex <= 7.99){
            uvNumber.addClass("high");
        }else if(getUVIndex >= 8 && getUVIndex <= 10.99){
            uvNumber.addClass("vhigh");
        }else{
            uvNumber.addClass("extreme");
        } 
        uvNumber.text(getUVIndex);
        var uvIndexEl = $("<p class='card-text'>").text("UV Index: ");
        uvNumber.appendTo(uvIndexEl);
        currentWeatherDiv.append(uvIndexEl);
        $("#weatherContainer").html(currentWeatherDiv);
}

// runs the ajax call for the forecast and displays them to DOM
async function displayFiveDayForecast() {

    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q="+cityname+"&units=imperial&appid=b11cce79379fda35f3b0785fbc1df214";

    var response = await $.ajax({
        url: queryURL,
        method: "GET"
      })
      var forecastDiv = $("<div  id='fiveDayForecast'>");
      var forecastHeader = $("<h5 class='card-header border-secondary'>").text("5 Day Forecast");
      forecastDiv.append(forecastHeader);
      var cardDeck = $("<div  class='card-deck'>");
      forecastDiv.append(cardDeck);
      console.log(response);
      for (i=0; i<5;i++){
          var forecastCard = $("<div class='card mb-3 mt-3'>");
          var cardBody = $("<div class='card-body'>");
          var date = new Date();
          var val=(date.getMonth()+1)+"/"+(date.getDate()+i+1)+"/"+date.getFullYear();
          var forecastDate = $("<h5 class='card-title'>").text(val);
          
        cardBody.append(forecastDate);
        var getCurrentWeatherIcon = response.list[i].weather[0].icon;
        console.log(getCurrentWeatherIcon);
        var displayWeatherIcon = $("<img src = http://openweathermap.org/img/wn/" + getCurrentWeatherIcon + ".png />");
        cardBody.append(displayWeatherIcon);
        var getTemp = response.list[i].main.temp;
        var tempEl = $("<p class='card-text'>").text("Temp: "+getTemp+"° F");
        cardBody.append(tempEl);
        var getHumidity = response.list[i].main.humidity;
        var humidityEl = $("<p class='card-text'>").text("Humidity: "+getHumidity+"%");
        cardBody.append(humidityEl);
        forecastCard.append(cardBody);
        cardDeck.append(forecastCard);
      }
      $("#forecastContainer").html(forecastDiv);
    }

// communicates the city in the history list to displayWeather
function historyDisplayWeather(){
    cityName = $(this).attr("data-name");
    displayWeather();
    displayFiveDayForecast();
    console.log(cityName);
    
}

$(document).on("click", ".city", historyDisplayWeather);
