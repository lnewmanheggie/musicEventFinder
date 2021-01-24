// SAVED EVENTS BUTTON

$("#saved-events").on("click", function () {
    location.href = "saved-events.html";
});

// virtual event toggler
$("li").on("click", function () {
    const listItem = $(this).attr("class");
    if (listItem === 'is-active') {
        $(this).removeAttr("class");
        $(this).siblings().addClass("is-active")
    } else {
        $(this).addClass("is-active")
        $(this).siblings().removeAttr("class")
    }
})

// start of location code
// start of location pull 
const locationofuser = $("#events-near-me");
let latInput;
let longInput;

locationofuser.on("click", getLocation);

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(showPosition);
    } else {
        locationofuser.text("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    // locationofuser.text("Latitude: " + position.coords.latitude + 
    // "<br>Longitude: " + position.coords.longitude)
    latInput = position.coords.latitude;
    longInput = position.coords.longitude;
    locationAPIconvert();
    // start of location conversion

}
function locationAPIconvert() {
    const queryURL = "https://us1.locationiq.com/v1/reverse.php?key=pk.ecdb52a710229c9ea2d12411c0c751c6&lat=" + latInput + "&lon=" + longInput + "&format=json"
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            var cityofuser = response.address.city

            $("#city").val(cityofuser);
            getValues();
        });
}
// end of location pull & conversion


// Regular search function
const searchBtn = $("#search");
const searchContainer = $("#search-container");
const error = $("<p>").attr("id", "error-message").addClass("has-text-centered");

searchBtn.on("click", getValues);

function getValues() {
    // check if item is virtual and if so, populate venue value with "live stream"
    const virtual = $("#virtual").attr("class")
    if (virtual === "is-active") {
        $("#venue").val("live stream");
    }


    const search = {
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

async function bandsintownApiCall(artist, city, venue) {
    const queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=test&date=upcoming";
    try {
        const response = await $.ajax({
            url: queryURL,
            method: "GET"
        })
        const events = response.map(event => ({
            name: event.lineup.join(", "),
            url: event.url,
            venue: event.venue.name,
            city: event.venue.city,
            time: moment(event.datetime).format("h:mm A"),
            date: moment(event.datetime).format("l"),
        }))
        filterEvents(events, artist, city, venue)
    } catch (error) {
        console.warn(error)
    }
}

function ticketmasterApiCall(artist, city, venue) {
    const term = city || venue
    const queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + term + "&apikey=jAVZgW6que5FVdtiygGWfal7FvFxA8ue"
    try {
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function (response) {
                const events = response._embedded.events
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
    } catch(error) {
        console.warn(error)
    }
}

// THIS FUNCTION RETURNS RELEVANT DATA
// name, url, venue, city, time, date
function filterEvents(events, artist, city, venue) {
    let filtered = events;

    if (artist) filtered = filtered.filter(x => x.name.toLowerCase().includes(artist.toLowerCase()))
    if (venue) filtered = filtered.filter(x => x.venue.toLowerCase() === venue.toLowerCase())
    if (city) filtered = filtered.filter(x => x.city.toLowerCase() === city.toLowerCase())

    createCards(filtered);
}

// CREATE THE CARDS AND POPULATE WITH RESULTS

const resultsText = $("#results-text");
const resultsBox = $("#results-box");

function createCards(filtered) {
    resultsText.empty();
    resultsBox.empty();
    // have a condition here for the number of results
    resultsText.append($("<h2 class='is-size-3'>Results</h2>"))

    const wrapper = $("<div>").addClass("notification is-primary");
    resultsBox.append(wrapper);

    for (let i = 0; i < filtered.length; i++) {
        const box = $("<div>").addClass("box mx-5 has-text-centered");
        wrapper.append(box);
        const content = $("<div>").addClass("content");
        box.append(content);
        content.append($("<h2>").text(filtered[i].name))
        content.append($("<p>").append($("<a>").attr("href", filtered[i].url).attr("target", "_blank").text("Buy Tickets")));

        const columnBox = $("<div>").addClass("columns mx-4");
        content.append(columnBox)
        columnBox.append($("<div>").addClass("column is-size-5").text(filtered[i].city));
        columnBox.append($("<div>").addClass("column is-size-5").text(filtered[i].venue));
        columnBox.append($("<div>").addClass("column is-size-5").text(filtered[i].date));
        columnBox.append($("<div>").addClass("column is-size-5").text(filtered[i].time));

        const footer = $("<footer>").addClass("card-footer");
        const saveBtn = $("<button>").addClass("button is-danger is-small is-fullwidth").text("Save").data("info", filtered[i]);
        footer.append(saveBtn);
        content.append(footer);

        // add event listner to grab the data when save btn is clicked
        saveBtn.on("click", saveDataLocalStorage);
    }
}

const getSavedEvents = () => JSON.parse(localStorage.getItem("savedEvents")) || []

const setSavedEvents = (val) => localStorage.setItem("savedEvents", JSON.stringify(val))

function saveDataLocalStorage() {
    const savedData = $(this).data("info");

    const savedEvents = getSavedEvents();

    savedEvents.push(savedData);

    setSavedEvents(savedEvents);

}

// FUNCTIONS TO SAVE EVENTS INTO LOCAL STORAGE AND GET EVENTS OUT OF LOCAL STORAGE

