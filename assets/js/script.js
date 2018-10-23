$(function() {
    let games = ["Mario", "Zelda", "Call Of Duty", "FIFA", "Fallout", "Sims"];
    let limit = 10;
    let rating = "PG";
    let offset = 0;
    let times = 0;
    let currentData;

    renderFav()
    renderButtons()

    //render buttons
    function renderButtons() {
        games.forEach(function(element) {
            let button = $("<button>")
            button.addClass("gameBtn")
            button.text(element)
            $(".btn-container").append(button);
        })
        addClickHandler()
    }

    //render Fav buttons    
    function renderFav() {
        $(".favourite").empty()
        if(localStorage) {
            let favImages = JSON.parse(localStorage.getItem("favImages"))
            if (!favImages) {
                return
            }
            Object.keys(favImages).forEach(function(key) {
                let newGifDiv = createGif(favImages[key], "Remove", removeFromFav)
                $(".favourite").append(newGifDiv)
            });
        } else {
            alert('Cannot Fav in Private mode!')
        }
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

    //single gif data
    function createGif(el, favText, favCallback) {
        let gifDiv = $("<div class='gif-container'>")
        let gifImg = $("<img src='" + el.images.fixed_height_still.url + "' class='gifImage'>")
        gifImg.attr("status", "still")
        gifImg.attr("still-data", el.images.fixed_height_still.url)
        gifImg.attr("animated-data", el.images.fixed_height.url)
        let gifRating = $("<p class='gifRating'>")
        gifRating.html("Rating: " + el.rating)
        let gifTitle = $("<p class='gifTitle'>")
        gifTitle.html("Title: " + el.title)
        let download = $("<a href='" + el.images.fixed_height.url + "' download>")
        let downloadBtn = $("<button class='downBtn'>")
        downloadBtn.text("Download Now")
        let favouriteBtn = $("<button class='favBtn'>")
        favouriteBtn.text(favText)
        favouriteBtn.click(function() {
            favCallback(el)
        })
        download.append(downloadBtn)
        gifDiv.append(gifImg).append(gifRating).append(gifTitle).append(download).append(favouriteBtn)
        return gifDiv
    }

    //still or animated
    function changeStatus() {
        $(".gifImage").on("click", function() {
            if ($(this).attr("status") === "still") {
                $(this).attr("status", "animated");
				$(this).attr("src", $(this).attr("animated-data"));
            } else {
                $(this).attr("status", "still");
				$(this).attr("src", $(this).attr("still-data"));
            }
        })
    }

    //get data
    function getAPI(selectedGame) {

        offset += 10 * times

        let queryURL =  "https://api.giphy.com/v1/gifs/search?api_key=ZW3MGvr8tjASErfr3PEVyXPF93WiQx2B&q=" + selectedGame + "&limit=" + limit + "&offset=" + offset + "&rating=" + rating + "&lang=en"

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            let result = response.data
            result.forEach(function(element) {
                let newGifDiv = createGif(element, "Add to Favourite", addToFav)
                $("#populates").append(newGifDiv)
            })
            changeStatus()
            
        })
    }

    //show data
    function addClickHandler() {
        $(".gameBtn").on("click",function() {
            $("#populates").empty()
            $(".moreGif").empty()
            limit = 10
            times = 0
            let data = $(this).text()
            currentData = $(this).text()
            getAPI(data)
            showMoreBtn()
            showMoreGifs()
        })
    }

    //show more gifs
    function showMoreGifs() {
        $(".moreGifBtn").on("click", function() {
            $(".moreGif").empty()
            times++
            getAPI(currentData)
            showMoreBtn()
            showMoreGifs()
        })
    }

    //submit
    $("#submit").on("click", function() {
        event.preventDefault()
        let userInput = $("#game").val().trim()
        pushInput(userInput)
    })

    //add more gifs
    function showMoreBtn() {
        let showMoreGif = $("<button class='moreGifBtn'>")
        showMoreGif.text("Show More")
        $(".moreGif").append(showMoreGif)
    }

    //store image to localStorage
    function addToFav(el) {
        if(localStorage) {
            let favImages = JSON.parse(localStorage.getItem("favImages"))
            if (!favImages) {
                favImages = {}
            }
            favImages[el.id] = el
            localStorage.setItem('favImages', JSON.stringify(favImages))
            renderFav()
        } else {
            alert('Cannot Fav in Private mode!')
        }
    }

        //store image to localStorage
    function removeFromFav(el) {
        if(localStorage) {
            let favImages = JSON.parse(localStorage.getItem("favImages"))
            delete favImages[el.id]
            localStorage.setItem('favImages', JSON.stringify(favImages))
            renderFav()
        } else {
            alert('Cannot Fav in Private mode!')
        }
    }
})