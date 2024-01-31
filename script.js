// Global variables
let origBoard;
let humanPlayer = 'X';
let computerPlayer = 'O';
let wins = 0;
let losses = 0;
let draws = 0;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
];

const cells = document.querySelectorAll('.cell');

// Initialization
startGame();

// UI functions
function toggleSymbol() {
    const isChecked = document.getElementById('symbol-toggle').checked;
    const currentSymbol = isChecked ? 'O' : 'X';
    document.getElementById('currentSymbol').innerText = currentSymbol;
    chooseSymbol(currentSymbol);
}

function updateScoreBoard(result) {
    if (result === 'win') wins++;
    if (result === 'loss') losses++;
    if (result === 'draw') draws++;

    document.getElementById("wins").innerText = wins;
    document.getElementById("losses").innerText = losses;
    document.getElementById("draws").innerText = draws;
}

function resetScoreBoard() {
    wins = losses = draws = 0;
    updateScoreBoard(null);
}

// Game logic functions
function startGame() {
    document.getElementById("currentSymbol").innerText = humanPlayer;
    origBoard = Array.from(Array(9).keys());
    cells.forEach((cell) => {
        cell.innerText = '';
        cell.style.removeProperty('background-color');
        cell.addEventListener('click', turnClick, false);
    });
}

function turnClick(square) {
    if (typeof origBoard[square.target.id] === 'number') {
        turn(square.target.id, humanPlayer);
        if (!checkWin(origBoard, humanPlayer) && !checkTie()) turn(bestSpot(), computerPlayer);
    }
}

function turn(squareId, player) {
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    if (checkWin(origBoard, player)) gameOver(checkWin(origBoard, player));
}

function checkWin(board, player) {
    const plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
    for (let [index, win] of winningCombinations.entries()) {
        if (win.every(elem => plays.includes(elem))) return {index, player};
    }
    return null;
}

function gameOver(gameWon) {
    winningCombinations[gameWon.index].forEach(index => {
        document.getElementById(index).style.backgroundColor = (gameWon.player === humanPlayer) ? "blue" : "red";
    });
    cells.forEach(cell => cell.removeEventListener('click', turnClick, false));
    updateScoreBoard(gameWon.player === humanPlayer ? "win" : "loss");
}

function emptySquares() {
    return origBoard.filter(s => typeof s === 'number');
}

function bestSpot() {
    return minimax(origBoard, computerPlayer).index;
}

function checkTie() {
    if (emptySquares().length === 0) {
        cells.forEach(cell => {
            cell.style.backgroundColor = "green";
            cell.removeEventListener('click', turnClick, false);
        });
        updateScoreBoard("draw");
        return true;
    }
    return false;
}

function minimax(newBoard, player) {
    let result;
    let i;
    let bestScore;
    const availSpots = emptySquares();

    if (checkWin(newBoard, humanPlayer)) {
        return {score: -10};
    } else if (checkWin(newBoard, computerPlayer)) {
        return {score: 10};
    } else if (availSpots.length === 0) {
        return {score: 0};
    }

    const moves = [];
    for (i = 0; i < availSpots.length; i++) {
        const move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if (player === computerPlayer) {
            result = minimax(newBoard, humanPlayer);
            move.score = result.score;
        } else {
            result = minimax(newBoard, computerPlayer);
            move.score = result.score;
        }
        newBoard[availSpots[i]] = move.index;
        moves.push(move);
    }
    let bestMove;
    if (player === computerPlayer) {
        bestScore = -10000;
        for (i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        bestScore = 10000;
        for (i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}

// Player settings
function chooseSymbol(symbol) {
    humanPlayer = symbol;
    computerPlayer = (symbol === 'X') ? 'O' : 'X';
    document.getElementById("currentSymbol").innerText = humanPlayer;
    startGame();
}

document.getElementById("toggle-sidebar").addEventListener("click", function () {
    const sidebar = document.querySelector(".contact-sidebar");
    if (sidebar.classList.contains("hidden")) {
        sidebar.classList.remove("hidden");
    } else {
        sidebar.classList.add("hidden");
    }
});
