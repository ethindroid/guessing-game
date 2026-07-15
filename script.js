class Player {
    constructor(name, gamesPlayed, bestScore) {
        this.name = name;
        this.gamesPlayed = gamesPlayed;
        this.bestScore = bestScore;
    }

    recordGame(attempts) {
        this.gamesPlayed = this.gamesPlayed + 1;
        if (this.bestScore === null || attempts < this.bestScore) {
            this.bestScore = attempts;
        }
        this.save();
    }

    save() {
        const data = {
            name: this.name,
            gamesPlayed: this.gamesPlayed,
            bestScore: this.bestScore
        };
        localStorage.setItem("guessingGamePlayer", JSON.stringify(data));
    }
}

function loadSavedPlayer() {
    const saved = localStorage.getItem("guessingGamePlayer");
    if (saved === null) {
        return null;
    }
    const data = JSON.parse(saved);
    return new Player(data.name, data.gamesPlayed, data.bestScore);
}

const nameSection = document.getElementById("nameSection");
const nameInput = document.getElementById("nameInput");
const startButton = document.getElementById("startButton");

const gameSection = document.getElementById("gameSection");
const greeting = document.getElementById("greeting");
const input = document.getElementById("guessInput");
const button = document.getElementById("guessButton");
const playAgainButton = document.getElementById("playAgainButton");
const message = document.getElementById("message");
const stats = document.getElementById("stats");

let player;
let secretNumber;
let attempts;

function startNewRound() {
    secretNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    input.value = "";
    message.textContent = "";
    input.disabled = false;
    button.disabled = false;
    playAgainButton.style.display = "none";
}

const savedPlayer = loadSavedPlayer();
if (savedPlayer !== null) {
    nameInput.value = savedPlayer.name;
}

startButton.addEventListener("click", function () {
    const enteredName = nameInput.value;

    if (savedPlayer !== null && savedPlayer.name === enteredName) {
        player = savedPlayer;
        greeting.textContent = "Welcome back, " + player.name + "! Your best score is " + player.bestScore + " tries.";
        stats.textContent = "Games played: " + player.gamesPlayed + ". Best score: " + player.bestScore + " tries.";
    } else {
        player = new Player(enteredName, 0, null);
        greeting.textContent = "Nice to meet you, " + player.name + "!";
    }

    nameSection.style.display = "none";
    gameSection.style.display = "block";

    startNewRound();
});

button.addEventListener("click", function () {
    const guess = Number(input.value);
    attempts = attempts + 1;

    if (guess < secretNumber) {
        message.textContent = "Too low!";
    } else if (guess > secretNumber) {
        message.textContent = "Too high!";
    } else {
        message.textContent = "You got it! The number was " + secretNumber + ". It took you " + attempts + " tries.";
        input.disabled = true;
        button.disabled = true;
        playAgainButton.style.display = "inline";

        player.recordGame(attempts);
        stats.textContent = "Games played: " + player.gamesPlayed + ". Best score: " + player.bestScore + " tries.";
    }
});

playAgainButton.addEventListener("click", startNewRound);
