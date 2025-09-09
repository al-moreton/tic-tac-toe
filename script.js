const Gameboard = (function () {
    let gameboard = Array(9).fill('');

    function buildBoard() {
        const boardDiv = document.querySelector('.board');
        // find square size
        const squareSize = boardDiv.offsetWidth / 3;
        // build board
        for (let i = 0; i < gameboard.length; i++) {
            const boardSquare = document.createElement('div');
            boardSquare.classList.add('board-square');
            boardSquare.style.width = `${squareSize}px`;
            boardSquare.style.height = `${squareSize}px`;
            boardSquare.dataset.id = i;
            boardSquare.addEventListener('click', GameController.placeMarker);
            boardDiv.appendChild(boardSquare);
        }
    }

    function updateArray(index, marker) {
        if (gameboard[index] === '') {
            gameboard[index] = marker;
            Gameboard.checkWin();
            Gameboard.checkTie();
            return true;
        }
        return false;
    }

    function checkWin() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6] // diagonals
        ];
        // check if gameboard has markers in all of the winPatterns, and return winning marker
        for (let pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (gameboard[a] && gameboard[a] === gameboard[b] && gameboard[a] === gameboard[c]) {
                return gameboard[a];
            }
        }
        return false;
    }

    function checkTie() {
        // if array has empty strings and checkWin is false
        if (gameboard.every(a => a !== '') && !checkWin()) {
            return true;
        }
        return false;
    }

    function reset() {
        // reset gameboard array
        gameboard = Array(9).fill('');
        Gameboard.buildBoard();
    }

    return {
        gameboard,
        buildBoard,
        checkWin,
        checkTie,
        reset,
        updateArray,
    }
})();

// player factory
function Player(name, marker) {
    return {
        name,
        marker,
    }
}   

const GameController = (function () {
    let players = [];
    let currentPlayer = 0; //index of current player

    function initGame() {
        players.push(
            Player('Alex', 'X'),
            Player('Rachel', 'O'),
        );
        currentPlayer = 0;
        updateMessage();
        Gameboard.reset();
    }

    function placeMarker(e) {
        if (!e.target.textContent) {
            e.target.textContent = players[currentPlayer].marker;
            Gameboard.updateArray(Number(e.target.dataset.id), players[currentPlayer].marker);
            switchPlayer();
            updateMessage();
        }
    }

    function switchPlayer() {
        currentPlayer = currentPlayer === 0 ? 1 : 0;
    }

    function getCurrentPlayer() {
        return players[currentPlayer].name;
    }

    function updateMessage(message) {
        const messageDiv = document.querySelector('.game-messages');
        if (!Gameboard.checkTie() && !Gameboard.checkWin()) {
            messageDiv.textContent = `${getCurrentPlayer()} goes next!`;
            return;
        }

        if (Gameboard.checkWin()) {
            const winner = players.find(a => a.marker === Gameboard.checkWin());
            messageDiv.textContent = `The winner is ${winner.name}`;
            return;
        }

        if (Gameboard.checkTie()) {
            messageDiv.textContent = 'The game is a tie';
        }
    }

    return {
        updateMessage,
        initGame,
        switchPlayer,
        placeMarker,
        getCurrentPlayer,
    }
})()

GameController.initGame();
