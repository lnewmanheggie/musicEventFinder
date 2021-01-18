// SAVED EVENTS BUTTON

$("#saved-events").on("click", function() {
    location.href = "saved-events.html";
});

// grab search button 
var searchBtn = $("#search");
var searchContainer = $("#search-container");
var error = $("<p>").attr("id", "error-message").addClass("has-text-centered");

var virtual = false;

// relevant data will go in here and then be sorted

// check toggler to see if virtual is true

searchBtn.on("click", getValues);

function getValues(event) {
    event.preventDefault();
    $("#error-message").remove(); // removes the error message if there is one

    // use .trim() to get rid of extra spaces that a user might enter on accident

    var artistVal = $("#artist").val();
    artistVal = artistVal.trim(); 

    var cityVal = $("#city").val();
    cityVal = cityVal.trim();

    var venueVal = $("#venue").val();
    venueVal = venueVal.trim();


    if (virtual === false) {
        if (artistVal) {
            var res = bandsintownApiCall(artistVal);
            console.log(res)
            
            // if array is empty throw error
            // if (cityVal) {
                
            // } else if (venueVal) {
                
            // } else {
            //     // display cards
            // }
        } else if (cityVal && artistVal === "" && venueVal === "") {
            ticketmasterApiCall(cityVal);
            

        } else if (venueVal && artistVal === "" && cityVal === "") {
            ticketmasterApiCall(venueVal);
            

        } else {
            error.text("You may search by artist, city, or venue, or artist + any other value");
            searchContainer.append(error);
        }
    } 
    else {
        if (artistVal != "" && cityVal === "" && venueVal === "") {
            bandsintownApiCall(artistVal)
            // if array is empty throw error
            // search for virtual events
            // create cards
        } else {
            error.text("City and venue not valid for virtual events");
            searchContainer.append(error);
        }
    }
}



// // TICKETMASTER API CALL

function ticketmasterApiCall(searchVal) {
    var queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + searchVal + "&apikey=jAVZgW6que5FVdtiygGWfal7FvFxA8ue"
    $.ajax({
        url: queryURL,
        method: "GET"
    })
    .then(function(response) {
        console.log("ticketmaster", response)

    var results = response._embedded.events;


    var resultsArray1 = [];

    for (var i = 0; i < results.length; i++) {
        if (results[i].classifications[0].segment.name === "Music") {

            // create an object
            var tktmstrObj = {
                name: "",
                url: "",
                thumburl: "",
                venue: "",
                city: "",
                lat: "",
                lon: "",
                date: "",
                time: ""
            }

            tktmstrObj.name = results[i].name;
            tktmstrObj.url = results[i].url;
            tktmstrObj.thumburl = results[i].images[0].url;
            tktmstrObj.venue = results[i]._embedded.venues[0].name;
            tktmstrObj.city = results[i]._embedded.venues[0].city.name;
            tktmstrObj.lat = results[i]._embedded.venues[0].location.latitude;
            tktmstrObj.lon = results[i]._embedded.venues[0].location.longitude;
            var date = results[i].dates.start.localDate;
            var time = results[i].dates.start.localTime;
            tktmstrObj.time = moment(time, "H").format("h A");
            tktmstrObj.date = moment(date, 'YYYY-MM-DD').format("l");

            resultsArray1.push(tktmstrObj);
            
        }
    }

    // return resultsArray;
    });
}

// BANDS IN TOWN API CALL

function bandsintownApiCall(searchVal) {
    var queryURL = "https://rest.bandsintown.com/artists/" + searchVal + "/events?app_id=test&date=upcoming";
    $.ajax({
    url: queryURL,
    method: "GET"
    })
    .then(function(response) {
        var resultsArray2 = [];
        
        for (var i = 0; i < response.length; i++) {

            // create an object
            var bndsObj = {
                name: "",
                url: "",
                thumburl: "",
                venue: "",
                city: "",
                date: "",
                time: ""
            }
    
            var results = response[i];
            bndsObj.name = results.lineup;
            bndsObj.url = results.url;
            
            bndsObj.venue = results.venue.name; // use this to check if live stream
            bndsObj.city = results.venue.city;
            if (results.artist) {
                bndsObj.thumburl = results.artist.thumb_url
            }
            var dateRaw = results.datetime; 
            bndsObj.time = moment(dateRaw, moment.ISO_8601).format("hh:mm A");
            bndsObj.date = moment(dateRaw, moment.ISO_8601).format("l");
    
            // push to array
            resultsArray2.push(bndsObj);
        }

        // console.log(resultsArray2)
        return resultsArray2;
        
    });
    
}




// function createCards(name, ticketUrl, priceLow, priceHigh, venue, date, time) {
    // function to dynamically create cards from api data
// }