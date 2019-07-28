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

  private isLocked = false;
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

  openAllBombs() {
    for (let c of this.cells) {
      if (c.isHasBomb) {
        c.open();
      }
    }
  }

  lock() {
    this.isLocked = true;
  }

  unlock() {
    this.isLocked = false;
  }

  private getNeighbours(cells: Cell[], x: number, y: number): Cell[] {
    return cells.filter(c => Math.abs(c.x - x) <= 1 &&
      Math.abs(c.y - y) <= 1
      && (c.x !== x || c.y !== y));
  }
  
  private cellClick(cell: Cell) {
    if (this.isLocked || cell.isOpened || cell.isMarkedAsBomb) {
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
  
  private openCells(cell: Cell) {
    cell.open();
  
    if (cell.numberOfNeighboursWithBombs == 0) {
      const cellsToPen = this.getNeighbours(this.cells, cell.x, cell.y)
        .filter(c => !c.isOpened && !c.isHasBomb)
      cellsToPen.forEach(c => this.openCells(c));
    }
  }
  
  private markCellAsBomb(cell: Cell) {
    if (this.isLocked) {
      return;
    }

    cell.mark();
  }
  
  private checkWin() {
    if (this.cells.every(c => (c.isOpened && !c.isHasBomb) ||
      (c.isHasBomb && c.isMarkedAsBomb))) {
      this.onWin();
    }
  }
}


class Game {

  private board: Board;

  constructor(private gridElement: HTMLElement,
    private cellSize: string) {
    
  }

  createNewGame(fieldWidth: number,
    fieldHeight: number,
    numberOfBombs: number) {

    while (this.gridElement.firstChild) {
      this.gridElement.removeChild(this.gridElement.firstChild);
    }
    this.gridElement.style.gridTemplateRows = `repeat(${fieldWidth}, ${this.cellSize})`;
    this.gridElement.style.gridTemplateColumns = `repeat(${fieldHeight}, ${this.cellSize})`;
    this.board = new Board(gridElement, fieldWidth, fieldHeight, 10, this.win.bind(this), this.lose.bind(this));
  }

  win() {
    this.board.lock();
    alert('You win!');
  }

  lose() {
    this.board.lock();
    alert('You lose!');
  }
}


const fieldWidth = 10;
const fieldHeight = 10;
const cellSize = '1em';

const containerElement = document.querySelector('[data-container]');
const gridElement = document.querySelector<HTMLElement>('[data-grid]');
const newGameBtnElement = document.querySelector<HTMLElement>('[data-new-game-btn]');

let game = new Game(gridElement, cellSize);
game.createNewGame(fieldWidth, fieldHeight, 10);


newGameBtnElement.addEventListener('click', () => {
  game.createNewGame(fieldWidth, fieldHeight, 10);
});
