export default class Player {
  constructor (data) {
    for (let key of Object.keys(data)) {
      this[key] = data[key];
    }
    this.toggleGlow = this.toggleGlow.bind(this);
    this.removeGlow = this.removeGlow.bind(this);
    this.setLocation = this.setLocation.bind(this);
    this.selected = false;
    this.startingTile = Object.values(board).find(tile => tile.startingPlayer === this.name);
    this.tile = this.startingTile;
    this.element = document.getElementById(this.name);
    this.element.setAttribute("width", (3.75 * window.vmin).toString());
    this.element.setAttribute("height", (6 * window.vmin).toString());
    this.setLocation();
    window.addEventListener("resize", () => {
      this.element.style.setProperty("transition", "none");
      this.setLocation();
      this.element.style.setProperty("transition", "");
    });
    this.element.addEventListener("click", () => {
      if (window.gameData.turns.current !== player) this.vibrate(0.5);
      this.tile.element.dispatchEvent(new Event("click"));
    });
    document.addEventListener("click", (event => {
      if (this.selected && !(this.element.contains(event.target) || this.tile.element.contains(event.target))) this.removeGlow();
    }).bind(this));
  }
  setLocation () {
    this.tile.element.removeEventListener("click", this.toggleGlow);
    this.element.style.setProperty("left", `${this.tile.bcr.x + this.tile.bcr.width / 2}px`);
    this.element.style.setProperty("top", `${this.tile.bcr.y + this.tile.bcr.height / 2}px`);
    this.tile.element.addEventListener("click", this.toggleGlow);
  }
  toggleGlow () {
    if (window.gameData.turns.current === player && (this.constructor === User || player.ability.moveOthers)) {
      this.selected = !this.selected;
      this.element.classList.toggle("selected");
    }
  }
  removeGlow () {
    this.selected = false;
    this.element.classList.remove("selected");
  }
  move (tile) {
    if (window.gameData.turns.current === player) window.gameData.turns.actionTaken();
    this.tile = tile;
    this.setLocation();
    if (this.selected) this.removeGlow();
  }
  legalMove (tile) {
    const maxDistance = Player.selected !== player && player.ability.moveOtherDistance || 1;
    return (window.gameData.turns.current === player) && (tile !== this.tile) && (tile.floodLevel < 2 || this.ability.moveOnBlocked) && (this.ability.diagonalMovement ? this.x <= tile.x + maxDistance && this.x >= tile.x - maxDistance && this.y <= tile.y + maxDistance && this.y >= tile.y - maxDistance : Math.abs(this.x - tile.x) + Math.abs(this.y - tile.y) <= maxDistance);
  }
  vibrate (seconds = 2.5) {
    this.element.classList.add("vibrate");
    setTimeout(() => {
      this.element.classList.remove("vibrate");
    }, seconds * 1000);
  }
  get bcr () {
    return this.element.getBoundingClientRect();
  }
  get x () {
    return Math.floor((this.bcr.x - board.bcr.x) / this.tile.bcr.width);
  }
  get y () {
    return Math.floor((this.bcr.y - board.bcr.y) / this.tile.bcr.height);
  }
  static get selected () {
    return Object.values(players).find(player => player.selected);
  }
}

export class User extends Player {
  constructor (data) {
    super(data);
  }
}