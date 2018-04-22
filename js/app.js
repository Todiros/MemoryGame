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

    shuffleDeck();
    
    function clockHide(clock) {
        $(clock).fadeOut(1000);
    }
    function clockShow(clock) {
        $(clock).fadeIn(500);
    }

    $(".score-panel").hover(function() {
        let clock = $(".clock");
        clockShow(clock);
    }, function() {
        let clock = $(".clock");
        clockHide(clock);
    });

    function startTimer(timer) {
        timer.start();
        $(timer).on('secondsUpdated', function(e){
            let clock = $(".clock");
            $(clock).html(timer.getTimeValues().toString(['minutes', 'seconds']));

            if (timer.getTimeValues().toString(['seconds']) >= '10') {
                clockHide(clock);
            } else {
                clockShow(clock);
            }
        })
    };

    function stopTimer(timer) {
        timer.stop();
        $(".clock").html("00:00");
    }

    
    function shuffleDeck() {
        const deckEl = $(".deck");
        const deck = $(deckEl).children();

        const newDeck = shuffle(deck);

        $(deckEl).empty();
        $(deckEl).append(newDeck);
    }

    function checkMatch(card) {
        $(card).css("pointer-events", "none");
        const cardType = $( card ).children().attr('class');
        const matched = "card match";

        clickedCardsType.push(cardType);
        clickedCards.push(card);

        if (clickedCardsType.length === 2) {
            moves++;
            setMoves(moves);
            alterStars(moves);
            checkIfWon(moves, timer);

            if (clickedCardsType[0] === clickedCardsType[1]) {

                for (card of clickedCards){
                    setCardState(card, matched);
                }

                clickedCards.every(x => matchedCards.push(x)); 
                clickedCardsType = [];
                clickedCards = [];
            } else {
                resetClick(clickedCards);

                setTimeout(hideCards, 500, clickedCards);

                clickedCardsType = [];
                clickedCards = [];
            }
        } else if (clickedCardsType.length <= 1) {
            startTimer(timer);
        }
            
    }

    function resetClick(cards){
        cards.every(x => $(x).css("pointer-events", "auto")); 
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
        resetClick(matchedCards);

        matchedCards = [];
        clickedCards = [];
        clickedCardsType = [];

        stopTimer(timer);
        shuffleDeck();
    }

    function alterStars(moves) {
        const lightStar = "far fa-star";
        const solidStar = "fas fa-star";

        if ((moves >= 17) && (moves <= 24)) {
            $(stars[2]).attr("class", lightStar);
        } else if (moves >= 31) {
            $(stars[1]).attr("class", lightStar);
            $(stars[2]).attr("class", lightStar);
        } else {
            Array.prototype.forEach.call(stars, star => {
                $(star).attr("class", solidStar);
            });
        } 
    }

    function checkIfWon(moves, time) {
        if (matchedCards.length === 14) {
            const minutes = time.getTimeValues().toString(['minutes', 'seconds']);
            const gameWonText = `Congrats! You won. It took you ${moves} moves and ${minutes} minutes.`;
            
            showModal(gameWonText);
            time.pause();
        }
    }

    function showModal(msg) {
        let stars = $(".movesWrap .stars").clone();

        $(".modal").show();

        $(".endgame-stars").html(stars);
        $(".endgame-message").html(msg);

        $(".endgame-message").show();
    }

    $(".btn-exit").click(() => {
        $(".modal").hide();
    });

    $(".restart, .btn-modal").click(() => {
        $(".modal").hide();

        restartGame();
    });
    
    $('ul').on('mousedown', 'li', function() {
        showCard(this);
    }).on('mouseup', 'li', function() {
        checkMatch(this);
    });
});

