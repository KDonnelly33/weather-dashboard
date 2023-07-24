// define variables
var apiKey = "ba9b5baa53761336ba831c165249eb1f";
var cityName;
var citylat;
var citylon;
// function to get lat and lon from city name using geo api
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
    // set lat and lon to variables
    var citylat = response[0].lat;
    var citylon = response[0].lon;
    // call functions to get current and future weather
    fetchCurrentWeather(citylat, citylon);
    fetchForecastWeather(citylat, citylon);
    // call function to save city name to local storage
    saveStorage(cityName);
  });
}
// function to add city name to local storage
function saveStorage(cityName) {
  var cityArray = JSON.parse(localStorage.getItem("cityArray")) || [];
  // make sure the city name is not already in the array
  if (!cityArray.includes(cityName)) {
    cityArray.push(cityName);
    localStorage.setItem("cityArray", JSON.stringify(cityArray));
    renderStorage();
  }
  // make sure the cityArray is not longer than 5
  if (cityArray.length > 5) {
    cityArray.shift();
    localStorage.setItem("cityArray", JSON.stringify(cityArray));
    renderStorage();
  }
}
renderStorage();
///reads your local storage and iterates through it if there is anything in it and creates a button for each city
function renderStorage() {
  var cityArray = JSON.parse(localStorage.getItem("cityArray")) || [];
  $("#searchHistoryDisplay").empty();
  for (var i = 0; i < cityArray.length; i++) {
    var cityButton = $("<button>").text(cityArray[i]);
    // add class to button
    cityButton.addClass("cityButton");
    var cityDiv = $("<div>").addClass("cityDiv");
    cityDiv.append(cityButton);
    $("#searchHistoryDisplay").append(cityDiv);
  }
}

// function to get current weather data using lat and lon
function fetchCurrentWeather(citylat, citylon) {
  var currentURl =
    "http://api.openweathermap.org/data/2.5/weather?lat=" +
    citylat +
    "&lon=" +
    citylon +
    "&appid=" +
    apiKey +
    "&units=imperial";
  $.ajax({
    url: currentURl,
    method: "GET",
  }).then(function (response) {
    // call function to create current weather card
    createCurrentCard(response);
  });
}

// use lat and lon to get future weather data
function fetchForecastWeather(citylat, citylon) {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
    citylat +
    "&lon=" +
    citylon +
    "&appid=" +
    apiKey +
    "&units=imperial";
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    // call function to create future weather cards
    createForecastCards(response.list);
  });
}
// add event listener to search button
$("#searchButton").on("click", function (event) {
  event.preventDefault();
  // clear current and future weather cards
  $("#currentWeather").empty();
  $("#futureWeather").empty();
  // get value from search input
  var cityName = $("#city").val().trim();
  // clear search input
  $("#city").val("");
  searchGeoCode(cityName);
});

// fuction to create card container for current weather
function createCurrentCard(data) {
  var cardContainerCur = $("#currentWeather");
  var cardData = {
    temp: data.main.temp,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    iconURL: "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png",
  };
  var card = $("<div>").addClass("card");
  var image = $("<img>").attr("src", cardData.iconURL);
  var temp = $("<p>").text("Temp: " + cardData.temp + " F");
  var humidity = $("<p>").text("Humidity: " + cardData.humidity + "%");
  var windSpeed = $("<p>").text("Wind Speed: " + cardData.windSpeed + " MPH");
  var currentWeatherHeader = $("<h2>").text("Current Weather");
  card.append(currentWeatherHeader);
  card.append(image);
  card.append(temp);
  card.append(humidity);
  card.append(windSpeed);
  cardContainerCur.append(card);
}

// display 5 day forecast
function createForecastCards(data) {
  // 0 - 8 - 16 - 24 - 32
  var startingIndex;
  // iterates through to find noon
  for (var i = 0; i < data.length; i++) {
    var time = data[i].dt_txt.split(" ")[1].split(":")[0];
    if (time === "12") {
      startingIndex = i;
      break;
    }
  }
  var cardContainer = $("#futureWeather");
  for (var i = startingIndex; i < data.length; i += 8) {
    //we can hold data about each card and day in an object
    var cardData = {
      date: data[i].dt_txt.split(" ")[0],
      minTemp: data[i].main.temp_min,
      humidity: data[i].main.humidity,
      windSpeed: data[i].wind.speed,
      iconURL:
        "http://openweathermap.org/img/w/" + data[i].weather[0].icon + ".png",
    };
    //create a card for each day
    var card = $("<div>").addClass("card");
    var image = $("<img>").attr("src", cardData.iconURL);
    var temp = $("<p>").text("Temp: " + cardData.minTemp + " F");
    var humidity = $("<p>").text("Humidity: " + cardData.humidity + "%");
    var windSpeed = $("<p>").text("Wind Speed: " + cardData.windSpeed + " MPH");
    var date = $("<h3>").text(cardData.date);
    card.append(date);
    card.append(image);
    card.append(temp);
    card.append(humidity);
    card.append(windSpeed);
    //add the card the the futureWeather div
    cardContainer.append(card);
  }
}
// add event listener to search history buttons
$("#searchHistoryDisplay").on("click", function (event) {
  event.preventDefault();
  // clear current and future weather cards
  $("#currentWeather").empty();
  $("#futureWeather").empty();
  var cityName = event.target.textContent;
  searchGeoCode(cityName);
});
