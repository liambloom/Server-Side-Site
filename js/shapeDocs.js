import { Shape } from "/lib/shapes.js";

const c = document.getElementById("example-2");
const ctx = c.getContext("2d");
function example (number, sides, config, code) {
  const c = document.getElementById("example-" + number);
  config.canvas = c;
  const shape = new Shape(sides, config);
  code(shape);
  return shape;
}
window.ex2 = e => {
  const sides = document.getElementById("sides-interact");
  const color = document.getElementById("color-interact");
  const width = document.getElementById("width-interact");
  const x = document.getElementById("x-interact");
  const y = document.getElementById("y-interact");
  const center = document.getElementById("center-interact");
  ctx.clearRect(0, 0, c.width, c.height);
  example(2, parseInt(sides.value), {
    color: color.value,
    width: parseInt(width.value),
    x: parseInt(x.value),
    y: parseInt(y.value),
    center: /vertical|origin/.test(center.value) ? center.value : "origin"
  }, shape => {
    shape.draw();
  });
  e.style.width = Math.max(e.value.length, 1) + "ch";
};
for (let e of document.getElementsByClassName("interact")) {
  ex2(e);
}
example(1, 4, { color: "blue" }, shape => {
  shape.draw();
});