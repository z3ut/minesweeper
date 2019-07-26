const containerElement = document.querySelector('[data-container]');
const gridElement = document.querySelector<HTMLElement>('[data-grid]');

class Cell {

  public isOpened: boolean;
  public isMarkedAsBomb: boolean;
  public numberOfNeighboursWithBombs: number;

  private cellElement: HTMLElement

  constructor(public x: number,
    public y: number,
    public isHasBomb: boolean,
    gridElement: HTMLElement,
    onLeftClick: (cell: Cell) => void,
    onRightClick: (cell: Cell) => void) {
    
    this.cellElement = document.createElement('div');
    this.cellElement.addEventListener('click', onLeftClick.bind(null, this));
    this.cellElement.addEventListener('contextmenu', event => {
      event.preventDefault();
      onRightClick(this);
    });
    this.cellElement.classList.add('cell');
    this.cellElement.classList.add('closed');
    this.cellElement.style.order = (y * fieldWidth + x).toString();
    gridElement.append(this.cellElement);
  }

  open() {
    this.isOpened = true;
    this.cellElement.classList.remove('closed');
    this.cellElement.classList.add('opened');

    if (this.isHasBomb) {
      this.cellElement.classList.add('bomb');
    } else {
      this.cellElement.innerText = this.numberOfNeighboursWithBombs.toString();
    }
  }

  mark() {
    this.cellElement.classList.toggle('marked');
    this.isMarkedAsBomb = !this.isMarkedAsBomb;
  }

  fire() {
    this.open();
    this.cellElement.classList.add('fired');
  }
}

const fieldWidth = 10;
const fieldHeight = 10;

gridElement.style.gridTemplateRows = '1em '.repeat(fieldWidth);
gridElement.style.gridTemplateColumns = '1em '.repeat(fieldHeight);

const cells: Cell[] = [];

for (let x = 0; x < fieldWidth; x++) {
  for (let y = 0; y < fieldHeight; y++) {
    const isHasBomb = Math.random() < .05;
    const cell = new Cell(x, y, isHasBomb, gridElement, cellClick, markSellAsBomb);
    cells.push(cell);
    
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
    cell.fire();
    for (let c of cells) {
      if (c.isHasBomb) {
        c.open();
      }
    }
    alert('You lose!');
    return;
  } else {
    cell.open();
    openCells(cell, []);
  }

  checkWin();
}

function openCells(cell: Cell, openedCells: Cell[]) {
  cell.open();

  if (cell.numberOfNeighboursWithBombs == 0) {
    const cellsToPen = getNeighbours(cells, cell.x, cell.y)
      .filter(c => !c.isHasBomb)
      .filter(c => !openedCells.includes(c));
    cellsToPen.forEach(c => openedCells.push(c));
    cellsToPen.forEach(c => openCells(c, openedCells));
  }
}

function markSellAsBomb(cell: Cell) {
  cell.mark();
}

function checkWin() {
  if (cells.every(c => (c.isOpened && !c.isHasBomb) ||
    (c.isHasBomb && c.isMarkedAsBomb))) {
    alert('You win!');
  }
}
