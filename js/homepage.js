//jshint esversion:6
import { HexGrid } from "/lib/Shapes.js";
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

/*
Error: Script terminated by timeout at:
get show@http://127.0.0.1:8080/lib/Shapes.js:252:1
refresh@http://127.0.0.1:8080/lib/Shapes.js:435:9
refreshAll@http://127.0.0.1:8080/lib/Shapes.js:535:13
clear@http://127.0.0.1:8080/lib/Shapes.js:477:11
_drawApi@http://127.0.0.1:8080/lib/Shapes.js:333:10
refresh@http://127.0.0.1:8080/lib/Shapes.js:435:43
refreshAll@http://127.0.0.1:8080/lib/Shapes.js:535:13
clear@http://127.0.0.1:8080/lib/Shapes.js:477:11
_drawApi@http://127.0.0.1:8080/lib/Shapes.js:333:10
refresh@http://127.0.0.1:8080/lib/Shapes.js:435:43
refreshAll@http://127.0.0.1:8080/lib/Shapes.js:535:13
clear@http://127.0.0.1:8080/lib/Shapes.js:477:11
_drawApi@http://127.0.0.1:8080/lib/Shapes.js:333:10
refresh@http://127.0.0.1:8080/lib/Shapes.js:435:43
refreshAll@http://127.0.0.1:8080/lib/Shapes.js:535:13
clear@http://127.0.0.1:8080/lib/Shapes.js:477:11
_drawApi@http://127.0.0.1:8080/lib/Shapes.js:333:10
refresh@http://127.0.0.1:8080/lib/Shapes.js:435:43
refreshAll@http://127.0.0.1:8080/lib/Shapes.js:535:13
clear@http://127.0.0.1:8080/lib/Shapes.js:477:11
_drawApi@http://127.0.0.1:8080/lib/Shapes.js:333:10
refresh@http://127.0.0.1:8080/lib/Shapes.js:435:43
refreshAll@http://127.0.0.1:8080/lib/Shapes.js:535:13
clear@http://127.0.0.1:8080/lib/Shapes.js:477:11
_drawApi@http://127.0.0.1:8080/lib/Shapes.js:333:10
refresh@http://127.0.0.1:8080/lib/Shapes.js:435:43
refreshAll@http://127.0.0.1:8080/lib/Shapes.js:535:13
clear@http://127.0.0.1:8080/lib/Shapes.js:477:11
draw@http://127.0.0.1:8080/lib/Shapes.js:438:10
spin/<@http://127.0.0.1:8080/lib/HexGrid.js:154:11
spin@http://127.0.0.1:8080/lib/HexGrid.js:153:19
draw@http://127.0.0.1:8080/js/homepage.js:14:8
@http://127.0.0.1:8080/js/homepage.js:20:52
window.onload/<@http://127.0.0.1:8080/js/theme.js:61:14
promise callback*window.onload@http://127.0.0.1:8080/js/theme.js:60:6
EventHandlerNonNull*@http://127.0.0.1:8080/js/theme.js:39:1
*/