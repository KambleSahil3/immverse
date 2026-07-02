const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Tic-Tac-Toe</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: system-ui, -apple-system, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
    color: #eee;
  }
  .container {
    text-align: center;
    padding: 20px;
  }
  h1 {
    font-size: 2.2rem;
    font-weight: 700;
    letter-spacing: 2px;
    margin-bottom: 30px;
    background: linear-gradient(90deg, #00d2ff, #a855f7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .players {
    display: flex;
    justify-content: center;
    gap: 40px;
    margin-bottom: 24px;
  }
  .player-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 24px;
    border-radius: 12px;
    background: rgba(255,255,255,0.05);
    border: 2px solid transparent;
    transition: all 0.3s ease;
  }
  .player-card.active-x {
    border-color: #00d2ff;
    box-shadow: 0 0 20px rgba(0,210,255,0.2);
    background: rgba(0,210,255,0.1);
  }
  .player-card.active-o {
    border-color: #ff6b6b;
    box-shadow: 0 0 20px rgba(255,107,107,0.2);
    background: rgba(255,107,107,0.1);
  }
  .player-card.winner-x {
    border-color: #00d2ff;
    background: rgba(0,210,255,0.15);
    box-shadow: 0 0 30px rgba(0,210,255,0.3);
  }
  .player-card.winner-o {
    border-color: #ff6b6b;
    background: rgba(255,107,107,0.15);
    box-shadow: 0 0 30px rgba(255,107,107,0.3);
  }
  .player-mark {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: 800;
    border-radius: 8px;
  }
  .player-mark.x-mark {
    background: rgba(0,210,255,0.2);
    color: #00d2ff;
  }
  .player-mark.o-mark {
    background: rgba(255,107,107,0.2);
    color: #ff6b6b;
  }
  .player-label {
    font-size: 0.85rem;
    opacity: 0.7;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .player-name {
    font-size: 1.1rem;
    font-weight: 600;
  }
  .turn-badge {
    display: inline-block;
    margin-top: 4px;
    padding: 2px 10px;
    border-radius: 20px;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    opacity: 0;
    transition: opacity 0.3s;
  }
  .turn-badge.visible {
    opacity: 1;
  }
  .turn-badge.x-turn {
    background: rgba(0,210,255,0.25);
    color: #00d2ff;
  }
  .turn-badge.o-turn {
    background: rgba(255,107,107,0.25);
    color: #ff6b6b;
  }
  .board-wrapper {
    display: inline-block;
    background: rgba(255,255,255,0.05);
    padding: 16px;
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  }
  .board {
    display: grid;
    grid-template-columns: repeat(3, 110px);
    grid-template-rows: repeat(3, 110px);
    gap: 6px;
  }
  .cell {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    font-weight: 800;
    background: rgba(255,255,255,0.06);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    user-select: none;
    position: relative;
  }
  .cell:hover:not(.taken) {
    background: rgba(255,255,255,0.12);
    transform: scale(1.02);
  }
  .cell.taken {
    cursor: default;
  }
  .cell.x { color: #00d2ff; }
  .cell.o { color: #ff6b6b; }
  .cell.win {
    animation: pulse 0.6s ease-in-out 3;
  }
  .cell.win::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 12px;
    background: currentColor;
    opacity: 0.15;
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.08); }
  }
  .status {
    margin-top: 24px;
    font-size: 1.1rem;
    min-height: 1.5em;
    font-weight: 500;
    opacity: 0.8;
  }
  .status.tie { color: #fbbf24; }
  .status.x-win { color: #00d2ff; }
  .status.o-win { color: #ff6b6b; }
  .actions {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    gap: 12px;
  }
  button {
    padding: 12px 32px;
    font-size: 0.95rem;
    font-weight: 600;
    border: none;
    border-radius: 10px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: #fff;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.5px;
  }
  button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102,126,234,0.4);
  }
  button:active {
    transform: translateY(0);
  }
  .scoreboard {
    display: flex;
    justify-content: center;
    gap: 40px;
    margin-top: 20px;
    font-size: 0.9rem;
    opacity: 0.6;
  }
  .scoreboard span {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .scoreboard .num {
    font-weight: 700;
    font-size: 1.1rem;
  }
</style>
</head>
<body>
<div class="container">
  <h1>TIC-TAC-TOE</h1>

  <div class="players" id="players">
    <div class="player-card" id="playerXCard">
      <div class="player-mark x-mark">X</div>
      <div>
        <div class="player-label">Player 1</div>
        <div class="player-name">Player X</div>
        <div class="turn-badge x-turn" id="xBadge">Your turn</div>
      </div>
    </div>
    <div class="player-card" id="playerOCard">
      <div class="player-mark o-mark">O</div>
      <div>
        <div class="player-label">Player 2</div>
        <div class="player-name">Player O</div>
        <div class="turn-badge o-turn" id="oBadge">Your turn</div>
      </div>
    </div>
  </div>

  <div class="board-wrapper">
    <div class="board" id="board"></div>
  </div>

  <div class="status" id="status"></div>

  <div class="actions">
    <button id="reset">New Game</button>
  </div>

  <div class="scoreboard">
    <span>X wins: <span class="num" id="xWins">0</span></span>
    <span>O wins: <span class="num" id="oWins">0</span></span>
    <span>Ties: <span class="num" id="ties">0</span></span>
  </div>
</div>
<script>
  const boardEl = document.getElementById('board');
  const statusEl = document.getElementById('status');
  const resetBtn = document.getElementById('reset');
  const playerXCard = document.getElementById('playerXCard');
  const playerOCard = document.getElementById('playerOCard');
  const xBadge = document.getElementById('xBadge');
  const oBadge = document.getElementById('oBadge');
  const xWinsEl = document.getElementById('xWins');
  const oWinsEl = document.getElementById('oWins');
  const tiesEl = document.getElementById('ties');

  let board = Array(9).fill(null);
  let currentPlayer = 'X';
  let scores = { X: 0, O: 0, ties: 0 };

  const winLines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  function checkWinner() {
    for (const [a,b,c] of winLines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], line: [a,b,c] };
      }
    }
    if (board.every(c => c !== null)) return { winner: 'tie', line: [] };
    return null;
  }

  function render() {
    boardEl.innerHTML = '';
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement('div');
      const mark = board[i];
      const classes = ['cell'];
      if (mark) classes.push('taken', mark.toLowerCase());
      cell.className = classes.join(' ');
      cell.textContent = mark || '';
      cell.addEventListener('click', () => handleClick(i));
      boardEl.appendChild(cell);
    }

    const result = checkWinner();
    let gameOver = false;

    if (result) {
      gameOver = true;
      if (result.winner === 'tie') {
        statusEl.textContent = "It's a tie!";
        statusEl.className = 'status tie';
      } else {
        statusEl.textContent = \`Player \${result.winner} wins!\`;
        statusEl.className = \`status \${result.winner.toLowerCase()}-win\`;
        result.line.forEach(i => boardEl.children[i].classList.add('win'));
        playerXCard.classList.remove('active-x');
        playerOCard.classList.remove('active-o');
        if (result.winner === 'X') {
          playerXCard.classList.add('winner-x');
        } else {
          playerOCard.classList.add('winner-o');
        }
      }
      xBadge.classList.remove('visible');
      oBadge.classList.remove('visible');
    } else {
      statusEl.textContent = \`Waiting for \${currentPlayer === 'X' ? 'Player X' : 'Player O'}...\`;
      statusEl.className = 'status';
      playerXCard.classList.remove('winner-x', 'active-x');
      playerOCard.classList.remove('winner-o', 'active-o');
      if (currentPlayer === 'X') {
        playerXCard.classList.add('active-x');
        xBadge.classList.add('visible');
        oBadge.classList.remove('visible');
      } else {
        playerOCard.classList.add('active-o');
        oBadge.classList.add('visible');
        xBadge.classList.remove('visible');
      }
    }
  }

  function handleClick(i) {
    if (board[i] || checkWinner()) return;
    board[i] = currentPlayer;
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    render();
    const result = checkWinner();
    if (result && result.winner === 'tie') {
      scores.ties++;
      tiesEl.textContent = scores.ties;
    } else if (result) {
      scores[result.winner]++;
      if (result.winner === 'X') xWinsEl.textContent = scores.X;
      else oWinsEl.textContent = scores.O;
    }
  }

  function reset() {
    board = Array(9).fill(null);
    currentPlayer = 'X';
    playerXCard.classList.remove('winner-x', 'active-x');
    playerOCard.classList.remove('winner-o', 'active-o');
    render();
  }

  resetBtn.addEventListener('click', reset);
  render();
</script>
</body>
</html>
`);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
