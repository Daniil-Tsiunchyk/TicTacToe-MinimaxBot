let originalBoard;
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

startGame();

function startGame() {
    document.getElementById("currentSymbol").innerText = humanPlayer;
    originalBoard = Array.from(Array(9).keys());
    cells.forEach((cell, index) => {
        cell.innerText = '';
        cell.style.removeProperty('background-color');
        cell.addEventListener('click', turnClick, false);
    });
}

function turnClick(event) {
    const squareId = event.target.id;
    if (typeof originalBoard[squareId] === 'number') {
        makeMove(squareId, humanPlayer);
        if (!checkWin(originalBoard, humanPlayer) && !checkTie()) {
            makeMove(findBestMove(), computerPlayer);
        }
    }
}

function makeMove(squareId, player) {
    originalBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    const gameWon = checkWin(originalBoard, player);
    if (gameWon) {
        endGame(gameWon);
    }
}

function checkWin(board, player) {
    const playedCells = board.reduce((acc, cell, index) => (cell === player ? [...acc, index] : acc), []);
    let gameWon = null;

    for (const [index, win] of winningCombinations.entries()) {
        if (win.every(cell => playedCells.includes(cell))) {
            gameWon = { index, player };
            break;
        }
    }
    return gameWon;
}

function endGame(gameWon) {
    for (const index of winningCombinations[gameWon.index]) {
        document.getElementById(index).style.backgroundColor = gameWon.player === humanPlayer ? 'blue' : 'red';
    }
    cells.forEach(cell => cell.removeEventListener('click', turnClick, false));
    updateScoreBoard(gameWon.player === humanPlayer ? 'win' : 'loss');
}


function updateScoreBoard(result) {
    if (result === 'win') {
        wins++;
        document.getElementById('wins').innerText = wins;
    } else if (result === 'loss') {
        losses++;
        document.getElementById('losses').innerText = losses;
    } else if (result === 'draw') {
        draws++;
        document.getElementById('draws').innerText = draws;
    }
}


function emptySquares() {
    return originalBoard.filter(cell => typeof cell === 'number');
}

function findBestMove() {
    return minimax(originalBoard, computerPlayer).index;
}

function checkTie() {
    if (emptySquares().length === 0) {
        cells.forEach(cell => {
            cell.style.backgroundColor = 'green';
            cell.removeEventListener('click', turnClick, false);
        });
        updateScoreBoard('draw');
        return true;
    }
    return false;
}

function minimax(newBoard, player) {
    const availableSpots = emptySquares(newBoard);

    if (checkWin(newBoard, humanPlayer)) {
        return { score: -10 };
    }
    if (checkWin(newBoard, computerPlayer)) {
        return { score: 10 };
    }
    if (availableSpots.length === 0) {
        return { score: 0 };
    }

    const moves = availableSpots.map(spot => {
        const move = { index: spot };
        newBoard[spot] = player;

        if (player === computerPlayer) {
            move.score = minimax(newBoard, humanPlayer).score;
        } else {
            move.score = minimax(newBoard, computerPlayer).score;
        }

        newBoard[spot] = move.index;
        return move;
    });

    const bestMove = moves.reduce((best, move) => {
        const condition = player === computerPlayer
            ? move.score > (best.score || -Infinity)
            : move.score < (best.score || Infinity);
        return condition ? move : best;
    }, {});

    return bestMove;
}

function toggleSymbol() {
    const isChecked = document.getElementById('symbol-toggle').checked;
    const newSymbol = isChecked ? 'O' : 'X';
    document.getElementById('currentSymbol').innerText = newSymbol;
    chooseSymbol(newSymbol);
}

function chooseSymbol(symbol) {
    humanPlayer = symbol;
    computerPlayer = symbol === 'X' ? 'O' : 'X';
    startGame();
}

function resetScoreBoard() {
    wins = 0;
    losses = 0;
    draws = 0;
    document.getElementById('wins').innerText = wins;
    document.getElementById('losses').innerText = losses;
    document.getElementById('draws').innerText = draws;
}
