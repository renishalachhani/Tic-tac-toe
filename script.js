const statusDisplay = document.getElementById('status');
const cells = document.querySelectorAll('[data-cell]');
const resetButton = document.getElementById('resetButton');
const overlay = document.getElementById('overlay');
const endMessage = document.getElementById('endMessage');
const newGameButton = document.getElementById('newGameButton');
const menu = document.getElementById('menu');
const gameContainer = document.getElementById('gameContainer');
const twoPlayersButton = document.getElementById('twoPlayersButton');
const playComputerButton = document.getElementById('playComputerButton');
const computerOptions = document.getElementById('computerOptions');
const playerXButton = document.getElementById('playerXButton');
const playerOButton = document.getElementById('playerOButton');
const startGameButton = document.getElementById('startGameButton');
const difficultySelect = document.getElementById('difficultySelect');

let currentPlayer = 'X';
let gameActive = true;
let gameState = ["", "", "", "", "", "", "", "", ""];
let againstComputer = false;
let playerSymbol = 'X';
let computerSymbol = 'O';
let difficultyLevel = 3;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const handleCellPlayed = (cell, index) => {
    gameState[index] = currentPlayer;
    cell.textContent = currentPlayer;
};

const handlePlayerChange = () => {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.textContent = `It's ${currentPlayer}'s turn`;
};

const handleResultValidation = () => {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.textContent = `Player ${currentPlayer} has won!`;
        endMessage.textContent = `Player ${currentPlayer} has won!`;
        overlay.style.display = 'flex';
        gameActive = false;
        return;
    }

    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        statusDisplay.textContent = `Game ended in a draw!`;
        endMessage.textContent = `Game ended in a draw!`;
        overlay.style.display = 'flex';
        gameActive = false;
        return;
    }

    handlePlayerChange();
};

const handleCellClick = (e) => {
    const cell = e.target;
    const index = Array.from(cells).indexOf(cell);

    if (gameState[index] !== "" || !gameActive) {
        return;
    }

    handleCellPlayed(cell, index);
    handleResultValidation();

    if (gameActive && againstComputer && currentPlayer === computerSymbol) {
        handleComputerMove();
    }
};

const handleResetGame = () => {
    gameActive = true;
    currentPlayer = playerSymbol;
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.textContent = `It's ${currentPlayer}'s turn`;
    cells.forEach(cell => cell.textContent = "");
    overlay.style.display = 'none';
};

const handleComputerMove = () => {
    const difficultyProbability = [0.1, 0.3, 0.5, 0.7, 0.9][difficultyLevel - 1];
    if (Math.random() < difficultyProbability) {
        const bestMove = getBestMove();
        const cell = cells[bestMove];
        handleCellPlayed(cell, bestMove);
    } else {
        const emptyCells = gameState.map((value, index) => value === "" ? index : null).filter(value => value !== null);
        const randomCellIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const cell = cells[randomCellIndex];
        handleCellPlayed(cell, randomCellIndex);
    }
    handleResultValidation();
};

const getBestMove = () => {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < gameState.length; i++) {
        if (gameState[i] === "") {
            gameState[i] = computerSymbol;
            let score = minimax(gameState, 0, false);
            gameState[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
};

const minimax = (state, depth, isMaximizing) => {
    let scores = {
        [computerSymbol]: 1,
        [playerSymbol]: -1,
        tie: 0
    };

    let result = checkWinner();
    if (result !== null) {
        return scores[result];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < state.length; i++) {
            if (state[i] === "") {
                state[i] = computerSymbol;
                let score = minimax(state, depth + 1, false);
                state[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < state.length; i++) {
            if (state[i] === "") {
                state[i] = playerSymbol;
                let score = minimax(state, depth + 1, true);
                state[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
};

const checkWinner = () => {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            return gameState[a];
        }
    }
    if (!gameState.includes("")) {
        return "tie";
    }
    return null;
};

const startGame = (isAgainstComputer) => {
    menu.style.display = 'none';
    gameContainer.style.display = 'block';
    againstComputer = isAgainstComputer;

    if (againstComputer) {
        playerSymbol = document.querySelector('.selected').textContent;
        computerSymbol = playerSymbol === 'X' ? 'O' : 'X';
        difficultyLevel = parseInt(difficultySelect.value);
        currentPlayer = playerSymbol;
    } else {
        playerSymbol = 'X';
        currentPlayer = playerSymbol;
    }

    statusDisplay.textContent = `It's ${currentPlayer}'s turn`;
};

twoPlayersButton.addEventListener('click', () => startGame(false));
playComputerButton.addEventListener('click', () => {
    computerOptions.style.display = 'block';
});

playerXButton.addEventListener('click', () => {
    playerXButton.classList.add('selected');
    playerOButton.classList.remove('selected');
});

playerOButton.addEventListener('click', () => {
    playerOButton.classList.add('selected');
    playerXButton.classList.remove('selected');
});

startGameButton.addEventListener('click', () => startGame(true));

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', handleResetGame);
newGameButton.addEventListener('click', () => {
    handleResetGame();
    menu.style.display = 'block';
    gameContainer.style.display = 'none';
    computerOptions.style.display = 'none';
});

statusDisplay.textContent = `It's ${currentPlayer}'s turn`;
