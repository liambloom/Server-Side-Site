//jshint esversion:6
import { HexGrid } from "/lib/shapes.js";
window.HexGrid = HexGrid;
document.getElementById("Capa_1").style.display = "none";
document.getElementsByTagName("header")[0].removeChild(document.querySelector("a#logo"));
/*let bg = (theme.mode === "light") ? themes[name].offWhite : themes[name].offBlack;
document.getElementById("stop4538").style = `stop-color:${bg};stop-opacity:1`;
document.getElementById("stop4540").style = `stop-color:${bg};stop-opacity:1`;*/
let c = document.getElementById("main");
c.width = window.innerWidth;
c.height = window.innerHeight;
let draw = () => {
  let grid = new HexGrid({ width: 35, color: themes[theme.color].gradientLight, grid: { allowOverflow: true } });
  grid.spin("y", "90deg", "35rpm", "0deg", "(0, 0)", "1.5secs", () => {
    document.getElementById("main").style.display = "none";
    document.getElementById("welcome").className = "reveal";
  });
};
if (window.themeReady) draw ();
else window.addEventListener("themeReady", () => { draw(); });