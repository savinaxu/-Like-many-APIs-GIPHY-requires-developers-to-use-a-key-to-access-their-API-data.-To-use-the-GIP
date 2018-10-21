$(function() {
    let games = ["Mario", "Zelda", "Call Of Duty", "FIFA", "Fallout", "Sims"]
    let limit = 10
    let rating = "PG"
    let offset = 0

    //render buttons
    function renderButtons() {
        games.forEach(function(element) {
            let button = $("<button>")
            button.addClass("gameBtn")
            button.text(element)
            $(".btn-container").append(button);
        })
    }

    //push input
    function pushInput(game) {
        if (!games.includes(game)) {
            games.push(game)
            $(".btn-container").empty()
            renderButtons()
            $("#game").val("")
        }
    }

    //get data
    function getAPI(selectedGame) {

        let queryURL =  "https://api.giphy.com/v1/gifs/search?api_key=ZW3MGvr8tjASErfr3PEVyXPF93WiQx2B&q=https://api.giphy.com/v1/gifs/search?api_key=ZW3MGvr8tjASErfr3PEVyXPF93WiQx2B&q=" + selectedGame + "&limit=" + limit + "&offset=" + offset + "&rating=" + rating + "&lang=en"

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            console.log(response.data)
        })
    }

    //show data
    $(".gameBtn").on("click",function() {
        $("#populates").empty()
        let data = $(this).text()
        getAPI(data)
    })

    //submit
    $("#submit").on("click", function() {
        event.preventDefault()
        let userInput = $("#game").val().trim()
        pushInput(userInput)
    })

    renderButtons()

})