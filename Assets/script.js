var city = "Saint Paul"; 
var queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=jAVZgW6que5FVdtiygGWfal7FvFxA8ue&city=" + city;

$.ajax({
url: queryURL,
method: "GET"
})
.then(function(response) {
    console.log(response)
    var results = response._embedded.events;

    for (let i = 0; i < results.length; i++) {
        if (results[i].classifications[0].segment.name === "Music") {
            let name = results[i].name;
            let ticketUrl = results[i].url;
            let priceLow = "Unknown";
            let priceHigh = "Unknown";
            if (results[i].priceRanges) {
                priceLow = results[i].priceRanges[0].min
                priceHigh = results[i].priceRanges[0].max
            }
            let venue = results[i]._embedded.venues[0].name;
            let lat = results[i]._embedded.venues[0].location.latitude;
            let long = results[i]._embedded.venues[0].location.longitude;
            
            let date = results[i].dates.start.localDate;
            let time = results[i].dates.start.localTime;
            time = moment(time, "H").format("h A");
            date = moment(date, 'YYYY-MM-DD').format("l");
        }
    }
});

// Artist search button
const searchBtn = $("#search")
let artistVal;
let cityVal;
let venueVal;

searchBtn.on("click", getValues)

function getValues(event) {
    event.preventDefault();
    artistVal = $("#artist").val()
    cityVal = $("#city").val()
    venueVal = $("#venue").val()
}



