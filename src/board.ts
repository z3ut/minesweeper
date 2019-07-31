import { Cell } from './cell';

export class Board {

  private isLocked = false;
  private cells: {
    [index: string]: Cell;
  };

  constructor(gridElement: HTMLElement,
    private fieldWidth: number,
    private fieldHeight: number,
    bombChances: number,
    private onWin: () => void,
    private onLoose: () => void) {

    this.cells = {};
    const gridFragment = document.createDocumentFragment();

    for (let x = 0; x < fieldWidth; x++) {
      for (let y = 0; y < fieldHeight; y++) {
        const isHasBomb = Math.random() < bombChances;
        const order = (y * fieldWidth + x);
        this.setCell(new Cell(x, y, order, isHasBomb, gridFragment,
          this.cellClick.bind(this), this.markCellAsBomb.bind(this)));
      }
    }

    for (let x = 0; x < fieldWidth; x++) {
      for (let y = 0; y < fieldHeight; y++) {
        const cell = this.getCell(x, y);
        cell.numberOfNeighboursWithBombs =
          this.getNeighbours(cell.x, cell.y)
            .filter(c => c.isHasBomb)
            .length;
      }
    }

    gridElement.appendChild(gridFragment);
  }

  openAllBombs() {
    for (let x = 0; x < this.fieldWidth; x++) {
      for (let y = 0; y < this.fieldHeight; y++) {
        const cell = this.getCell(x, y);
        if (cell.isHasBomb) {
          cell.open();
        }
      }
    }
  }

  lock() {
    this.isLocked = true;
  }

  unlock() {
    this.isLocked = false;
  }

  private getCell(x: number, y: number): Cell {
    return this.cells[this.generateCellIndex(x, y)];
  }

  private setCell(cell: Cell) {
    this.cells[this.generateCellIndex(cell.x, cell.y)] = cell;
  }

  private generateCellIndex(x: number, y: number) {
    return `${x}-${y}`;
  }

  private getNeighbours(x: number, y: number): Cell[] {
    const indexes = [
      [ x - 1, y - 1 ], [ x, y - 1 ], [x + 1, y - 1],
      [ x - 1, y ], [ x + 1, y ],
      [ x - 1, y + 1 ], [ x, y + 1 ], [ x + 1, y + 1 ]
    ];
    return indexes.map(i => this.getCell(i[0], i[1]))
      .filter(i => i);
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
      const cellsToPen = this.getNeighbours(cell.x, cell.y)
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
    for (let x = 0; x < this.fieldWidth; x++) {
      for (let y = 0; y < this.fieldHeight; y++) {
        const cell = this.getCell(x, y);
        if ((!cell.isOpened && !cell.isMarkedAsBomb) ||
          (!cell.isOpened && cell.isMarkedAsBomb && !cell.isHasBomb)) {
          return;
        }
      }
    }

    this.onWin();
  }
}
