// SAVED EVENTS BUTTON

$("#saved-events").on("click", function() {
    location.href = "saved-events.html";
});

// Search button for artist, city, venue
const searchBtn = $("#search")

// searchBtn.on("click", getValues)

/* 
When button is cliked:
    Check toggler value 
    if live event === true:
        none of the boxes will show up as required input
        if artist, city, and venue name all entered: (or artist and city or artist and venue)
            - use ticketmaster api to search artistname, then pull out values for city and venue
            - use bandsintown api to search for artistname, then pull out values for city and venue
            - Check for duplicates and devare any duplicate events
            - sort based on date (sooner events at the top)
            - display relevant information on cards

        else if artist is not entered:
            - use only the ticketmaster api to search city or venue
            - if city and venue are entered, use city api call to then get information for venue
            - sort based on date (sooner events at the top)
            - display relevant information on cards

    else if virtual === true {
        (maybe devare the input boxes for city and venue?)
        - only search bandsintown api
        - search based on artist name, and check if virtual
        - if so, display relevant information on cards
    }
*/

function getValues(event) {
    event.preventDefault();
    var artistVal = $("#artist").val()
    ticketmasterApiCall(artistVal);

    var cityVal = $("#city").val()
    ticketmasterApiCall(cityVal);

    var venueVal = $("#venue").val()
    ticketmasterApiCall(venueVal);
}

// // TICKETMASTER API CALL

function ticketmasterApiCall(searchValue) {
    var queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + searchValue + "&apikey=jAVZgW6que5FVdtiygGWfal7FvFxA8ue"
    $.ajax({
        url: queryURL,
        method: "GET"
    })
    .then(function(response) {
        getData(response);
    });
}


function getData(response) {
    console.log(response)
    var results = response._embedded.events;

    for (var i = 0; i < results.length; i++) {
        if (results.classifications[0].segment.name === "Music") {
            var name = results.name;
            var ticketUrl = results.url;
            var priceLow = "Unknown";
            var priceHigh = "Unknown";
            if (results.priceRanges) {
                priceLow = results.priceRanges[0].min
                priceHigh = results.priceRanges[0].max
            }
            var venue = results._embedded.venues[0].name;
            var lat = results._embedded.venues[0].location.latitude;
            var long = results._embedded.venues[0].location.longitude;
            
            var date = results.dates.start.localDate;
            var time = results.dates.start.localTime;
            time = moment(time, "H").format("h A");
            date = moment(date, 'YYYY-MM-DD').format("l");

            console.log(date, time);
        }
    }
}


// BANDS IN TOWN API CALL

var artist = "coheed and cambria";

var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=test&date=upcoming";
$.ajax({
url: queryURL,
method: "GET"
})
.then(function(response) {
    if (response.length >= 1) {
        for (var i = 0; i < response.length; i++) {
            var results = response[i];
            var lineup = results.lineup;
            var ticketUrl = results.offers[0].url;
            var priceLow = "Unknown";
            var priceHigh = "Unknown";
            var venue = results.venue.name;
            var city = results.venue.city;
            if (results.artist) {
                var thumburl = results.artist.thumb_url
            }
            var dateRaw = results.datetime; 
            var time = moment(dateRaw, moment.ISO_8601).format("hh:mm A");
            var date2 = moment(dateRaw, moment.ISO_8601).format("l");
        }
    } else {
        console.log("nothing found")
    }

});





