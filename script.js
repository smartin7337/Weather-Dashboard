  
// local storage functions
initCityList();
initWeather();

// global variable declarations
var listCity = [];
var cityname;


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
        cityname = storedWeather;

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

    localStorage.setItem("currentCity", JSON.stringify(cityname));
}
//  saves the city array to local storage
function storeCityArray() {
    localStorage.setItem("cities", JSON.stringify(listCity));
    }

// on click event handler for city search button
$("#citySearchBtn").on("click", function(event){
    event.preventDefault();

    cityname = $("#cityInput").val().trim();
    if(cityname === ""){
        alert("Search a city")

    }else if (listCity.length >= 5){  
        listCity.shift();
        listCity.push(cityname);

    }else{
    listCity.push(cityname);
    }
    storeCurrentCity();
    storeCityArray();
    renderCities();
    displayWeather();
    displayFiveDayForecast();
});


