/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

    /** define class player */

    class Player {
      constructor(color) {
        this.color = color; // store the color for each player
  }
}

    /** define class game */
  
    class Game {
      constructor(height = 6, width = 7, player1, player2) {
        this.height = height;
        this.width = width;
        this.board = []; // in-JS board structure
        this.currPlayer = player1; // start with player1
        this.players = [player1, player2]; // store both players
        this.gameOver = false; // property to track if the game is over
        this.htmlBoard = document.getElementById('board');
    
        this.makeBoard();
        this.makeHtmlBoard();
      }
    
      /** makeBoard: create in-JS board structure */
      makeBoard() {
        this.board = []; // reset board
        for (let y = 0; y < this.height; y++) {
          this.board.push(Array.from({ length: this.width }));
        }
      }
    
      /** makeHtmlBoard: make HTML table and row of column tops */
      makeHtmlBoard() {
        this.htmlBoard.innerHTML = ''; // clear previous board
    
        // make column tops (clickable area for adding a piece to that column)
        const top = document.createElement('tr');
        top.setAttribute('id', 'column-top');
        top.addEventListener('click', this.handleClick.bind(this));
    
        for (let x = 0; x < this.width; x++) {
          const headCell = document.createElement('td');
          headCell.setAttribute('id', x);
          top.append(headCell);
        }
    
        this.htmlBoard.append(top);
    
        // make main part of board
        for (let y = 0; y < this.height; y++) {
          const row = document.createElement('tr');
    
          for (let x = 0; x < this.width; x++) {
            const cell = document.createElement('td');
            cell.setAttribute('id', `${y}-${x}`);
            row.append(cell);
          }
    
          this.htmlBoard.append(row);
        }
      }
    
      /** findSpotForCol: given column x, return top empty y (null if filled) */
      findSpotForCol(x) {
        for (let y = this.height - 1; y >= 0; y--) {
          if (!this.board[y][x]) {
            return y;
          }
        }
        return null;
      }
    
      /** placeInTable: update DOM to place piece into HTML table of board */
      placeInTable(y, x) {
        const piece = document.createElement('div');
        piece.classList.add('piece');
        piece.style.backgroundColor = this.currPlayer.color; // use player's color
        piece.style.top = -50 * (y + 2);
    
        const spot = document.getElementById(`${y}-${x}`);
        spot.append(piece);
      }
    
      /** endGame: announce game end */
      endGame(msg) {
        alert(msg);
        this.gameOver = true; // mark the game as over
      }
    
      /** handleClick: handle click of column top to play piece */
      handleClick(evt) {
        if (this.gameOver) return; // if the game is over, prevent moves
    
        // get x from ID of clicked cell
        const x = +evt.target.id;
    
        // get next spot in column (if none, ignore click)
        const y = this.findSpotForCol(x);
        if (y === null) {
          return;
        }
    
        // place piece in board and add to HTML table
        this.board[y][x] = this.currPlayer;
        this.placeInTable(y, x);
    
        // check for win
        if (this.checkForWin()) {
          return this.endGame(`Player ${this.currPlayer.color} won!`);
        }
    
        // check for tie
        if (this.board.every(row => row.every(cell => cell))) {
          return this.endGame('Tie!');
        }
    
        // switch players
        this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
      }
    
      /** checkForWin: check board cell-by-cell for "does a win start here?" */
      checkForWin() {
        const _win = (cells) =>
          cells.every(
            ([y, x]) =>
              y >= 0 &&
              y < this.height &&
              x >= 0 &&
              x < this.width &&
              this.board[y][x] === this.currPlayer
          );
    
        for (let y = 0; y < this.height; y++) {
          for (let x = 0; x < this.width; x++) {
            const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
            const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
            const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
            const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
    
            if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
              return true;
            }
          }
        }
      }
    
      /** resetGame: reset the game state */
      resetGame() {
        this.currPlayer = this.players[0]; // reset to player 1
        this.gameOver = false;
        this.makeBoard();
        this.makeHtmlBoard();
      }
    }
    
    // Event listener for the "Start Game" button
    document.getElementById('start-game').addEventListener('click', function () {
      const p1Color = document.getElementById('p1-color').value;
      const p2Color = document.getElementById('p2-color').value;
    
      const player1 = new Player(p1Color);
      const player2 = new Player(p2Color);
    
      new Game(6, 7, player1, player2).resetGame(); // Start a new game with player colors
    });
    