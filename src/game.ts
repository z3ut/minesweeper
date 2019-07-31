import { Board } from './board';

export class Game {

  private board: Board;

  constructor(private gridElement: HTMLElement,
    private statusElement: HTMLElement,
    private cellSize: string) {
    
  }

  createNewGame(fieldWidth: number,
    fieldHeight: number,
    numberOfBombs: number) {

    this.statusElement.innerText = "";
    while (this.gridElement.firstChild) {
      this.gridElement.removeChild(this.gridElement.firstChild);
    }
    this.gridElement.style.gridTemplateRows = `repeat(${fieldWidth}, ${this.cellSize})`;
    this.gridElement.style.gridTemplateColumns = `repeat(${fieldHeight}, ${this.cellSize})`;
    this.board = new Board(this.gridElement, fieldWidth, fieldHeight, 10, this.win.bind(this), this.lose.bind(this));
  }

  win() {
    this.board.lock();
    this.statusElement.innerText = "You win!";
  }

  lose() {
    this.board.lock();
    this.statusElement.innerText = "You lose!";
  }
}