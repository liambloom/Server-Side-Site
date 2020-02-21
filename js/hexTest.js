import { Shape } from "/lib/Shapes.js";
window.Shape = Shape;

window.newShape = (sides, config) => {
  const shape = new Shape(sides, config);
  shape.draw();
  Shape.addInterface("x", document.getElementById("x"), parseInt, Math.round);
  Shape.addInterface("y", document.getElementById("y"), parseInt, Math.round);
  Shape.addInterface("width", document.getElementById("widthT"), parseInt, Math.round);
  Shape.addInterface("width", document.getElementById("widthS"), parseInt, Math.round);
  Shape.addInterface("color", document.getElementById("hexColor"), hex => "#" + hex, hex => hex.slice(1));
};

const init = () => {
  newShape(6, { x: 100, y: 105, color: "#0044ff", draggable: true });
  newShape(3, { x: 200, y: 221, color: "#ff2222", draggable: true });
};
if (window.themeReady) init();
else window.addEventListener("themeReady", init);