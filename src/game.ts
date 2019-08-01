import { Board } from './board';

export class Game {

  private board: Board;

  constructor(private gridElement: HTMLElement,
    private statusElement: HTMLElement,
    private cellSize: string) {
    
  }

  createNewGame(fieldWidth: number,
    fieldHeight: number,
    bombChances: number) {

    this.statusElement.innerText = "";
    while (this.gridElement.firstChild) {
      this.gridElement.removeChild(this.gridElement.firstChild);
    }

    this.gridElement.style.gridTemplateRows =
      `repeat(${fieldWidth}, ${this.cellSize})`;

    this.gridElement.style.gridTemplateColumns =
      `repeat(${fieldHeight}, ${this.cellSize})`;

    this.board = new Board(this.gridElement, fieldWidth, fieldHeight,
      bombChances, this.win.bind(this), this.lose.bind(this));
  }

  win() {
    this.board.lock();
    this.setStatusText('You win!');
  }

  lose() {
    this.board.lock();
    this.setStatusText('You lose!');
  }

  private setStatusText(text: string) {
    this.statusElement.innerText = text;
  }
}
