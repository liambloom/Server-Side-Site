import { Shape } from "/lib/shapes.js";
import pip from "/js/point-in-polygon.js";
window.Shape = Shape;
let held, selected, xOffset, yOffset;
let deleted = 0;
let shapes = [];
let c = document.getElementById("canvas");
let ctx = c.getContext("2d");
let bcr = () => c.getBoundingClientRect();
let mousePosition = event => {
  let localbcr = bcr(); 
  let x = ((event.clientX || event.changedTouches[0].clientX) - localbcr.left - scrollX);
  let y = ((event.clientY || event.changedTouches[0].clientY) - localbcr.top - scrollY);
  return [x, y];
};
let redraw = () => {
  ctx.clearRect(0, 0, 300, 300);
  for (let i = shapes.length - 1; i >= 0; i--) {
    shapes[i].draw(shapes[i].rotations);
  }
};
window.select = id => {
  let old = document.querySelector(".menuTab.selected");
  if (old) old.classList.remove("selected");
  console.log(id);
  document.getElementById("tab" + id).classList.add("selected");
  selected = shapes.find(shape => shape.id === id);
  selected.draw(...selected.rotations);
  shapes.unshift(shapes.splice(shapes.indexOf(selected), 1)[0]);
  document.getElementById("x").value = selected.x;
  document.getElementById("y").value = selected.y;
  document.getElementById("hexColor").value = selected.color.replace("#", "");
  document.getElementById("hexColor").dispatchEvent(new Event("input"));
};
window.newShape = (sides, config) => {
  let shape = new Shape(sides, config);
  shape.draw();
  shape.id = shapes.length + deleted;
  shapes.unshift(shape);
  selected = shape;
  let old = document.querySelector(".menuTab.selected");
  if (old) old.classList.remove("selected");
  let tab = document.createElement("div");
  tab.id = "tab" + shape.id;
  tab.classList = "menuTab selected";
  tab.onclick = () => { select(shape.id); };
  document.getElementById("menuTabs").insertBefore(tab, document.getElementById("newShape"));
  let icon = document.createElement("canvas");
  icon.id = "icon" + shape.id;
  icon.height = 20;
  icon.width = 20;
  tab.appendChild(icon);
  selected.icon = new Shape(shape.sides, {canvas: icon, width: 20, center: "vertical", color: shape.color});
  shape.icon.draw();
  console.log(shapes);
};
let syncColorHSL = (event, element) => {
  document.getElementById(element).value = event.target.value;
  if (/^h/.test(element)) {
    let h = $color.HSLtoHEX(
      document.getElementById("ht").value,
      100,
      50
    );
    document.getElementById("s-key").style.setProperty("background-image", `linear-gradient(${h}, #888888)`);
    document.getElementById("l-key").style.setProperty("background-image", `linear-gradient(#ffffff, ${h}, #000000)`);
  }
  let hex = $color.HSLtoHEX(
    document.getElementById("ht").value,
    document.getElementById("st").value,
    document.getElementById("lt").value
  );
  document.getElementById("hexColor").value = hex.replace("#", "");
  selected.color = hex;
  selected.icon.color = hex;
};
let init = () => {
  newShape(6);
  newShape(3, {color: "#ff0000"});
};
let mousedown = e => {
  for (let shape of shapes) {
    let mousePos = mousePosition(e);
    if (pip(mousePos, shape.points)) {
      select(shape.id);
      selected = held = shapes[0];
      xOffset = held.x - mousePos[0];
      yOffset = held.y - mousePos[1];
      held.draw(...held.rotations);
      break;
    }
  }
};
let mouseup = () => {
  held = undefined;
};
let mousemove = e => {
  let mousePos = mousePosition(e);
  if (held) {
    held.x = mousePos[0] + xOffset;
    held.y = mousePos[1] + yOffset;
    document.getElementById("x").value = held.x;
    document.getElementById("y").value = held.y;
    redraw();
  }
  for (let shape of shapes) {
    if (pip(mousePos, shape.points)) {
      c.classList.add("move");
      break;
    }
    else c.classList.remove("move");
  }
};
c.addEventListener("mousedown", mousedown);
c.addEventListener("touchstart", mousedown);
document.addEventListener("mouseup", mouseup);
document.addEventListener("touchend", mouseup);
c.addEventListener("mousemove", mousemove);
c.addEventListener("touchmove", mousemove);
document.getElementById("newShape").addEventListener("click", () => {
  modal.open("#shapeCreationMenu");
});
document.getElementById("x").addEventListener("input", event => {
  selected.x = parseFloat(event.target.value);
  redraw();
});
document.getElementById("y").addEventListener("input", event => {
  selected.y = parseFloat(event.target.value);
  redraw();
});
document.getElementById("delete").addEventListener("click", () => {
  selected.clear();
  document.getElementById("tab" + selected.id).delete();
  deleted++;
  shapes.shift();
  select(shapes[0].id);
  redraw();
});
document.getElementById("ht").addEventListener("input", event => {
  syncColorHSL(event, "hs");
});
document.getElementById("hs").addEventListener("input", event => {
  syncColorHSL(event, "ht");
});
document.getElementById("st").addEventListener("input", event => {
  syncColorHSL(event, "ss");
});
document.getElementById("ss").addEventListener("input", event => {
  syncColorHSL(event, "st");
});
document.getElementById("lt").addEventListener("input", event => {
  syncColorHSL(event, "ls");
});
document.getElementById("ls").addEventListener("input", event => {
  syncColorHSL(event, "lt");
});
document.getElementById("hexColor").addEventListener("input", event => {
  let hex = "#" + event.target.value;
  if (hex.length === 7) {
    selected.color = hex;
    selected.icon.color = hex;
    let { h, s, l } = $color.HEXtoHSL(hex);
    h = Math.round(h);
    s = Math.round(s);
    l = Math.round(l);
    document.getElementById("ht").value = h;
    document.getElementById("hs").value = h;
    document.getElementById("st").value = s;
    document.getElementById("ss").value = s;
    document.getElementById("lt").value = l;
    document.getElementById("ls").value = l;
    let hSync = $color.HSLtoHEX(
      document.getElementById("ht").value,
      100,
      50
    );
    document.getElementById("s-key").style.setProperty("background-image", `linear-gradient(${hSync}, #888888)`);
    document.getElementById("l-key").style.setProperty("background-image", `linear-gradient(#ffffff, ${hSync}, #000000)`);
  }
});
if (window.themeReady) init();
else window.addEventListener("themeReady", init);