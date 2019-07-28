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
      if (this.numberOfNeighboursWithBombs) {
        this.cellElement.innerText = this.numberOfNeighboursWithBombs.toString();
      }
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

class Board {

  private cells: Cell[];

  constructor(private gridElement: HTMLElement,
    private fieldWidth: number,
    private fieldHeight: number,
    private numberOfBombs: number,
    private onWin: () => void,
    private onLoose: () => void) {

    this.cells = [];
    for (let x = 0; x < fieldWidth; x++) {
      for (let y = 0; y < fieldHeight; y++) {
        const isHasBomb = Math.random() < .05;
        this.cells.push(new Cell(x, y, isHasBomb, gridElement, this.cellClick.bind(this), this.markCellAsBomb.bind(this)));
      }
      for (let cell of this.cells) {
        cell.numberOfNeighboursWithBombs =
          this.getNeighbours(this.cells, cell.x, cell.y)
            .filter(c => c.isHasBomb)
            .length;
      }
    }
  }


  getNeighbours(cells: Cell[], x: number, y: number): Cell[] {
    return cells.filter(c => Math.abs(c.x - x) <= 1 &&
      Math.abs(c.y - y) <= 1
      && (c.x !== x || c.y !== y));
  }
  
  cellClick(cell: Cell) {
    if (cell.isOpened || cell.isMarkedAsBomb) {
      return;
    }
  
    if (cell.isHasBomb) {
      cell.fire();
      this.openAllBombs();
      this.onLoose();
      return;
    }
    
    this.openCells(cell);
    this.checkWin();
  }
  
  openCells(cell: Cell) {
    cell.open();
  
    if (cell.numberOfNeighboursWithBombs == 0) {
      const cellsToPen = this.getNeighbours(this.cells, cell.x, cell.y)
        .filter(c => !c.isOpened && !c.isHasBomb)
      cellsToPen.forEach(c => this.openCells(c));
    }
  }
  
  markCellAsBomb(cell: Cell) {
    cell.mark();
  }
  
  checkWin() {
    if (this.cells.every(c => (c.isOpened && !c.isHasBomb) ||
      (c.isHasBomb && c.isMarkedAsBomb))) {
      this.onWin();
    }
  }

  private openAllBombs() {
    for (let c of this.cells) {
      if (c.isHasBomb) {
        c.open();
      }
    }
  }
}

const fieldWidth = 10;
const fieldHeight = 10;

gridElement.style.gridTemplateRows = '1em '.repeat(fieldWidth);
gridElement.style.gridTemplateColumns = '1em '.repeat(fieldHeight);


const board = new Board(gridElement, fieldWidth, fieldHeight, 10, win, lose);


function win() {
  alert('You win!');
}

function lose() {
  alert('You lose!');
}
