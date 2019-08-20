//jshint esversion:6
import { HexGrid } from "/lib/shapes.js";
window.HexGrid = HexGrid;
document.getElementById("Capa_1").style.display = "none";
let c = document.getElementById("main");
c.width = window.innerWidth;
c.height = window.innerHeight;
let draw = () => {
  let grid = new HexGrid({ grid: { allowOverflow: true } });
  //console.log(grid.spin);
  grid.spin("y", "90deg", "20rpm", "0deg", "(0, 0)", "1.5secs", () => {
    document.getElementById("main").style.display = "none";
  });
};
if (window.themeReady) draw ();
else window.addEventListener("themeReady", () => { draw(); });