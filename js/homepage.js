//jshint esversion:6
document.getElementById("Capa_1").style.display = "none";
let c, ctx, ss, txtSize, textAlignX, textAlignY, funcolors;
c = document.getElementById("main");
ctx = c.getContext("2d");
ss = 20;
c.width = window.innerWidth;
c.height = (window.innerHeight - document.getElementsByTagName("header")[0].clientHeight);
txt = "Welcome!";
ctx.font = "150px Mr Vampire, Comic Sans MS";
ctx.strokeStyle = "#000000";
funcolors = [
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
  for (let y = 0; y < c.clientHeight / ss; y++) {
    for (let x = 0; x < c.clientWidth / ss; x++) {
      ctx.fillStyle = funcolors[Math.floor(Math.random() * 8)];
      ctx.fillRect(x * ss, y * ss, ss, ss);
      ctx.strokeRect(x * ss, y * ss, ss, ss);
    }
  }
  txtSize = ctx.measureText(txt);
  textAlignX = (c.clientWidth / 2) - (txtSize.width / 2);
  textAlignY = (window.innerHeight / 2) - (window.innerHeight - c.clientHeight) + 75;
  ctx.fillStyle = "#ffffff";
  ctx.fillText(txt, textAlignX, textAlignY);
  ctx.strokeText(txt, textAlignX, textAlignY);
};
draw();
setInterval(draw, 500);
let content = document.getElementById("innerContent");
content.style.width = "calc(100% - 100px)";
content.style.height = (window.innerHeight - document.getElementsByTagName("nav")[0].clientHeight) - 100 + "px";