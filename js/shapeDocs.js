import { Shape } from "/lib/shapes.js";

function example (number, sides, config, code) {
  const c = document.getElementById("example-" + number);
  config.canvas = c;
  const shape = new Shape(sides, config);
  code(shape);
  return shape;
}
const ex2 = event => {
  const c = document.getElementById("example-2");
  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, c.width, c.height);
  example(2, parseInt(sides.value), {
    color: color.value,
    width: parseInt(width.value),
    x: parseInt(x.value),
    y: parseInt(y.value)
  }, shape => {
    shape.draw();
  });
  event.target.style.width = Math.max(event.target.value.length, 1) + "ch";
};

example(1, 4, { color: "blue" }, shape => {
  shape.draw();
});

const sides = document.getElementById("sides-interact");
const color = document.getElementById("color-interact");
const width = document.getElementById("width-interact");
const x = document.getElementById("x-interact");
const y = document.getElementById("y-interact");
for (let i of [sides, color, width, x, y]) {
  ex2({target: i});
  i.addEventListener("input", ex2); // Why does this do literally nothing at all?
}