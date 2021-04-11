  
// local storage functions
initCityList();
initWeather();

// global variable declarations
var listCity = [];
var cityName;


// displays the city entered into the DOM
function renderCities(){
    $("#listCity").empty();
    $("#inputCity").val("");
    
    for (i=0; i<cityList.length; i++){
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
function initCityList() {
    var storedCities = JSON.parse(localStorage.getItem("cities"));
    
    if (storedCities !== null) {
        listCity = storedCities;
    }
    
    renderCities();
    }


// saves the "currently" city display to local storage
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

// runs the Open Weather API call for current weather/city and forecast to the DOM
async function displayWeather() {

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=d3b85d453bf90d469c82e650a0a3da26";

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
        
        var OPW = "https://api.openweathermap.org/data/2.5/uvi?appid=d3b85d453bf90d469c82e650a0a3da26&lat="+getLat+"&lon="+getLong;
        var uvResponse = await $.ajax({
            url: OPW,
            method: "GET"
        })
