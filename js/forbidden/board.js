export class Tile {
  constructor(name, data) {
    for (let key in data) {
      this[key] = data[key];
    }
    this.element = document.getElementById(name.cssSafe());
    this.element.addEventListener("click", () => {
      const selected = player.constructor.selected;
      if (selected && selected.legalMove(this)) selected.move(this); 
    });
  }
  flood () {
    if (this.floodLevel >= 0 && this.floodLevel <= 1) {
      this.floodLevel++;
      if (this.floodLevel === 1) {
        this.element.classList.add("flooded");
        this.shakePiece();
      }
      else {
        this.element.classList.add("gone");
        setTimeout(() => {
          this.element.style.setProperty("display", "none");
        }, 5000);
      }
    }
  }
  shoreUp () {
    if (this.floodLevel == 1) {
      this.floodLevel--;
      this.element.classList.remove("flooded");
    }
  }
  shakePiece () {
    const thisPiece = Object.values(players).find(player => player.tile === this);
    if (thisPiece) thisPiece.vibrate();
  }
  get bcr () {
    return this.element.getBoundingClientRect();
  }
  get x () {
    return Math.floor((this.bcr.x - Board.prototype.bcr.x) / this.bcr.width);
  }
  get y () {
    return Math.floor((this.bcr.y - Board.prototype.bcr.y) / this.bcr.height);
  }
  floodLevel = 0
}
export default class Board {
  constructor (data) {
    for (let tile in data) {
      this[tile] = new Tile(tile, data[tile]);
    }
  }
  get bcr () {
    return document.getElementById("board").getBoundingClientRect();
  }
}