var apiKey = "ba9b5baa53761336ba831c165249eb1f";
var cityName;
var citylat;
var citylon;

function searchGeoCode(cityName) {
  var cordURL =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    cityName +
    "&limit=5&appid=" +
    apiKey;
  // get lat and lon from cityname using geo api
  $.ajax({
    url: cordURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    // set lat and lon to variables
    var citylat = response[0].lat;
    var citylon = response[0].lon;
    console.log(citylat);
    console.log(citylon);
    fetchCurrentWeather(citylat, citylon);
    fetchForecastWeather(citylat, citylon);
  });
}

function fetchCurrentWeather(citylat, citylon) {
  // use lat and lon to get current weather data
  var currentURl =
    "http://api.openweathermap.org/data/2.5/weather?lat=" +
    citylat +
    "&lon=" +
    citylon +
    "&appid=" +
    apiKey +"&units=imperial";
  $.ajax({
    url: currentURl,
    method: "GET",
  }).then(function (response) {
    console.log("Weather current response");
    console.log(response);
    createCurrentCard(response);
  });
}

function saveToStorage(cityName) {
    // add cityName to local storage using setItem
    var cities = JSON.parse(localStorage.getItem("cities")) || [];
    cities.push(cityName);
    localStorage.setItem("cities", JSON.stringify(cities));
    console.log(cities);
}

function renderStorage(){
    ///reads your local storage and iterates through it if there is anything in it      
    var cities = JSON.parse(localStorage.getItem("cities")) || [];
    for (var i = 0; i < cities.length; i++) {
        var city = cities[i];
        var button = $("<button>").text(city);
        $("#searchHistory").append(button);
    }
}

function fetchForecastWeather(citylat, citylon) {
  // use lat and lon to get future weather data
  var queryURL =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
    citylat +
    "&lon=" +
    citylon +
    "&appid=" +
    apiKey +"&units=imperial";
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    // console.log("Froecast response");
    // console.log(response);
    createForecastCards(response.list);
  });
}
// add event listener to search button
$("#searchButton").on("click", function (event) {
  event.preventDefault();
  // get value from search input and store in local storage
  var cityName = $("#city").val().trim();
//   console.log(cityName);
  searchGeoCode(cityName);

});


// fuction to create card container for current weather
function createCurrentCard(data) {
    console.log(data);
    var cardContainerCur = $("#currentWeather");
    console.log(cardContainerCur);
    var cardData = {
        temp: data.main.temp,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        iconURL :"http://openweathermap.org/img/w/" + data.weather[0].icon + ".png"
    }
    console.log(cardData)
    var card = $("<div>").addClass("card");
    var image = $("<img>").attr("src", cardData.iconURL);
    var temp = $("<p>").text("Temp: " + cardData.temp + " F");
    var humidity = $("<p>").text("Humidity: " + cardData.humidity + "%");
    var windSpeed = $("<p>").text("Wind Speed: " + cardData.windSpeed + " MPH");
    card.append(image)
    card.append(temp);
    card.append(humidity);
    card.append(windSpeed);
    console.log(card)
    cardContainerCur.append(card);
    
}

// display 5 day forecast
function createForecastCards(data) {
//   console.log(data);
  // 0 - 8 - 16 - 24 - 32
  var startingIndex;
  for (var i = 0; i < data.length; i++) {
    var time = data[i].dt_txt.split(" ")[1].split(":")[0];
    if (time === "12") {
      startingIndex = i;
      break;
    }
  }
  console.log(startingIndex);
  var cardContainer = $("#futureWeather");
  console.log(cardContainer);
  for (var i = startingIndex; i < data.length; i += 8) {
    //   console.log(data[i]);
      //we can hold data about each card and day in an object
      var cardData = {
          date: data[i].dt_txt.split(" ")[0],
          minTemp: data[i].main.temp_min,
          humidity: data[i].main.humidity,
          windSpeed: data[i].wind.speed,
          iconURL :"http://openweathermap.org/img/w/" + data[i].weather[0].icon + ".png"
    }
    // console.log(cardData)
    //create a card for each day
    //p tags
    var card = $("<div>").addClass("card");
    var image = $("<img>").attr("src", cardData.iconURL);
    var temp = $("<p>").text("Temp: " + cardData.minTemp + " F");
    var humidity = $("<p>").text("Humidity: " + cardData.humidity + "%");
    var windSpeed = $("<p>").text("Wind Speed: " + cardData.windSpeed + " MPH");
    var date = $("<p>").text(cardData.date);
    card.append(date);
    card.append(image)
    card.append(temp);
    card.append(humidity);
    card.append(windSpeed);
    console.log(card)
    //add the card the the futureWeather div
    cardContainer.append(card);

  }
}
