const input = document.getElementById("guessInput");
const button = document.getElementById("guessButton");
const playAgainButton = document.getElementById("playAgainButton");
const message = document.getElementById("message");

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
    }
});

playAgainButton.addEventListener("click", startNewRound);

startNewRound();
