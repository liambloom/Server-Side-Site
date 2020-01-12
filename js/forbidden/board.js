export class Tile {
  constructor(name, data) {
    for (let key in data) {
      this[key] = data[key];
    }
    this.element = document.getElementById(name.cssSafe());
    this.bcr = this.element.getBoundingClientRect();
    const boardBcr = document.getElementById("board").getBoundingClientRect();
    this.x = Math.floor((this.bcr.x - boardBcr.x) / this.bcr.width);
    this.y = Math.floor((this.bcr.y - boardBcr.y) / this.bcr.height);
  }
}
export default class Board {
  constructor (data) {
    for (let tile in data) {
      this[tile] = new Tile(tile, data[tile]);
    }
  }
}