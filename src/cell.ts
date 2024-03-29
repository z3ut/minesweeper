export class Cell {

  public isOpened: boolean;
  public isMarkedAsBomb: boolean;
  public numberOfNeighboursWithBombs: number;

  private cellElement: HTMLElement

  constructor(public x: number,
    public y: number,
    public order: number,
    public isHasBomb: boolean,
    container: DocumentFragment,
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
    this.cellElement.style.order = order.toString();
    container.append(this.cellElement);
  }

  open() {
    this.isOpened = true;
    this.isMarkedAsBomb = false;
    this.cellElement.classList.remove('marked');
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
    if (!this.isOpened) {
      this.cellElement.classList.toggle('marked');
      this.isMarkedAsBomb = !this.isMarkedAsBomb;
    }
  }

  fire() {
    this.open();
    this.cellElement.classList.add('fired');
  }

  setNumberOfNeighboursWithBombs(numberOfNeighboursWithBombs: number) {
    this.numberOfNeighboursWithBombs = numberOfNeighboursWithBombs;

    if (this.numberOfNeighboursWithBombs > 0) {
      this.cellElement.classList.add(
        this.generateNeighboursBombsClass(numberOfNeighboursWithBombs));
    }
  }

  private generateNeighboursBombsClass(numberOfNeighboursWithBombs: number) {
    return `neighbours-bombs-${this.numberOfNeighboursWithBombs}`;
  }
}
