// Put all the js for the saved events page in here
function getSavedEvents() {
    return JSON.parse(localStorage.getItem("savedEvents")) || []
}

createCards();


function createCards(){
    var getSaved = getSavedEvents();

    var savedEventsBox = $("#saved-events-box");
    savedEventsBox.empty();
    var wrapper = $("<div>").addClass("notification is-primary");
    savedEventsBox.append(wrapper);

    if (getSaved.length > 0) {
        for (let i = 0; i < getSaved.length; i++) {
            
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
            var delBtn = $("<button>").addClass("button is-info is-small is-fullwidth").text("Delete").data("info", getSaved[i]);
            footer.append(delBtn);
            content.append(footer);

            // delete button 
            delBtn.on("click", function() {
                

                var delData = $(this).data("info");
                var index = getSaved.indexOf(delData)
                getSaved.splice(index, 1);

                setSavedEvents(getSaved);

                var deleteCard = $(this).parent().parent().parent();
                deleteCard.remove();
            })
        }
    } else {
        wrapper.append($("<h3>").addClass("has-text-centered is-size-5").text("No saved events"))
    }
}

function setSavedEvents(val) {
    localStorage.setItem("savedEvents", JSON.stringify(val))
}
