'use strict';
/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


$(document).ready(function() {
    // Get stars and their classes
    let timer = new Timer();
    let moves = 0;
    let stars = $(".stars").children().children();
    let clickedCards = [];
    let clickedCardsType = [];
    let matchedCards = [];
    
    function startTimer(timer) {
        timer.start();
        $(timer).on('secondsUpdated', function(e){
            $(".clock").html(timer.getTimeValues().toString(['minutes', 'seconds']));

            if (timer.getTimeValues().toString(['seconds']) >= '10') {
                $(".clock").fadeOut(1000);
            } else {
                $(".clock").fadeIn(500);
            }
        })
    };

    function stopTimer(timer) {
        timer.stop();
        $(".clock").html("00:00");
    }

    function checkMatch(card) {
        const cardType = $( card ).children().attr('class');
        const matched = "card match";

        clickedCardsType.push(cardType);
        clickedCards.push(card);

        if (clickedCardsType.length === 2) {
            moves++;
            setMoves(moves);
            alterStars(moves);
            checkIfGameOver(moves);
            checkIfWon(moves);

            if (clickedCardsType[0] === clickedCardsType[1]) {

                for (card of clickedCards){
                    setCardState(card, matched);
                }

                clickedCards.every(x => matchedCards.push(x)); 
                clickedCardsType = [];
                clickedCards = [];
            } else {
                hideCards(clickedCards);
                clickedCardsType = [];
                clickedCards = [];
            }
        } else if (clickedCardsType.length <= 1) {
            startTimer(timer);
        }
            
    }

    function setMoves(moves) {
        $(".moves").html(moves);
    }

    function showCard(card) {
        const show = "card open show";

        $(card).attr('class', show);
    }

    function hideCards(cards) {
        const hide = "card";

        for (let card of cards) {
            $(card).attr('class', hide);
        }
    }

    function setCardState(card, state) {
        $(card).attr('class', state);
    }

    function restartGame() {
        moves = 0;
        setMoves(moves);
        alterStars(moves);
        
        hideCards(matchedCards);
        hideCards(clickedCards);
        matchedCards = [];
        clickedCards = [];
        clickedCardsType = [];

        stopTimer(timer);
    }

    function alterStars(moves) {
        const lightStar = "far fa-star";
        const solidStar = "fas fa-star";

        if ((moves >= 7) && (moves < 14)) {
            $(stars[2]).attr("class", lightStar);
        } else if ((moves >= 14) && (moves < 21)) {
            $(stars[1]).attr("class", lightStar);
            $(stars[2]).attr("class", lightStar);
        } else if (moves >= 21) {
            $(stars[0]).attr("class", lightStar);
            $(stars[1]).attr("class", lightStar);
            $(stars[2]).attr("class", lightStar);
        } else {
            Array.prototype.forEach.call(stars, star => {
                $(star).attr("class", solidStar);
            });
        } 
    }

    function checkIfGameOver(moves) {
        if (moves >= 21) {
            // TODO: change to modal 
            alert("Game Over!");
            restartGame();
        }
    }

    function checkIfWon(moves) {
        console.log(matchedCards.length);
        if (matchedCards.length === 14) {
            // TODO: change to modal 
            alert(`Congrats! You won. It took you ${moves} moves.`);
            restartGame();
        }
    }

    $(".restart").click(() => {
        restartGame();
    });
    
    $('ul').on('mousedown', 'li', function() {
        showCard(this);
    }).on('mouseup', 'li', function() {
        checkMatch(this);
    });
});

