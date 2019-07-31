
import { Game } from './game';

const fieldWidth = 10;
const fieldHeight = 10;
const cellSize = '1em';

const gridElement = document.querySelector<HTMLElement>('[data-grid]');
const statusElement = document.querySelector<HTMLElement>('[data-status]');
const gameSizeElement = document.querySelector<HTMLSelectElement>('[data-game-size]');
const newGameBtnElement = document.querySelector<HTMLElement>('[data-new-game-btn]');

let game = new Game(gridElement, statusElement, cellSize);
game.createNewGame(getSelectedGameSize(), getSelectedGameSize(), 10);

newGameBtnElement.addEventListener('click', () => {
  game.createNewGame(getSelectedGameSize(), getSelectedGameSize(), 10);
});

function getSelectedGameSize() {
  return +gameSizeElement.value || 10;
}
