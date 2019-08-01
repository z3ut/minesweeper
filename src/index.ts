import { Game } from './game';

const cellSize = '2em';

const gridElement = document.querySelector<HTMLElement>('[data-grid]');
const statusElement = document.querySelector<HTMLElement>('[data-status]');
const gameSizeElement = document.querySelector<HTMLSelectElement>('[data-game-size]');
const bombChancesElement = document.querySelector<HTMLSelectElement>('[data-bomb-chances]');
const newGameBtnElement = document.querySelector<HTMLElement>('[data-new-game-btn]');

let game = new Game(gridElement, statusElement, cellSize);
createNewGameWithCurrentSettings();

newGameBtnElement.addEventListener('click', () => {
  createNewGameWithCurrentSettings();
});

function createNewGameWithCurrentSettings() {
  game.createNewGame(getSelectedGameSize(), getSelectedGameSize(), getBombChances());
}

function getSelectedGameSize(): number {
  return +gameSizeElement.value || 10;
}

function getBombChances(): number {
  return +bombChancesElement.value || .1;
}
