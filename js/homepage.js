//jshint esversion:6
document.getElementById("Capa_1").style.display = "none";
let c = document.getElementById("main");
let ctx = c.getContext("2d");
let ss = 20;
c.width = window.innerWidth;
c.height = (window.innerHeight - document.getElementsByTagName("header")[0].clientHeight);
let txt = "Welcome!";
ctx.font = "bold 150px Times New Roman, Times, serif";
let txtSize = ctx.measureText(txt);
let textAlignX = (c.clientWidth / 2) - (txtSize.width / 2);
let textAlignY = (window.innerHeight / 2) - (window.innerHeight - c.clientHeight) + 75;
let funcolors = [
  "#ff0000",
  "#ff8800",
  "#ffff00",
  "#00ff00",
  "#00ffff",
  "#8800ff",
  "#ff00ff",
  "#0000ff"
];
let draw = () => {
  let color = funcolors[Math.floor(Math.random() * 7)];
  ctx.strokeStyle = "#" +
    (255 - parseInt(color.slice(1, 3), 16)).toString(16).padStart(2, "0") +
    (255 - parseInt(color.slice(3, 5), 16)).toString(16).padStart(2, "0") +
    (255 - parseInt(color.slice(5, 7), 16)).toString(16).padStart(2, "0");
  for (let y = 0; y < c.clientHeight / ss; y++) {
    for (let x = 0; x < c.clientWidth / ss; x++) {
      ctx.fillStyle = funcolors[Math.floor(Math.random() * 8)];
      ctx.fillRect(x * ss, y * ss, ss, ss);
      ctx.strokeRect(x * ss, y * ss, ss, ss);
    }
  }
  ctx.fillStyle = color;
  ctx.fillText(txt, textAlignX, textAlignY);
  ctx.strokeText(txt, textAlignX, textAlignY);
};
draw();
setInterval(draw, 500);