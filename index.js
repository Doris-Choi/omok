const gomokuBorad = (() => {
  let bw = 1;

  // 바둑판 그리기
  const board = document.getElementById('board');
  const frag = document.createDocumentFragment();
  for (let i = 0; i < 19; i++) {
    const row = document.createElement('div');
    row.classList.add('row');
    for (let j = 0; j < 19; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.addEventListener('click', (e) => {
        putStone(e);
      });
      row.appendChild(cell);
    }
    frag.appendChild(row);
  }
  board.appendChild(frag);

  // 바둑돌 두기
  const putStone = (e) => {
    if (
      e.target.classList.contains('black') ||
      e.target.classList.contains('white')
    ) {
      return;
    }
    if (bw) {
      e.target.classList.add('black');
      bw -= 1;
    } else {
      e.target.classList.add('white');
      bw += 1;
    }
  };
})();
