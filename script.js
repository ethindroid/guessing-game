const secretNumber = Math.floor(Math.random() * 100) + 1;

const input = document.getElementById("guessInput");
const button = document.getElementById("guessButton");
const message = document.getElementById("message");

button.addEventListener("click", function () {
    const guess = Number(input.value);

    if (guess < secretNumber) {
        message.textContent = "Too low!";
    } else if (guess > secretNumber) {
        message.textContent = "Too high!";
    } else {
        message.textContent = "You got it! The number was " + secretNumber;
    }
});
