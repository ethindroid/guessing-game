const board = document.getElementById("board");
const status = document.getElementById("status");
const restartButton = document.getElementById("restartButton");

const HUMAN = "X";
const COMPUTER = "O";

const WINNING_PATTERNS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

let cells = [];
let buttons = [];
let gameOver = false;

function createBoard() {
    board.innerHTML = "";
    cells = new Array(9).fill(null);
    buttons = [];
    gameOver = false;
    status.textContent = "Your turn (X)";

    for (let i = 0; i < 9; i++) {
        const button = document.createElement("button");
        button.className = "cell";
        button.addEventListener("click", function () {
            handleCellClick(i);
        });
        board.appendChild(button);
        buttons.push(button);
    }
}

function handleCellClick(index) {
    if (gameOver || cells[index] !== null) {
        return;
    }

    playMove(index, HUMAN);

    if (gameOver) {
        return;
    }

    status.textContent = "Computer is thinking...";
    setTimeout(computerMove, 500);
}

function playMove(index, player) {
    cells[index] = player;
    buttons[index].textContent = player;
    buttons[index].disabled = true;

    if (checkForWin(player)) {
        status.textContent = player === HUMAN ? "You win!" : "Computer wins!";
        gameOver = true;
        return;
    }

    if (cells.every(function (cell) { return cell !== null; })) {
        status.textContent = "It's a draw!";
        gameOver = true;
    }
}

function computerMove() {
    if (gameOver) {
        return;
    }

    let index = findWinningMove(COMPUTER);

    if (index === null) {
        index = findWinningMove(HUMAN);
    }

    if (index === null && cells[4] === null) {
        index = 4;
    }

    if (index === null) {
        const emptyIndexes = [];
        for (let i = 0; i < cells.length; i++) {
            if (cells[i] === null) {
                emptyIndexes.push(i);
            }
        }
        index = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
    }

    playMove(index, COMPUTER);

    if (!gameOver) {
        status.textContent = "Your turn (X)";
    }
}

function findWinningMove(player) {
    for (let i = 0; i < cells.length; i++) {
        if (cells[i] !== null) {
            continue;
        }

        cells[i] = player;
        const wins = checkForWin(player);
        cells[i] = null;

        if (wins) {
            return i;
        }
    }
    return null;
}

function checkForWin(player) {
    for (const pattern of WINNING_PATTERNS) {
        const [a, b, c] = pattern;
        if (cells[a] === player && cells[b] === player && cells[c] === player) {
            return true;
        }
    }
    return false;
}

restartButton.addEventListener("click", createBoard);

createBoard();
