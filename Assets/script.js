// SAVED EVENTS BUTTON

$("#saved-events").on("click", function () {
    location.href = "saved-events.html";
});

// virtual event toggler
$("li").on("click",function(){
    var listItem =  $(this).attr("class");
    if(listItem === 'is-active'){
        $(this).removeAttr("class");
        $(this).siblings().addClass("is-active")
    }else{
        $(this).addClass("is-active")
        $(this).siblings().removeAttr("class")
    }

})

// grab search button 
var searchBtn = $("#search");
var searchContainer = $("#search-container");
var error = $("<p>").attr("id", "error-message").addClass("has-text-centered");

searchBtn.on("click", getValues);

function getValues() {
    // check if item is virtual and if so, populate venue value with "live stream"
    var virtual = $("#virtual").attr("class")
    if (virtual === "is-active") {
        $("#venue").val("live stream");
    } 
        
    
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

var resultsText = $("#results-text");
var resultsBox = $("#results-box");

function createCards (filtered){
    resultsText.empty();
    resultsBox.empty();
    // have a condition here for the number of results
    resultsText.append($("<h2>").addClass("is-size-3").text("Results"))
    var wrapper = $("<div>").addClass("notification is-primary");
    resultsBox.append(wrapper);

    for (let i = 0; i < filtered.length; i++) {
        var box = $("<div>").addClass("box mx-5 has-text-centered");
        wrapper.append(box);
        var content = $("<div>").addClass("content");
        box.append(content);
        content.append($("<h2>").text(filtered[i].name))
        content.append($("<p>").append($("<a>").attr("href", filtered[i].url).text("Buy Tickets")));
        
        var columnBox = $("<div>").addClass("columns mx-4");
        content.append(columnBox)
        columnBox.append($("<div>").addClass("column is-size-5").text(filtered[i].city));
        columnBox.append($("<div>").addClass("column is-size-5").text(filtered[i].venue));
        columnBox.append($("<div>").addClass("column is-size-5").text(filtered[i].date));
        columnBox.append($("<div>").addClass("column is-size-5").text(filtered[i].time));

        var footer = $("<footer>").addClass("card-footer");
        var saveBtn = $("<button>").addClass("button is-danger is-small is-fullwidth").text("Save").data("info", filtered[i]);
        footer.append(saveBtn);
        content.append(footer);

        // add event listner to grab the data when save btn is clicked
        saveBtn.on("click", saveDataLocalStorage);
        
        
        function saveDataLocalStorage() {
            var savedData = $(this).data("info");

            var savedEvents = getSavedEvents();

            savedEvents.push(savedData);

            setSavedEvents(savedEvents);
            
        }
    }
}



// FUNCTIONS TO SAVE EVENTS INTO LOCAL STORAGE AND GET EVENTS OUT OF LOCAL STORAGE

function getSavedEvents() {
    return JSON.parse(localStorage.getItem("savedEvents")) || []
}

function setSavedEvents(val) {
    localStorage.setItem("savedEvents", JSON.stringify(val))
}
