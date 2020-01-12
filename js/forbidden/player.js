export default class Player {
  constructor (data) {
    for (let key of Object.keys(data)) {
      this[key] = data[key];
    }
    const svgNS = "http://www.w3.org/2000/svg";
    const startingTile = Object.values(board).find(tile => tile.startingPlayer === this.name);
    this.element = document.createElementNS(svgNS, "svg");
    this.element.id = this.name;
    this.element.classList.add("piece");
    this.element.setAttribute("viewBox", "0 0 15 24");
    document.body.appendChild(this.element);
    this.element = document.getElementById(this.name);
    this.element.style.setProperty("top", `${startingTile.bcr.y + startingTile.bcr.height / 2}px`);
    this.element.style.setProperty("left", `${startingTile.bcr.x + startingTile.bcr.width / 2}px`);
    const head = document.createElementNS(svgNS, "circle");
    head.setAttribute("cx", "10");
    head.setAttribute("cy", "3.5");
    head.setAttribute("r", "3.5");
    head.setAttribute("fill", this.color.piece);
    this.element.appendChild(head);
    const body = document.createElementNS(svgNS, "path");
    body.setAttribute("d", 
     `M 10 3.5
      a 5 18 0 0 1 5 18
      a 10 5 0 0 1 -10 0
      a 5 18 0 0 1 5 -18
      `
    );
    body.setAttribute("fill", this.color.piece);
    this.element.appendChild(body);
    /*const bodyShadow = document.createElementNS(svgNS, "path");
    bodyShadow.setAttribute("d",
     `M 11 
      `
    )*/
  }
  goTo (x, y) {
    //board.
  }
}