
var apiKey = "ba9b5baa53761336ba831c165249eb1f";
var cityName;
var citylat;
var citylon;

// add event listener to search button
$("#searchButton").on("click", function (event) {
    event.preventDefault();
    // get value from search input and store in local storage
    var cityName = $("#city").val();
    localStorage.setItem("city", cityName);
    console.log(cityName);
    var cordURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=5&appid=" + apiKey;
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
        // use lat and lon to get weather data
        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + citylat + "&lon=" + citylon + "&appid=" + apiKey;
        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function (response) {
            console.log(response);
        })
    });

    // display current weather data
    // display 5 day forecast

})

