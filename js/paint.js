//jshint esversion:6
const loadFunc = () => {
  document.getElementById("Capa_1").onclick();
  /*document.getElementById("switchSpan").style.display = "none";
  if (window.themeReady) window.theme.mode = "light";
  else window.addEventListener("themeReady", () => {window.theme.mode = "light";});*/
};
if (document.readyState === "complete") loadFunc();
else window.addEventListener("load", loadFunc);
var color = "#ff0000";
var memory = [];
var drawHistory = [];
var future = [];
var key = {};
let init = () => {
  let c = document.getElementById("canvas");
  let ctx = c.getContext("2d");
  let width = 30;
  let height = 20;
  let ss = 20;
  for (let x = 0; x < width; x++) {
    memory[x] = [];
  }
  c.width = width * ss;
  c.height = height * ss;
  let render = fun => {
    for (let y = 0; y < c.clientHeight / ss; y++) {
      for (let x = 0; x < c.clientWidth / ss; x++) {
        fun(x, y);
        ctx.fillRect(x * ss, y * ss, ss, ss);
      }
    }
    drawHistory.unshift(JSON.parse(JSON.stringify(memory)));
  };
  let reset = () => {
    render((x, y) => {
      if ((x + y) % 2 === 0) ctx.fillStyle = "#d0d0d0";
      else ctx.fillStyle = "#eeeeee";
    });
  };
  reset();
  let draw = event => {
    if (mousedown) {
      let cp = c.getBoundingClientRect();
      let x = Math.floor((event.clientX - cp.left - scrollX) / ss);
      let y = Math.floor((event.clientY - cp.top - scrollY) / ss);
      memory[x][y] = color;
      ctx.fillStyle = color;
      ctx.fillRect(x * ss, y * ss, ss, ss);
    }
  };
  document.querySelector(`[data-color="${color}"]`).classList.add("active");
  for (let e of document.querySelectorAll("[data-color]")) {
    thisColor = e.getAttribute("data-color");
    e.style.setProperty("background-color", thisColor);
    //e.style.setProperty("border-color", $color.invert(thisColor));
    if ($color.isLight(thisColor, "intensityM")) e.style.setProperty("border-color", "#000000");
    else e.style.setProperty("border-color", "#ffffff");
    e.addEventListener("mousedown", event => {
      document.querySelector(`[data-color="${color}"]`).classList.remove("active");
      color = event.target.getAttribute("data-color");
      event.target.classList.add("active");
    });
  }
  let mousedown;
  document.body.addEventListener("keydown", event => {
    key[event.key] = true;
    if (key.Control && key.z) {
      console.log("undo");
      render((x, y) => {
        if (drawHistory[1][x][y]) ctx.fillStyle = drawHistory[1][x][y];
        else if ((x + y) % 2 === 0) ctx.fillStyle = "#d0d0d0";
        else ctx.fillStyle = "#eeeeee";
      });
      future.unshift(drawHistory.shift());
      console.log(drawHistory.length);
      console.log(future.length);
    }
    /*if (key.Control && key.y) {
      console.log("redo");
      render((x, y) => {
        if (future[0][x][y]) ctx.fillStyle = future[0][x][y];
        else if ((x + y) % 2 === 0) ctx.fillStyle = "#d0d0d0";
        else ctx.fillStyle = "#eeeeee";
      });
    drawHistory.unshift(future.shift());
    }*/
  });
  document.body.addEventListener("keyup", event => {
    key[event.key] = false;
  });
  c.addEventListener("mousedown", event => {
    if (event.button === 0) mousedown = true;
    draw(event);
  });
  document.body.addEventListener("mouseup", event => {
    if (event.button === 0) mousedown = false;
  });
  c.addEventListener("mouseup", () => {
    drawHistory.unshift(JSON.parse(JSON.stringify(memory)));
  });
  c.addEventListener("mousemove", draw);
};
if (document.readyState === "interactive") init();
else window.addEventListener("DOMContentLoaded", init);