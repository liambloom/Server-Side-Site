export class Tile {
  constructor(name, data) {
    for (let key in data) {
      this[key] = data[key];
    }
    this.element = document.getElementById(name.cssSafe());
    this.element.addEventListener("click", () => {
      const selected = Object.values(players).find(player => player.selected);
      if (selected && selected.legalMove(this, selected !== player && player.ability.moveOtherDistance || 1)) selected.move(this); 
    });
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