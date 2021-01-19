// Put all the js for the saved events page in here
function getSavedEvents() {
    return JSON.parse(localStorage.getItem("savedEvents")) || []
}

createCards();


function createCards(){
    var getSaved = getSavedEvents();

    var savedEventsBox = $("#saved-events-box");
    var wrapper = $("<div>").addClass("notification is-primary");
    savedEventsBox.append(wrapper);

    if (getSaved.length > 0) {
        
        savedEventsBox.empty();
    
        
       

        for (let i = 0; i < getSaved.length; i++) {
            console.log(getSaved[i])
            var box = $("<div>").addClass("box mx-5 has-text-centered");
            wrapper.append(box);
            var content = $("<div>").addClass("content");
            box.append(content);
            content.append($("<h2>").text(getSaved[i].name))
            content.append($("<p>").append($("<a>").attr("href", getSaved[i].url).text("Buy Tickets")));
            
            var columnBox = $("<div>").addClass("columns mx-4");
            content.append(columnBox)
            columnBox.append($("<div>").addClass("column is-size-5").text(getSaved[i].city));
            columnBox.append($("<div>").addClass("column is-size-5").text(getSaved[i].venue));
            columnBox.append($("<div>").addClass("column is-size-5").text(getSaved[i].date));
            columnBox.append($("<div>").addClass("column is-size-5").text(getSaved[i].time));

            var footer = $("<footer>").addClass("card-footer");
            var saveBtn = $("<button>").addClass("button is-info is-small is-fullwidth").text("Delete").data("info", getSaved[i]);
            footer.append(saveBtn);
            content.append(footer);

            // add event listner to grab the data when save btn is clicked
            saveBtn.on("click", function() {
                var savedData = $(this).data("info");
                // put the data into local storage
            })
        }
    } else {
        wrapper.append($("<h3>").addClass("has-text-centered is-size-5").text())
    }

    
}
