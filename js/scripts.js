let card_values = ['australia', 'bolivia', 'california', 'hawaii', 'italy', 'norway', 'paris', 'china']; // cards saved in array so that we can easily have access to them 

let state; // Game state (see restart).
let disabled = false; // Clicking disabled (during animation).

let rating, timer, moves; // Interface elements (not to be confused with state).    // line from 2-7 has global variable which can be accessed from anywhere in the code 



function shuffle(cards) { // Fisher-Yates shuffle.      // function has a parameter (cards) which can be accessed withing function shuffle, called local scope 
        for (let i = cards.length - 1; i > 0; --i) {  
                let j = Math.floor((i + 1) * Math.random()); // Math.floor along with Math.random are JavaScript defined functions which randomly shuffles cards and returns cards value which will be store in variable 'j'
                let temp = cards[i];
                cards[i] = cards[j];  
                cards[j] = temp; 
        }
        return cards; 
}



function update_rating() { // regular function  with no parameters 
        rating.textContent = state.moves < 16 ? '★★★' : state.moves < 24 ? '★★' : '★'; // .textContent property is used to get the content of the 'state' variable and combination with global variable moves will print
} // stars based on number of moves user makes. You used Conditional (ternary) Operator to test it condition  

function update_timer() {
        timer.textContent = Math.round((performance.now() - state.start) / 1000); // where did we get 'performance' from ... (1000) - indicates delay in ms I think 
}

function update_moves() {
        moves.textContent = state.moves;
        update_rating();
}



function restart() { // Reset game state and shuffle cards.
        state = {
                selected: null, // Currently selected card.
                matches: 0, // Number of matches found.
                start: performance.now(), // Game start time.
                moves: 0, // Number of moves.
        };
        const cards = shuffle(Array.from(document.getElementsByClassName('card')));
        for (let i = 0; i < card_values.length; ++i) {
                for (let j = 0; j < 2; ++j) {
                        cards[2 * i + j].setAttribute('card', card_values[i]);
                        cards[2 * i + j].removeAttribute('show');
                        cards[2 * i + j].removeAttribute('done');
                }
        }
        update_moves();
        update_timer();
}

function congratulate() { // Congratulate player and ask to play again.
        if (confirm('Rating: ' + rating.textContent + ' Time: ' + timer.textContent + ' Play again?'))
                restart();
}

function make_card() { // Create new card element from template and set onclick.
        const node = document.importNode(document.getElementById('card').content, true);
        const card = node.getElementById('div');

        card.onclick = function() {
                if (disabled || card.getAttribute('done')) // Ignore invalid clicks.
                        return;
                else if (!state.selected) { // Select first card.
                        card.setAttribute('show', true);
                        state.selected = card;
                } else if (card != state.selected) { // Select second card.
                        ++state.moves;
                        update_moves();
                        disabled = true; // Disable further clicks until timeout.
                        var temp = state.selected; // Save a reference to selected card,
                        state.selected = null; // and reset actual selection.
                        card.setAttribute('show', true);
                        if (temp.getAttribute('card') == card.getAttribute('card')) { // Match.
                                let done = ++state.matches == card_values.length;
                                setTimeout(function() {
                                        temp.setAttribute('done', true);
                                        card.setAttribute('done', true);
                                        disabled = false;
                                        if (done)
                                                congratulate();
                                }, 1000);
                        } else { // No match.
                                setTimeout(function() {
                                        temp.removeAttribute('show');
                                        card.removeAttribute('show');
                                        disabled = false;
                                }, 1000);
                        }
                }
        };
        return card;
}



onload = function() { // Do this when document loads.
        // Get all necessary elements.
        rating = document.getElementById('rating');
        timer = document.getElementById('timer');
        moves = document.getElementById('moves');
        let button_restart = document.getElementById('restart');
        // Set callbacks.
        button_restart.onclick = restart;
        setInterval(update_timer, 1000);
        // Make cards.
        const cards = document.getElementById('cards');
        for (let i = 0; i < 2 * card_values.length; ++i)
                cards.appendChild(make_card());
        // Start game.
        restart();
}