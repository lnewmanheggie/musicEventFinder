// SAVED EVENTS BUTTON

$("#saved-events").on("click", function() {
    location.href = "saved-events.html";
});


// TICKETMASTER API CALL

var queryUrlVenue = "https://app.ticketmaster.com/discovery/v2/venues.json?keyword=" + venueVal + "&apikey=jAVZgW6que5FVdtiygGWfal7FvFxA8ue"
var queryURLCity = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=jAVZgW6que5FVdtiygGWfal7FvFxA8ue&city=" + cityVal;

$.ajax({
url: queryURL,
method: "GET"
})
.then(function(response) {
    console.log(response)
    var results = response._embedded.events;

    for (var i = 0; i < results.length; i++) {
        if (results[i].classifications[0].segment.name === "Music") {
            var name = results[i].name;
            var ticketUrl = results[i].url;
            var priceLow = "Unknown";
            var priceHigh = "Unknown";
            if (results[i].priceRanges) {
                priceLow = results[i].priceRanges[0].min
                priceHigh = results[i].priceRanges[0].max
            }
            var venue = results[i]._embedded.venues[0].name;
            var lat = results[i]._embedded.venues[0].location.latitude;
            var long = results[i]._embedded.venues[0].location.longitude;
            
            var date = results[i].dates.start.localDate;
            var time = results[i].dates.start.localTime;
            time = moment(time, "H").format("h A");
            date = moment(date, 'YYYY-MM-DD').format("l");
        }
    }
});

// Search button for artist, city, venue
const searchBtn = $("#search")
var artistVal;
var cityVal;
var venueVal;

searchBtn.on("click", getValues)

function getValues(event) {
    event.preventDefault();
    artistVal = $("#artist").val()
    cityVal = $("#city").val()
    venueVal = $("#venue").val()
}



// start of location pull

var locationofuser = document.getElementById("location");

function getLocation() {
    
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(showPosition);
  } else { 
    locationofuser.innerHTML = "Geolocation is not supported by this browser.";
  }
}
    
function showPosition(position) {
    locationofuser.innerHTML="Latitude: " + position.coords.latitude + 
    "<br>Longitude: " + position.coords.longitude;
    console.log(position)
}
// end of location pull


// getlocationbyId