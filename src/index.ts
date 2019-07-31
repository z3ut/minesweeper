
import { Game } from './game';

const fieldWidth = 10;
const fieldHeight = 10;
const cellSize = '1em';

const gridElement = document.querySelector<HTMLElement>('[data-grid]');
const statusElement = document.querySelector<HTMLElement>('[data-status]');
const newGameBtnElement = document.querySelector<HTMLElement>('[data-new-game-btn]');

let game = new Game(gridElement, statusElement, cellSize);
game.createNewGame(fieldWidth, fieldHeight, 10);

newGameBtnElement.addEventListener('click', () => {
  game.createNewGame(fieldWidth, fieldHeight, 10);
});
