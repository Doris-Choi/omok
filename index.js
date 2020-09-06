let bw = 1; // black: 1; white: 2;
let boardArr = [];

const landing = document.querySelector('.landing');
const game = document.getElementById('game');
const scoreBoard = document.querySelector('.scoreboard');
const btnRestart = document.querySelector('#game button');
const board = document.getElementById('board');
const players = {
  1: { nickname: '', stone: 1, score: 0 },
  2: { nickname: '', stone: 2, score: 0 },
};

window.onload = () => {
  const btnGameStart = document.querySelector('.landing button');
  btnGameStart.addEventListener('click', (e) => {
    landing.style.display = 'none';
    render();
  });
};

const render = () => {
  players[1].nickname = document.getElementById('player1').value || 'PLAYER 1';
  players[2].nickname = document.getElementById('player2').value || 'PLAYER 2';
  renderScoreBoard();
  game.style.display = 'block';
  btnRestart.addEventListener('click', renderGomokuBoard);
  renderGomokuBoard();
};
// score board 그리기
const renderScoreBoard = () => {
  scoreBoard.innerHTML = '';
  const frag = document.createDocumentFragment();
  const totalGame = document.createElement('h2');
  totalGame.innerText = `전체 게임 수: ${players[1].score + players[2].score}`;
  frag.appendChild(totalGame);
  const playerWrap = document.createElement('div');
  playerWrap.classList.add('player-wrapper');
  for (let i = 0; i < 2; i++) {
    const box = document.createElement('div');
    box.classList.add('player-box');
    const playerName = document.createElement('h3');
    playerName.innerText = players[i + 1].nickname;
    const stone = document.createElement('div');
    stone.classList.add(players[i + 1].stone === 1 ? 'black' : 'white');
    const score = document.createElement('div');
    score.classList.add('score');
    score.innerText = players[i + 1].score;
    playerName.appendChild(stone);
    box.appendChild(playerName);
    box.appendChild(score);
    playerWrap.appendChild(box);
  }
  frag.appendChild(playerWrap);
  scoreBoard.appendChild(frag);
};
// 바둑판 그리기
const renderGomokuBoard = () => {
  // 초기화
  bw = 1;
  boardArr = [];
  board.innerHTML = '';

  const frag = document.createDocumentFragment();
  let num = 0; // 바둑판 위치
  for (let i = 0; i < 19; i++) {
    const row = document.createElement('div');
    row.classList.add('row');
    const sub = [];
    for (let j = 0; j < 19; j++) {
      sub.push(0);
      const cell = document.createElement('div');
      cell.innerText = num;
      cell.classList.add('cell');
      cell.addEventListener('click', putStone);
      row.appendChild(cell);
      num++;
    }
    boardArr.push(sub);
    frag.appendChild(row);
  }
  board.appendChild(frag);
};
// 바둑돌 두기
const putStone = (e) => {
  if (
    e.target.classList.contains('black') ||
    e.target.classList.contains('white')
  ) {
    return;
  }
  const r = parseInt(parseInt(e.target.innerText) / 19);
  const c = parseInt(e.target.innerText) % 19;
  boardArr[r][c] = bw;
  // fix
  if (bw === 1) {
    e.target.classList.add('black');
    decideWin(e);
    bw += 1;
  } else if (bw == 2) {
    e.target.classList.add('white');
    decideWin(e);
    bw -= 1;
  }
};
// 승리 판단
const decideWin = (e) => {
  const r = parseInt(parseInt(e.target.innerText) / 19);
  const c = parseInt(e.target.innerText) % 19;
  if (
    vertical(r, c) ||
    horizontal(r, c) ||
    diagonal(r, c) ||
    antiDiagonal(r, c)
  ) {
    // 게임 기능 무력화
    const cells = document.querySelectorAll('.cell');
    [].forEach.call(cells, (cell) => {
      cell.removeEventListener('click', putStone);
    });
    // score board 숫자 변경
    const winner = boardArr[r][c] === players[1].stone ? 1 : 2;
    const loser = winner === 1 ? 2 : 1;
    players[winner].score += 1;
    players[winner].stone = 1;
    players[loser].stone = 2;
    scoreBoard.firstElementChild.innerText = `전체 게임 수: ${
      players[1].score + players[2].score
    }`;
    const playerBox = document.querySelectorAll('.player-box');
    for (let i = 0; i < 2; i++) {
      playerBox[i].firstElementChild.firstElementChild.className =
        players[i + 1].stone === 1 ? 'black' : 'white';
      playerBox[i].lastElementChild.innerText = players[i + 1].score;
    }
    alert(`${players[winner].nickname}가(이) 승리하였습니다.`);
  }
};
const vertical = (r, c) => {
  let count = 0;
  let start = r - 4 >= 0 ? r - 4 : 0;
  let end = r + 4 <= 18 ? r + 4 : 18;
  while (start <= end) {
    if (boardArr[start++][c] === bw) {
      count++;
      if (count === 5) return true;
    } else {
      count = 0;
    }
  }
  return false;
};
const horizontal = (r, c) => {
  let count = 0;
  let start = c - 4 >= 0 ? c - 4 : 0;
  let end = c + 4 <= 18 ? c + 4 : 18;
  while (start <= end) {
    if (boardArr[r][start++] === bw) {
      count++;
      if (count === 5) return true;
    } else {
      count = 0;
    }
  }
  return false;
};
const diagonal = (r, c) => {
  let count = 0;
  let startRow;
  let startCol;
  if (r === 0 || c === 0) {
    startRow = r;
    startCol = c;
  } else if (r - 1 === 0 || c - 1 === 0) {
    startRow = r - 1;
    startCol = c - 1;
  } else if (r - 2 === 0 || c - 2 === 0) {
    startRow = r - 2;
    startCol = c - 2;
  } else if (r - 3 === 0 || c - 3 === 0) {
    startRow = r - 3;
    startCol = c - 3;
  } else {
    startRow = r - 4;
    startCol = c - 4;
  }
  let endRow = r + 4 <= 18 ? r + 4 : 18;
  let endCol = c + 4 <= 18 ? c + 4 : 18;
  while (startRow <= endRow && startCol <= endCol) {
    if (boardArr[startRow++][startCol++] === bw) {
      count++;
      if (count === 5) return true;
    } else {
      count = 0;
    }
  }
  return false;
};
const antiDiagonal = (r, c) => {
  let count = 0;
  let startRow;
  let startCol;
  if (r === 0 || c === 18) {
    startRow = r;
    startCol = c;
  } else if (r - 1 === 0 || c + 1 === 18) {
    startRow = r - 1;
    startCol = c + 1;
  } else if (r - 2 === 0 || c + 2 === 18) {
    startRow = r - 2;
    startCol = c + 2;
  } else if (r - 3 === 0 || c + 3 === 18) {
    startRow = r - 3;
    startCol = c + 3;
  } else {
    startRow = r - 4;
    startCol = c + 4;
  }
  let endRow = r + 4 <= 18 ? r + 4 : 18;
  let endCol = c - 4 >= 0 ? c - 4 : 0;
  while (startRow <= endRow && startCol >= endCol) {
    if (boardArr[startRow++][startCol--] === bw) {
      count++;
      if (count === 5) return true;
    } else {
      count = 0;
    }
  }
  return false;
};
