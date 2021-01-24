// Put all the js for the saved events page in here
const getSavedEvents = () => JSON.parse(localStorage.getItem("savedEvents")) || [];
const setSavedEvents = (val) => localStorage.setItem("savedEvents", JSON.stringify(val))

createCards();

function createCards(){
    const getSaved = getSavedEvents();

    const savedEventsBox = $("#saved-events-box");
    savedEventsBox.empty();
    const wrapper = $("<div>").addClass("notification is-primary");
    savedEventsBox.append(wrapper);

    if (getSaved.length > 0) {
        for (let i = 0; i < getSaved.length; i++) {
            
            const box = $("<div>").addClass("box mx-5 has-text-centered");
            wrapper.append(box);
            const content = $("<div>").addClass("content");
            box.append(content);
            content.append($("<h2>").text(getSaved[i].name))
            content.append($("<p>").append($("<a>").attr("href", getSaved[i].url).text("Buy Tickets")));
            
            const columnBox = $("<div>").addClass("columns mx-4");
            content.append(columnBox)
            columnBox.append($("<div>").addClass("column is-size-5").text(getSaved[i].city));
            columnBox.append($("<div>").addClass("column is-size-5").text(getSaved[i].venue));
            columnBox.append($("<div>").addClass("column is-size-5").text(getSaved[i].date));
            columnBox.append($("<div>").addClass("column is-size-5").text(getSaved[i].time));

            const footer = $("<footer>").addClass("card-footer");
            const delBtn = $("<button>").addClass("button is-info is-small is-fullwidth").text("Delete").data("info", getSaved[i]);
            footer.append(delBtn);
            content.append(footer);

            // delete button 
            delBtn.on("click", function() {
                const delData = $(this).data("info");
                const index = getSaved.indexOf(delData)
                getSaved.splice(index, 1);

                setSavedEvents(getSaved);

                const deleteCard = $(this).parent().parent().parent();
                deleteCard.remove();
                wrapper.append($("<h3>").addClass("has-text-centered is-size-5").text("No saved events"))
            })
        }
    } else {
        wrapper.append($("<h3>").addClass("has-text-centered is-size-5").text("No saved events"))
    }
}


