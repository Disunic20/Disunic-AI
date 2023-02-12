$(document).ready(function () {
    // Load JSON file with responses
    $.getJSON("responses.json", function (data) {
        // Set event listener for chat input
        $("#chatinput").keypress(function (e) {
            
            timer()
            if (e.which == 13) {
                var userInput = $("#chatinput").val();
                $("#chatlog").append("<div class='user'><p>You: " + userInput + "</p></div>");
                $("#chatinput").val("");

                // Loop through responses to find a match
                var foundResponse = false;
                for (var i = 0; i < data.responses.length; i++) {
                    var keywords = data.responses[i].keywords;
                    for (var j = 0; j < keywords.length; j++) {
                        if (userInput.toLowerCase().indexOf(keywords[j]) != -1) {
                            $("#chatlog").append("<div class='bot'><p class=''>" + data.responses[i].response + "</p></div>");
                            timer()
                            document.getElementById("hh1").style.display = "none"
                            foundResponse = true;
                            break;
                        }
                    }
                    if (foundResponse) {
                        break;
                    }
                }


                // If no response is found
                if (!foundResponse) {
                    // $("#chatlog").append("<p class='bot'>I'm sorry, I don't understand your question. Can you rephrase it or provide more information?</p>");
                    opp()
                    function opp() {
                        const xhr = new XMLHttpRequest();
                        xhr.open("GET", `https://api.duckduckgo.com/?q=` + userInput + `&format=json`);
                        xhr.onload = function () {
                            if (xhr.status === 200) {

                                const response = JSON.parse(xhr.responseText);
                                const result = response.Abstract;
                                if (result == "") {
                                    tyyy()
                                    document.getElementById("hh1").style.display = "none"
                                    // $("#chatlog").append("<p class='bot'>I'm sorry, I don't understand your question. Can you rephrase it or provide more information?</p>")
                                } else {
                                    $("#chatlog").append("<div class='bot'><p class=''>" + result + "</p></div>");
                                    timer()
                                    document.getElementById("hh1").style.display = "none"
                                }

                            }
                            else if (xhr.status === 403) {
                                console.log("fuck")
                            }
                            else {
                                $("#chatlog").append("<p class='bot'>I'm sorry, I don't understand your question. Can you rephrase it or provide more information?</p>")
                                // console.log("fuck")
                                document.getElementById("hh1").style.display = "none"
                            }
                        };
                        xhr.send();


                    }

                    function tyyy() {
                        timer()
                        var wikiApiUrl = 'https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&?redirect=fals&gsrnamespace=0&gsrlimit=1&prop=pageimages|extracts&pilimit=max&exintro&pithumbsize=400&explaintext&exsentences=8&exlimit=max&gsrsearch=' + userInput + '&callback=?';
                        $.getJSON(wikiApiUrl, function (articles) {
                            renderArticlesMarkup(articles);
                        });
                        function renderArticlesMarkup(articles) {
                            var articlesMarkup = '';
                            if (articles.query === undefined) {
                                articlesMarkup += '<div class="error"><p class="p1">Your Keyword did not match our Database 🤖</p> <p class="p2">Suggestions:</p><li>Make sure that all words are spelled correctly.</li><li>Try different keywords.</li><li>Try more general keywords.</li></div>';
                                // console.log("ddbhd")
                                document.getElementById("hh1").style.display = "none"
                                $("#chatlog").append("<p class='bot'>I'm sorry, I don't understand your question. Can you rephrase it or provide more information?</p>")
                            }
                            else {
                                var pages = articles.query.pages;
                                for (var property in pages) {
                                    if (pages.hasOwnProperty(property)) {
                                        articlesMarkup += '<div class="article" id="artical"><a id="ra" href="https://en.wikipedia.org/wiki/' + pages[property].title + '" target="_blank">' + '<h2 class="rah" id="rah">' + pages[property].title + '</h2><div class="snippet" id="ras">';
                                        if (pages[property].thumbnail !== undefined) {
                                            articlesMarkup += '<img src="' + pages[property].thumbnail.source + '">';
                                            $("#chatlog").append("<div class='bot'><img src=" + pages[property].thumbnail.source +"></div>");
                                        }
                                        articlesMarkup += '<p>' + pages[property].extract + '</p></div></div></a>';
                                        document.getElementById("hh1").style.display = "none"
                                        
                                        $("#chatlog").append("<div class='bot'><p class=''>" + pages[property].extract + "</p></div>");
                                    }
                                }
                            }
                            $('.result').html(articlesMarkup);
                            timer()
                            document.getElementById("hh1").style.display = "none"
                        }







                    }


                }
            };
        })
    })
});

function timer() {
    const El = document.getElementById('chatlog');
    setTimeout(() => {
        El.scrollTo({ top: 0, behavior: 'smooth' });
        El.scrollTo({ top: El.scrollHeight, behavior: 'smooth' });
    }, 50);
}
