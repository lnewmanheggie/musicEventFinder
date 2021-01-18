// SAVED EVENTS BUTTON

$("#saved-events").on("click", function () {
    location.href = "saved-events.html";
});

// grab search button 
var searchBtn = $("#search");
var searchContainer = $("#search-container");
var error = $("<p>").attr("id", "error-message").addClass("has-text-centered");

var virtual = false;    // use this when we get the toggler working

searchBtn.on("click", getValues);

function getValues() {
    var search = {  
        artist: $("#artist").val() || false,
        city: $("#city").val() || false,
        venue: $("#venue").val() || false
    }

    if (!(search.artist || search.city || search.venue)) { // if everything is empty
        error.text("You may search by artist, city, or venue, or by artist + one other value");
        searchContainer.append(error)
        return;
    }      

    if (search.artist) {
       return bandsintownApiCall(search.artist, search.city, search.venue)
    }
    ticketmasterApiCall(search.artist, search.city, search.venue)

}

function bandsintownApiCall(artist, city, venue) {
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=test&date=upcoming";
    $.ajax({
        url: queryURL,
        method: "GET"
    })
    .then(function (response) {
        var events = response.map(event => ({
            name: event.lineup.join(", "),
            url: event.url,
            venue: event.venue.name,
            city: event.venue.city,
            time: moment(event.datetime).format("h:mm A"),
            date: moment(event.datetime).format("l"),
        }))
        filterEvents(events, artist, city, venue)
    });
}

function ticketmasterApiCall(artist, city, venue) {
    var term = city || venue
    var queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + term + "&apikey=jAVZgW6que5FVdtiygGWfal7FvFxA8ue"
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            var events = response._embedded.events
                .filter(event => event.classifications[0].segment.name === "Music")
                .map(event => ({
                    name: event.name,
                    url: event.url,
                    venue: event._embedded.venues[0].name,
                    city: event._embedded.venues[0].city.name,
                    time: moment(event.dates.start.localTime, "HH:mm").format("h:mm A"),
                    date: moment(event.dates.start.localDate, "YYYY-MM-DD").format("l"),
                }))
            filterEvents(events, artist, city, venue)
        });
}

// THIS FUNCTION RETURNS RELEVANT DATA- USE TO CREATE THE CARDS
// name, url, venue, city, time, date
function filterEvents(events, artist, city, venue) {
    let filtered = events;

    if (artist) filtered = filtered.filter(x => x.name.toLowerCase().includes(artist.toLowerCase()))
    if (venue) filtered = filtered.filter(x => x.venue.toLowerCase() === venue.toLowerCase())
    if (city) filtered = filtered.filter(x => x.city.toLowerCase() === city.toLowerCase())

    createCards(filtered);
}

function createCards (filtered){
    for (let i = 0; i < filtered.length; i++) {
        console.log(filtered[i].name)
        
    }
}



// function createCards(name, ticketUrl, priceLow, priceHigh, venue, date, time) {
// function to dynamically create cards from api data
// }