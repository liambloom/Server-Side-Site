import { Shape } from "/lib/shapes.js";

const c2 = document.getElementById("example-2");
const ctx2 = c2.getContext("2d");
const c3 = document.getElementById("example-3");
const ctx3 = c3.getContext("2d");
function example (number, sides, config) {
  const c = document.getElementById("example-" + number);
  config.canvas = c;
  const shape = new Shape(sides, config);
  return shape;
}
window.ex2 = e => {
  const sides = document.getElementById("sides-interact").value;
  const color = document.getElementById("color-interact").value;
  const width = document.getElementById("width-interact").value;
  const x = document.getElementById("x-interact").value;
  const y = document.getElementById("y-interact").value;
  const center = document.getElementById("center-interact").value;
  ctx2.clearRect(0, 0, c2.width, c2.height);
  example(2, parseInt(sides), {
    color: color,
    width: parseInt(width),
    x: parseInt(x),
    y: parseInt(y),
    center: /vertical|origin/.test(center) ? center : "origin"
  }).draw();
  e.style.width = Math.max(e.value.length, 1) + "ch";
};
window.ex3 = e => {
  const axesElements = {
    x: document.getElementById("x-rotation-interact"),
    y: document.getElementById("y-rotation-interact"),
    z: document.getElementById("z-rotation-interact")
  };
  const axes = {};
  for (let i in axesElements) {
    axes[i] = axesElements[i].value;
  }
  for (let i in axes) {
    if (/^\d+(?:\.\d+)?$/.test(axes[i])) {
      axes[i] = parseFloat(axes[i]);
      axesElements[i].classList.replace("string", "number");
    }
    else if (/^".*"$/.test(axes[i])) {
      axesElements[i].classList.replace("number", "string");
      if (/^"\d*\.?\d+\s?(?:r(?:ad(?:ian)?s?)?|d(?:eg(?:ree)?s?)?)"$/i.test(axes[i])) axes[i] = axes[i].replace(/"/g, "");
      else axes[i] = 0;
    }
    else axes[i] = 0;
  }
  ctx3.clearRect(0, 0, c3.width, c3.height);
  example(3, 3, {
    color: root.style.getPropertyValue("--light")
  }).draw(axes.x, axes.y, axes.z);
  e.style.width = Math.max(e.value.length, 1) + "ch";
  
};

function prepare () {
  const light = root.style.getPropertyValue("--light");
  document.getElementById("color-interact").value = light;
  example(1, 4, { color: light }, shape => {
    shape.draw();
  });
  for (let e of document.querySelectorAll("#ex2 .interact")) {
    ex2(e);
  }
  for (let e of document.querySelectorAll("#ex3 .interact")) {
    ex3(e);
  }
  for (let e of document.getElementsByClassName("light-hex")) {
    e.innerHTML = light;
  }
}

if (window.themeReady) prepare();
else window.addEventListener("themeReady", prepare);