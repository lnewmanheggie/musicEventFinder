// SAVED EVENTS BUTTON

$("#saved-events").on("click", function() {
    location.href = "saved-events.html";
});

// grab search button 
var searchBtn = $("#search");
var searchContainer = $("#search-container")

var virtual = false;

if (virtual === false) {
    searchBtn.on("click", getValuesLive);
} else {
    searchBtn.on("click", getValuesVirtual);
}



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
        (maybe delete the input boxes for city and venue?)
        - only search bandsintown api
        - search based on artist name, and check if virtual
        - if so, display relevant information on cards
    }
*/

var resultsArray = [];

function getValuesLive(event) {
    event.preventDefault();
    $("#error-message").remove(); // removes the error message if there is one

    // use .trim() to get rid of extra spaces that a user might enter on accident

    var artistVal = $("#artist").val();
    artistVal = artistVal.trim(); 
    console.log(artistVal)

    var cityVal = $("#city").val();
    cityVal = cityVal.trim();
    console.log(cityVal)

    var venueVal = $("#venue").val();
    venueVal = venueVal.trim();
    console.log(venueVal)



    // HOW TO GET ONE FUNCTION TO EXECUTE AND THEN ANOTHER??


    if (artistVal != "" && cityVal === "" && venueVal === "") {  // only artist is filled in
        ticketmasterApiCall(artistVal)
        bandsintownApiCall(artistVal)
        console.log(objArray)
        
        
        // search array for duplicates
        // create cards
    } else if (artistVal != "" && cityVal != "" && venueVal === "") { // artist and city are filled in
        ticketmasterApiCall(artistVal);
        bandsintownApiCall(artistVal);
        // search array for duplicates and see if items match cityVal
        // create cards
    } else if (artistVal != "" && cityVal === "" && venueVal != "") { // artist and venue are filled in
        ticketmasterApiCall(artistVal);
        bandsintownApiCall(artistVal);
        // search array for duplicates and see if items match venueVal
        // create cards
    } else if (artistVal === "" && cityVal != "" && venueVal === "") { // if only city filled in
        ticketmasterApiCall(cityVal);
        // create cards
    } else if (artistVal === "" && cityVal === "" && venueVal != "") {
        ticketmasterApiCall(venueVal);
        // create cards
    }
    else {
        var error = $("<p>").attr("id", "error-message").addClass("has-text-centered").text("You may search by artist, city, or venue, or artist + any other value")
        searchContainer.append(error)
    }

}

function getValuesVirtual(event) {
    event.preventDefault();
    $("#error-message").remove();  // removes the error message if there is one

    var artistValVirtual = $("#artist").val();
    artistValVirtual = artistValVirtual.trim();
    bandsintownApiCall(artistValVirtual);

    if ($("#city").val() != "" || $("#venue").val() != "") {
        var error = $("<p>").attr("id", "error-message").addClass("has-text-centered").text("City and venue not valid for virtual events")
        searchContainer.append(error)
    }
}

// CREATE AN EMPTY ARRAY TO PUSH OBJECTS

var objArray = [];


// // TICKETMASTER API CALL

function ticketmasterApiCall(searchVal) {
    var queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + searchVal + "&apikey=jAVZgW6que5FVdtiygGWfal7FvFxA8ue"
    $.ajax({
        url: queryURL,
        method: "GET"
    })
    .then(function(response) {
        getDataTicketmaster(response);
    });
}

function getDataTicketmaster(response) {
    console.log("ticketmaster", response)
    var results = response._embedded.events;
    var error = $("<p>").attr("id", "error-message").addClass("has-text-centered").text("Nothing found")
  
    if (results.length >= 1) {
        for (var i = 0; i < results.length; i++) {
            if (results[i].classifications[0].segment.name === "Music") {

                // create an object
                var tktmstrObj = {
                    name: "",
                    ticketUrl: "",
                    priceLow: "Unknown",
                    priceHigh: "Unknown",
                    thumburl: "",
                    venue: "",
                    city: "",
                    lat: "",
                    lon: "",
                    date: "",
                    time: ""
                }

                tktmstrObj.name = results[i].name;
                tktmstrObjticketUrl = results[i].url;
                if (results.priceRanges) {
                    tktmstrObj.priceLow = results[i].priceRanges[0].min
                    tktmstrObj.priceHigh = results[i].priceRanges[0].max
                }
                tktmstrObj.thumburl = results[i].images[0].url;
                tktmstrObj.venue = results[i]._embedded.venues[0].name;
                tktmstrObj.city = results[i]._embedded.venues[0].city.name;
                tktmstrObj.lat = results[i]._embedded.venues[0].location.latitude;
                tktmstrObj.lon = results[i]._embedded.venues[0].location.longitude;
                var date = results[i].dates.start.localDate;
                var time = results[i].dates.start.localTime;
                tktmstrObj.time = moment(time, "H").format("h A");
                tktmstrObj.date = moment(date, 'YYYY-MM-DD').format("l");
    
                var seen = false;
                if (objArray.length != 0) {
                    for (let i = 0; i < objArray.length; i++) {
                        if (tktmstrObj.date === objArray[i].date && tktmstrObj.city === objArray[i].city) {
                            seen = true;
                        }
                    }
                    if (seen === false) {
                        objArray.push(tktmstrObj);
                    }
                } else {
                    objArray.push(tktmstrObj);
                }
            }
        }
    }
}

// BANDS IN TOWN API CALL

function bandsintownApiCall(searchVal) {
    var queryURL = "https://rest.bandsintown.com/artists/" + searchVal + "/events?app_id=test&date=upcoming";
    $.ajax({
    url: queryURL,
    method: "GET"
    })
    .then(function(response) {
        getDataBandsintown(response)
    });
}

function getDataBandsintown(response) {
    console.log("bandsintown", response)
    if (response.length >= 1) {
        for (var i = 0; i < response.length; i++) {

            // create an object
            var bndsObj = {
                name: "",
                ticketUrl: "",
                priceLow: "Unknown",
                priceHigh: "Unknown",
                thumburl: "",
                venue: "",
                city: "",
                lat: "",
                lon: "",
                date: "",
                time: ""
            }

            var results = response[i];
            bndsObj.name = results.lineup;
            bndsObj.ticketUrl = results.offers[0].url;
            bndsObj.venue = results.venue.name; // use this to check if live stream
            bndsObj.city = results.venue.city;
            if (results.artist) {
                bndsObj.thumburl = results.artist.thumb_url
            }
            var dateRaw = results.datetime; 
            bndsObj.time = moment(dateRaw, moment.ISO_8601).format("hh:mm A");
            bndsObj.date = moment(dateRaw, moment.ISO_8601).format("l");

            // push to array
            var seen = false;
            if (objArray.length != 0) {
                for (let i = 0; i < objArray.length; i++) {
                    if (bndsObj.date === objArray[i].date) {
                        seen = true;
                    }
                }
                if (seen === false) {
                    objArray.push(bndsObj);
                }
            } else {
                objArray.push(bndsObj);
            }
        }
    }
}



// function createCards(name, ticketUrl, priceLow, priceHigh, venue, date, time) {
    // function to dynamically create cards from api data
// }