const containerElement = document.querySelector('[data-container]');
const gridElement = document.querySelector<HTMLElement>('[data-grid]');

class Cell {
  constructor(public x: number,
    public y: number,
    public isHasBomb: boolean,
    public isOpened: boolean,
    public isMarkedAsBomb: boolean,
    public numberOfNeighboursWithBombs: number,
    public element: HTMLElement) { }
}

const fieldWidth = 10;
const fieldHeight = 10;

gridElement.style.gridTemplateRows = '1em '.repeat(fieldWidth);
gridElement.style.gridTemplateColumns = '1em '.repeat(fieldHeight);

const cells: Cell[] = [];

for (let x = 0; x < fieldWidth; x++) {
  for (let y = 0; y < fieldHeight; y++) {
    const cellElement = document.createElement('div')
    const isHasBomb = Math.random() < .1;
    const cell = new Cell(x, y, isHasBomb, false, false, 0, cellElement);
    cellElement.addEventListener('click', cellClick.bind(null, cell));
    cellElement.addEventListener('contextmenu', markSellAsBomb.bind(null, cell));
    cells.push(cell);
    cellElement.classList.add('cell');
    cellElement.classList.add(cell.isOpened ? 'opened' : 'closed');
    // cellElement.classList.add(cell.isHasBomb ? 'bomb' : '1');
    cellElement.style.order = (y * fieldWidth + x).toString();
    gridElement.append(cellElement);
  }
}

for (let cell of cells) {
  cell.numberOfNeighboursWithBombs =
    getNeighbours(cells, cell.x, cell.y)
      .filter(c => c.isHasBomb)
      .length;
}

function getNeighbours(cells: Cell[], x: number, y: number): Cell[] {
  return cells.filter(c => Math.abs(c.x - x) <= 1 &&
    Math.abs(c.y - y) <= 1
    && (c.x !== x || c.y !== y));
}

function cellClick(cell: Cell) {
  if (cell.isOpened || cell.isMarkedAsBomb) {
    return;
  }

  if (cell.isHasBomb) {
    cell.element.classList.remove('closed');
    cell.element.classList.add('opened');
    cell.element.classList.add('bomb');
    cell.element.classList.add('fired');
    for (let c of cells) {
      if (c.isHasBomb) {
        c.element.classList.remove('closed');
        c.element.classList.add('opened');
        c.element.classList.add('bomb');
      }
    }
    alert('You lose!');
  } else {
    openCells(cell, []);
  }

  checkWin();
}

function openCells(cell: Cell, openedCells: Cell[]) {
  if (cell.isHasBomb) {
    return;
  }

  cell.isOpened = true;
  cell.element.classList.remove('closed');
  cell.element.classList.add('opened');

  cell.element.innerText = cell.numberOfNeighboursWithBombs.toString();

  if (cell.numberOfNeighboursWithBombs == 0) {
    const neighboursWithoutBombs = getNeighbours(cells, cell.x, cell.y)
      .filter(c => !c.isHasBomb);
    const cellsToPen = neighboursWithoutBombs
      .filter(c => !openedCells.includes(c));
    const nowOpenedCells = [...openedCells, ...cellsToPen, cell];
    cellsToPen.forEach(c => openCells(c, nowOpenedCells));
  }
}

function markSellAsBomb(cell: Cell, event) {
  event.preventDefault();
  cell.element.classList.toggle('marked');
  cell.isMarkedAsBomb = !cell.isMarkedAsBomb;
}

function checkWin() {
  if (cells.every(c => c.isOpened ||
    (!c.isHasBomb && !c.isMarkedAsBomb) ||
    (c.isHasBomb && c.isMarkedAsBomb))) {
    alert('You win!');
  }
}
