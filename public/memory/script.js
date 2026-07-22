const EMOJIS = ["🍕", "🚀", "🐙", "🎧", "🌵", "🎲", "🦊", "⚡"];

const board = document.getElementById("board");
const movesDisplay = document.getElementById("moves");
const status = document.getElementById("status");
const restartButton = document.getElementById("restartButton");

let flippedCards = [];
let matchedCount = 0;
let moves = 0;
let isChecking = false;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function createBoard() {
    board.innerHTML = "";
    flippedCards = [];
    matchedCount = 0;
    moves = 0;
    isChecking = false;
    movesDisplay.textContent = "Moves: 0";
    status.textContent = "Find all the matching pairs.";

    const cardValues = EMOJIS.concat(EMOJIS);
    shuffle(cardValues);

    for (const value of cardValues) {
        const card = document.createElement("div");
        card.className = "card";
        card.dataset.value = value;

        card.innerHTML =
            '<div class="card-inner">' +
            '<div class="card-face card-back"></div>' +
            '<div class="card-face card-front">' + value + '</div>' +
            '</div>';

        card.addEventListener("click", function () {
            handleCardClick(card);
        });

        board.appendChild(card);
    }
}

function handleCardClick(card) {
    if (isChecking) {
        return;
    }
    if (card.classList.contains("flipped") || card.classList.contains("matched")) {
        return;
    }
    if (flippedCards.length === 2) {
        return;
    }

    card.classList.add("flipped");
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        moves = moves + 1;
        movesDisplay.textContent = "Moves: " + moves;
        checkForMatch();
    }
}

function checkForMatch() {
    isChecking = true;
    const [first, second] = flippedCards;

    if (first.dataset.value === second.dataset.value) {
        first.classList.add("matched");
        second.classList.add("matched");
        flippedCards = [];
        isChecking = false;
        matchedCount = matchedCount + 1;

        if (matchedCount === EMOJIS.length) {
            status.textContent = "You won in " + moves + " moves!";
        }
    } else {
        setTimeout(function () {
            first.classList.remove("flipped");
            second.classList.remove("flipped");
            flippedCards = [];
            isChecking = false;
        }, 800);
    }
}

restartButton.addEventListener("click", createBoard);

createBoard();
