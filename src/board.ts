import { Cell } from './cell';

export class Board {

  private isLocked = false;
  private cells: Cell[];

  constructor(private gridElement: HTMLElement,
    private fieldWidth: number,
    private fieldHeight: number,
    private bombChances: number,
    private onWin: () => void,
    private onLoose: () => void) {

    this.cells = [];
    const gridFragment = document.createDocumentFragment();

    for (let x = 0; x < fieldWidth; x++) {
      for (let y = 0; y < fieldHeight; y++) {
        const isHasBomb = Math.random() < bombChances;
        const order = (y * fieldWidth + x);
        this.cells.push(new Cell(x, y, order, isHasBomb, gridFragment,
          this.cellClick.bind(this), this.markCellAsBomb.bind(this)));
      }
    }

    for (let cell of this.cells) {
      cell.numberOfNeighboursWithBombs =
        this.getNeighbours(this.cells, cell.x, cell.y)
          .filter(c => c.isHasBomb)
          .length;
    }

    gridElement.appendChild(gridFragment);
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
